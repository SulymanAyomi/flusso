import { promise, z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { MemberRole, Role } from "@/features/members/types";
import { calculatePercentageChange, generateInviteCode } from "@/lib/utils";

import { addDays, endOfDay, endOfMonth, endOfToday, endOfWeek, format, startOfDay, startOfMonth, startOfToday, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { TaskPriority, TaskStatus } from "@/features/tasks/types";
import { db } from "@/lib/db";

import { sessionMiddleware } from "@/lib/require-auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { id } from "date-fns/locale";
import { logActivity } from "@/lib/log-activity";
import { ProjectStatus } from "@/features/projects/types";

const app = new Hono()
    .get("/", sessionMiddleware,
        async (c) => {
            const user = c.get("user");
            const workspaces = await db.workspace.findMany({
                where: {
                    members: {
                        some: {
                            userId: user.id
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });

            return c.json(successResponse(workspaces), 200);

        }
    ).get("/:workspaceId", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { workspaceId } = c.req.param()
            const workspace = await db.workspace.findUnique({
                where: {
                    id: workspaceId,
                    members: {
                        some: {
                            userId: user.id
                        }
                    }
                }
            });

            if (!workspace) {
                return c.json(errorResponse("workspace not found"), 404);
            }

            return c.json(successResponse(workspace), 200, {
                'Cache-Control': 'private, max-age=300' // Cache for 3 minutes
            })
        }
    )
    .post("/",
        zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");

                const { name, image } = c.req.valid("form")
                // let uploadedImageUrl: "" | undefined
                let imageUrl = ""

                // if (image instanceof File) {
                //     const file = await storage.createFile(
                //         IMAGE_BUCKET_ID,
                //         ID.unique(),
                //         image
                //     )
                //     const arrayBuffer = await storage.getFilePreview(
                //         IMAGE_BUCKET_ID,
                //         file.$id
                //     )
                //     uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
                // }
                const userId = user.id
                const inviteCode = generateInviteCode(6)

                const workspace = await db.$transaction(async (tx) => {
                    const newWorkspace = await tx.workspace.create({
                        data: {
                            name,
                            imageUrl,
                            inviteCode,
                            ownerId: null
                        }
                    })
                    const member = await tx.member.create({
                        data: {
                            userId,
                            workspaceId: newWorkspace.id,
                            role: "ADMIN"
                        }
                    })
                    const updatedWorkspace = await tx.workspace.update({
                        where: { id: newWorkspace.id },
                        data: { ownerId: member.id }
                    })

                    return updatedWorkspace

                })

                return c.json(successResponse(workspace, "Workspace created"), 201);
            } catch (error) {
                console.log(error)
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    )
    .patch(
        "/:workspaceId",
        zValidator("form", updateWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            try {

                const user = c.get("user");
                if (!user) {
                    return c.json(errorResponse("Unauthourize"), 401)
                }

                const { workspaceId } = c.req.param()
                const { name, image } = c.req.valid("form")

                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        deletedAt: null,
                        members: {
                            some: {
                                userId: user.id
                            }
                        }
                    },
                    include: {
                        members: true
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const member = workspace.members.find((member) => member.userId == user.id)


                if (!member || member.role !== MemberRole.ADMIN) {
                    return c.json(errorResponse("Unauthorized"), 401)
                }

                let uploadedImageUrl: string | undefined

                if (image instanceof File) {
                    // const file = await storage.createFile(
                    //     IMAGE_BUCKET_ID,
                    //     ID.unique(),
                    //     image
                    // )
                    // const arrayBuffer = await storage.getFilePreview(
                    //     IMAGE_BUCKET_ID,
                    //     file.$id
                    // )
                    // uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`

                } else {
                    uploadedImageUrl = image;
                }

                const result = await db.$transaction(async (tx) => {
                    const newWorkspace = await tx.workspace.update({
                        where: {
                            id: workspaceId
                        },
                        data: {
                            name,
                            imageUrl: uploadedImageUrl
                        }
                    })

                    await logActivity(tx, {
                        workspaceId: workspaceId,
                        memberId: member.id,
                        actionType: "WORKSPACE_UPDATED",
                        entityType: "TASK",
                        entityId: null,
                        entityTitle: name,
                        metadata: {
                            "oldName": workspace.name,
                            "image": workspace.imageUrl === uploadedImageUrl
                        },
                    })

                    return newWorkspace
                })

                return c.json(successResponse(result))
            } catch (error) {
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }
    )
    .delete(
        "/:workspaceId", sessionMiddleware,
        async (c) => {
            try {

                const user = c.get("user");

                const { workspaceId } = c.req.param()

                const member = await getMember({
                    workspaceId,
                    userId: user.id
                })

                if (!member || member.role !== MemberRole.ADMIN) {
                    return c.json(errorResponse("Permission denied."), 401)
                }
                const existingWorkspace = await db.workspace.findUnique({
                    where: { id: workspaceId }
                })
                if (!existingWorkspace) {
                    return c.json(errorResponse("Workspace not found"), 404)
                }
                if (member.id !== existingWorkspace.ownerId) {
                    return c.json(errorResponse("Permission denied."), 404)
                }

                await db.$transaction(async (tx) => {
                    const deletedAt = new Date()
                    await tx.workspace.update({
                        where: {
                            id: workspaceId
                        },
                        data: {
                            deletedAt
                        }
                    })

                    await tx.project.updateMany({
                        where: {
                            workspaceId: workspaceId
                        },
                        data: {
                            deletedAt: deletedAt
                        }
                    })

                })

                return c.json({ data: { id: workspaceId } })
            } catch (error) {
                return c.json(errorResponse("Something went wrong"), 500)
            }
        }

    ).post(
        "/:workspaceId/reset-invite-code", sessionMiddleware,

        async (c) => {
            const user = c.get("user");


            const { workspaceId } = c.req.param()

            const member = await getMember({
                workspaceId,
                userId: user.id
            })

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401)
            }


            const workspace = await db.workspace.update({
                where: {
                    id: workspaceId
                },
                data: {
                    inviteCode: generateInviteCode(6)
                }
            })


            return c.json({ data: workspace })

        })
    .post("/:workspaceId/join", sessionMiddleware,

        zValidator("json", z.object({ code: z.string() })),
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.param()
                const { code } = c.req.valid("json")

                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        deletedAt: null,
                    },
                    include: {
                        members: true
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const member = workspace.members.find((member) => member.userId == user.id)

                if (member) {
                    return c.json(errorResponse("You can't join workspace. You are already a memebr."), 400)
                }

                if (workspace?.inviteCode !== code) {
                    return c.json(errorResponse("Invalide invite code"), 400)
                }

                const result = await db.$transaction(async (tx) => {
                    const member = await tx.member.create({
                        data: {
                            workspaceId,
                            userId: user.id,
                            role: MemberRole.MEMBER,
                            imageUrl: ""
                        }
                    })
                    await logActivity(tx, {
                        workspaceId: workspaceId,
                        memberId: member.id,
                        actionType: "JOINED_WORKSPACE",
                        entityType: "MEMBER",
                        entityId: null,
                        entityTitle: "",
                        metadata: {
                        },
                    })

                })

                return c.json(successResponse(workspace), 200)
            } catch (error) {
                console.log(error)
                return c.json(errorResponse("Something went wrong"), 500)

            }
        }
    )
    .get("/:workspaceId/analytics", sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");

                const { workspaceId } = c.req.param()

                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        members: {
                            some: {
                                userId: user.id
                            }
                        }
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const now = new Date();
                const thisMonthStart = startOfMonth(now);
                const thisMonthEnd = endOfMonth(now);
                const lastMonthStart = startOfMonth(subMonths(now, 1));
                const lastMonthEnd = endOfMonth(subMonths(now, 1));
                const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
                const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
                const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

                const [
                    // Project metrics
                    projectMetrics,

                    // Task metrics
                    taskMetrics,

                    // Team & activity metrics
                    teamMetrics
                ] = await Promise.all([
                    // 1. Project metrics (for Project Overview card)
                    Promise.all([
                        // Projects by status
                        db.project.groupBy({
                            by: ['status'],
                            where: { workspaceId, archived: false },
                            _count: true
                        }),
                        // Overdue projects
                        db.project.count({
                            where: {
                                workspaceId,
                                status: { in: [ProjectStatus.ACTIVE, ProjectStatus.ON_HOLD] },
                                endDate: { lt: now }
                            }
                        }),
                        // Completed projects this month
                        db.project.count({
                            where: {
                                workspaceId,
                                status: ProjectStatus.COMPLETED,
                                updatedAt: { gte: thisMonthStart, lte: thisMonthEnd }
                            }
                        }),
                        // Completed projects last month
                        db.project.count({
                            where: {
                                workspaceId,
                                status: ProjectStatus.COMPLETED,
                                updatedAt: { gte: lastMonthStart, lte: lastMonthEnd }
                            }
                        })
                    ]),

                    // 2. Task metrics (for Task Overview card)
                    Promise.all([
                        // Tasks by status
                        db.task.groupBy({
                            by: ['status'],
                            where: { workspaceId },
                            _count: true
                        }),
                        // Overdue tasks
                        db.task.count({
                            where: {
                                workspaceId,
                                status: { not: TaskStatus.DONE },
                                dueDate: { lt: now }
                            }
                        }),
                        // Unassigned tasks
                        db.task.count({
                            where: {
                                workspaceId,
                                status: { not: TaskStatus.DONE },
                                assignedToId: null
                            }
                        }),
                        // Completed tasks this week
                        db.task.count({
                            where: {
                                workspaceId,
                                status: TaskStatus.DONE,
                                completedAt: { gte: thisWeekStart, lte: thisWeekEnd }
                            }
                        }),
                        // Completed tasks last week
                        db.task.count({
                            where: {
                                workspaceId,
                                status: TaskStatus.DONE,
                                completedAt: { gte: lastWeekStart, lte: lastWeekEnd }
                            }
                        })
                    ]),

                    // 3. Team & activity metrics (for Team Member card)
                    Promise.all([
                        // Active members (excluding viewers)
                        db.member.count({
                            where: {
                                workspaceId,
                                role: { not: Role.VIWER }
                            }
                        }),
                        // Viewers
                        db.member.count({
                            where: {
                                workspaceId,
                                role: Role.VIWER
                            }
                        }),
                        // Activities this week by type
                        db.activity.groupBy({
                            by: ['actionType'],
                            where: {
                                workspaceId,
                                createdAt: { gte: thisWeekStart, lte: thisWeekEnd }
                            },
                            _count: true
                        }),
                        // Total activities this week
                        db.activity.count({
                            where: {
                                workspaceId,
                                createdAt: { gte: thisWeekStart, lte: thisWeekEnd }
                            }
                        })
                    ])
                ]);

                // Process project metrics
                const [projectsByStatus, overdueProjects, thisMonthCompleted, lastMonthCompleted] = projectMetrics;

                const projectCounts = projectsByStatus.reduce((acc, item) => {
                    acc[item.status] = item._count;
                    return acc;
                }, {} as Record<string, number>);

                const totalProjects = projectsByStatus.reduce((sum, item) => sum + item._count, 0);
                const activeProjects = projectCounts[ProjectStatus.ACTIVE] || 0;
                const onHoldProjects = projectCounts[ProjectStatus.ON_HOLD] || 0;

                const projectChange = calculatePercentageChange(lastMonthCompleted, thisMonthCompleted);

                // Process task metrics
                const [tasksByStatus, overdueTasks, unassignedTasks, thisWeekCompleted, lastWeekCompleted] = taskMetrics;

                const taskCounts = tasksByStatus.reduce((acc, item) => {
                    acc[item.status] = item._count;
                    return acc;
                }, {} as Record<string, number>);

                const totalTasks = tasksByStatus.reduce((sum, item) => sum + item._count, 0);
                const completedTasks = taskCounts[TaskStatus.DONE] || 0;

                const taskChange = calculatePercentageChange(lastWeekCompleted, thisWeekCompleted);
                // Process team metrics
                const [activeMembers, viewers, activitiesByType, totalActivities] = teamMetrics;

                const activityBreakdown = activitiesByType.reduce((acc, item) => {
                    acc[item.actionType] = item._count;
                    return acc;
                }, {} as Record<string, number>);

                const taskUpdates = activityBreakdown['TASK_STATUS_UPDATED'] || 0;
                const comments = activityBreakdown['COMMENT_ADDED'] || 0;
                const data = {
                    totalProjects,
                    onHoldProjects,
                    overdueProjects,
                    activeProjects,
                    projectChange,
                    totalTasks,
                    completedTasks,
                    overdueTasks,
                    unassignedTasks,
                    taskChange,
                    activeMembers,
                    viewers,
                    totalActivities,
                    comments,
                    taskUpdates
                }
                return c.json(successResponse(data), 200, {
                    'Cache-Control': 'private, max-age=180' // Cache for 3 minutes
                })
            } catch (error) {
                console.error("Dashboard analytics error:", error);
                return c.json(errorResponse("Failed to fetch analytics"), 500);
            }
        })
    .get("/:workspaceId/recentProjects", sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.param()
                // Query parameters
                const limit = Math.min(Number(c.req.query('limit')) || 5, 20); // Max 20
                const status = c.req.query('status') as ProjectStatus | undefined;
                const includeArchived = c.req.query('includeArchived') === 'true';


                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        members: {
                            some: {
                                userId: user.id
                            }
                        }
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const recentProjects = await db.project.findMany({
                    where: {
                        workspaceId
                    },
                    orderBy: {
                        updatedAt: "asc"
                    },
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                    take: 3
                })

                let expandedProjects =
                    await Promise.all(
                        recentProjects.map(async (project) => {
                            const counts = await getTaskCounts(project.id)
                            const percentage = ((counts.total - counts.completed) / counts.total) * 100
                            console.log(counts, percentage, project.id)
                            return {
                                ...project,
                                counts,
                                percentage: percentage ? percentage : 0
                            }

                        })
                    )
                return c.json({
                    data: expandedProjects
                })
            } catch (error) {
                console.error("workspace recent project error:", error);
                return c.json(errorResponse("Failed to fetch workspace recent project"), 500);
            }

        })
    .get("/:workspaceId/highpiority", sessionMiddleware,

        async (c) => {
            const user = c.get("user");

            const { workspaceId } = c.req.param()

            const workspace = await db.workspace.findFirst({
                where: { id: workspaceId }
            })
            if (!workspace) {
                return c.json({ error: 'Workspace not found ' }, 400)
            }

            const member = await getMember(
                {
                    workspaceId: workspaceId,
                    userId: user.id
                }
            )
            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }
            const now = new Date()
            const today = startOfToday()
            const endToday = endOfToday()

            const todayTasks = await db.task.count({
                where: {
                    workspaceId,
                    assignedToId: user.id,
                    dueDate: {
                        equals: today
                    }
                },
            })
            const highpiorityTasks = await db.task.findMany({
                where: {
                    workspaceId,
                    priority: {
                        equals: "HIGH"
                    }
                },
                select: {
                    id: true,
                    name: true,
                    priority: true
                }
            })

            return c.json({
                data: {
                    todayTasks,
                    highpiorityTasks
                }
            })

        })
    .get("/:workspaceId/tasks", sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.param()
                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        members: {
                            some: {
                                userId: user.id
                            },
                        }
                    },
                    select: {
                        id: true,
                        members: {
                            where: {
                                userId: user.id
                            },
                            select: {
                                id: true,
                                role: true
                            }
                        }
                    }
                });

                if (!workspace || workspace.members.length === 0) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const member = workspace.members[0];
                // Date ranges
                const now = new Date();
                const todayStart = startOfDay(now);
                const todayEnd = endOfDay(now);

                const taskSelectFields = {
                    id: true,
                    name: true,
                    priority: true,
                    dueDate: true,
                    status: true,
                    description: true,
                    project: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true
                        }
                    },
                    assignedTo: {
                        select: {
                            id: true,
                            userId: true,
                            user: {
                                select: {
                                    name: true,
                                    imageUrl: true
                                }
                            }
                        }
                    }
                } as const;

                const [
                    highPriorityTasks,
                    dueTodayTasks,
                    myAssignedTasks,
                    overdueTasksCount,
                    upcomingTasksCount
                ] = await Promise.all([
                    // High priority tasks (workspace-wide)
                    db.task.findMany({
                        where: {
                            workspaceId,
                            priority: {
                                in: [TaskPriority.HIGH, TaskPriority.CRITICAL]
                            },
                            status: {
                                notIn: [TaskStatus.DONE] // Exclude completed tasks
                            }
                        },
                        select: taskSelectFields,
                        orderBy: [
                            { priority: 'desc' },
                            { dueDate: 'asc' }
                        ],
                        take: 5
                    }),

                    // Tasks due today (assigned to current user)
                    db.task.findMany({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            dueDate: {
                                gte: todayStart,
                                lte: todayEnd
                            },
                            status: {
                                notIn: [TaskStatus.DONE]
                            }
                        },
                        select: taskSelectFields,
                        orderBy: [
                            { priority: 'desc' },
                            { dueDate: 'asc' }
                        ],
                        take: 5
                    }),
                    // My assigned tasks (all active)
                    db.task.findMany({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            status: {
                                notIn: [TaskStatus.DONE]
                            }
                        },
                        select: taskSelectFields,
                        orderBy: [
                            { priority: 'desc' },
                            { dueDate: 'asc' }
                        ],
                        take: 10
                    }),

                    // Overdue tasks count (for dashboard metrics)
                    db.task.count({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            dueDate: {
                                lt: todayStart
                            },
                            status: {
                                notIn: [TaskStatus.DONE]
                            }
                        }
                    }),

                    // Upcoming tasks (next 7 days)
                    db.task.count({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            dueDate: {
                                gt: todayEnd,
                                lte: addDays(todayEnd, 7)
                            },
                            status: {
                                notIn: [TaskStatus.DONE]
                            }
                        }
                    })
                ]);

                const data = {
                    highPriorityTasks: {
                        tasks: highPriorityTasks,
                        count: highPriorityTasks.length
                    },
                    dueTodayTasks: {
                        tasks: dueTodayTasks,
                        count: dueTodayTasks.length
                    },
                    myAssignedTasks: {
                        tasks: myAssignedTasks,
                        count: myAssignedTasks.length
                    },
                    metrics: {
                        overdueCount: overdueTasksCount,
                        upcomingCount: upcomingTasksCount
                    }
                }

                return c.json(successResponse(data), 200)
            } catch (error) {
                console.error("Task analytics error:", error);
                return c.json(errorResponse("Failed to fetch task analytics"), 500);
            }
        })
    .get("/:workspaceId/analytics/my-tasks", sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId } = c.req.param()
                const member = await db.member.findFirst({
                    where: {
                        userId: user.id,
                        workspace: {
                            id: workspaceId,
                            // status: "ACTIVE"
                        }
                    },
                });
                if (!member) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                // Date ranges
                const now = new Date();
                const todayStart = startOfDay(now);
                const todayEnd = endOfDay(now);
                const yesterdayStart = startOfDay(subDays(now, 1));
                const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
                const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
                const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                const [myIncompleteTasks, completedThisWeekCount, completedLastWeekCount, overdueYesterday] = await Promise.all([
                    db.task.findMany({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            status: { notIn: [TaskStatus.DONE] },
                        },
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            dueDate: true,
                            priority: true,
                            blockedBy: {
                                select: {
                                    dependsOn: {
                                        select: {
                                            id: true,
                                            name: true,
                                            status: true,
                                            dueDate: true,
                                            priority: true,
                                            assignedToId: true
                                        }
                                    }

                                },
                            },
                            dependencies: {
                                select: {
                                    task: {
                                        select: {
                                            id: true,
                                            name: true,
                                            status: true,
                                            dueDate: true,
                                            priority: true,
                                            assignedToId: true

                                        }
                                    }

                                },
                            }
                        },
                    }),
                    db.task.count({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            status: TaskStatus.DONE,
                            completedAt: {
                                gte: thisWeekStart,
                            },
                        }
                    }),
                    db.task.count({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            status: TaskStatus.DONE,
                            completedAt: {
                                gte: lastWeekStart,
                                lte: lastWeekEnd,
                            },
                        },
                    }),
                    // Overdue count as of yesterday (for trend)
                    db.task.count({
                        where: {
                            workspaceId,
                            assignedToId: member.id,
                            status: { notIn: [TaskStatus.DONE] },
                            dueDate: { lt: yesterdayStart },
                        },
                    }),
                ])

                // ===== CARD 1: OVERDUE & URGENT =====

                // Overdue tasks
                const overdueTasks = myIncompleteTasks.filter(
                    (task) => task.dueDate && task.dueDate < todayStart
                );
                const overdueCount = overdueTasks.length;
                const overdueTrend = overdueCount - overdueYesterday;

                // Due today
                const dueTodayTasks = myIncompleteTasks.filter(
                    (task) =>
                        task.dueDate &&
                        task.dueDate >= todayStart &&
                        task.dueDate <= todayEnd
                );
                const dueTodayCount = dueTodayTasks.length;

                // High priority
                const highPriorityTasks = myIncompleteTasks.filter(
                    (task) =>
                        task.priority === TaskPriority.HIGH ||
                        task.priority === TaskPriority.CRITICAL
                );
                const highPriorityCount = highPriorityTasks.length;

                const overdueAndUrgent = {
                    total: overdueCount,
                    dueToday: dueTodayCount,
                    high: highPriorityCount,
                    trend: overdueTrend,
                    trendDirection: overdueTrend > 0 ? 'up' : overdueTrend < 0 ? 'down' : 'same',
                }

                // ===== CARD 2: TASK DEPENDENCY =====

                // Tasks awaiting dependencies (IN_PROGRESS or IN_REVIEW only)
                const tasksAwaitingDependencies = myIncompleteTasks.filter(
                    (task) =>
                        (task.status === TaskStatus.IN_PROGRESS ||
                            task.status === TaskStatus.IN_REVIEW) &&
                        task.blockedBy.some((dep) => dep.dependsOn.status !== TaskStatus.DONE)
                );


                // Count unique incomplete dependencies
                const incompleteDependencyIds = new Set<string>();
                tasksAwaitingDependencies.forEach((task) => {
                    task.blockedBy.forEach((dep) => {
                        if (dep.dependsOn.status !== TaskStatus.DONE) {
                            incompleteDependencyIds.add(dep.dependsOn.id);
                        }
                    });
                });
                // Tasks blocking others (my incomplete tasks that others depend on)
                const myTasksBlockingOthers = myIncompleteTasks.filter((task) =>
                    task.dependencies.some((dep) => dep.task.status !== TaskStatus.DONE)
                );
                const taskDependency = {
                    awaitingDependencies: {
                        count: tasksAwaitingDependencies.length,
                        dependenciesNeeded: incompleteDependencyIds.size,
                    },
                    blockingOthers: {
                        count: myTasksBlockingOthers.length,
                        totalTasksWaiting: myTasksBlockingOthers.reduce(
                            (sum, task) =>
                                sum +
                                task.dependencies.filter((dep) => dep.task.status !== TaskStatus.DONE)
                                    .length,
                            0
                        ),
                    },
                }

                // Completed this week
                const trend = completedThisWeekCount - completedLastWeekCount;
                const trendDirection =
                    trend > 0 ? 'up' : trend < 0 ? 'down' : 'same';
                const completedThisWeek = {
                    count: completedThisWeekCount,
                    trend: Math.abs(trend),
                    trendDirection,
                };

                // ===== CARD 4: PRIORITY HEALTH =====

                const highCount = myIncompleteTasks.filter(
                    (t) => t.priority === TaskPriority.HIGH || t.priority === TaskPriority.CRITICAL
                ).length;
                const mediumCount = myIncompleteTasks.filter(
                    (t) => t.priority === TaskPriority.MEDIUM
                ).length;
                const lowCount = myIncompleteTasks.filter(
                    (t) => t.priority === TaskPriority.LOW
                ).length;
                const totalCount = myIncompleteTasks.length
                const priortyCard = calculateHealthStatus(totalCount, highCount, mediumCount, lowCount)


                const data = {
                    overdueAndUrgent,
                    priortyCard,
                    completedThisWeek,
                    taskDependency,

                }

                return c.json(successResponse(data), 200)
            } catch (error) {
                console.error("Task analytics error:", error);
                return c.json(errorResponse("Failed to fetch task analytics"), 500);
            }
        })
    .get("/:workspaceId/activities", zValidator("query", z.object({
        cursor: z.string().optional(),
        actionType: z.string().optional(),
        entityType: z.string().optional(),
        days: z.coerce.number().min(1).max(90).default(30),
        limit: z.coerce.number().min(1).max(100).default(20),
    })), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { cursor, actionType, entityType, days, limit } = c.req.valid("query")

                const { workspaceId } = c.req.param()

                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        members: {
                            some: {
                                userId: user.id
                            }
                        }
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                // Build where clause dynamically
                const whereClause: any = {
                    workspaceId,
                    // createdAt: {
                    //     gte: subDays(new Date(), days)
                    // }
                };
                // Add optional filters
                if (actionType) {
                    whereClause.actionType = actionType;
                }

                if (entityType) {
                    whereClause.entityType = entityType;
                }

                // Add cursor for pagination
                if (cursor) {
                    whereClause.id = {
                        lt: cursor // Get activities before this cursor
                    };
                }

                const activities = await db.activity.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        actionType: true,
                        entityType: true,
                        entityId: true,
                        entityTitle: true,
                        metadata: true,
                        createdAt: true,
                        member: {
                            select: {
                                id: true,
                                role: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        imageUrl: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: limit + 1 // Fetch one extra to check if there are more
                });

                // Check if there are more results
                const hasMore = activities.length > limit;
                const activitiesData = hasMore ? activities.slice(0, limit) : activities;

                // Get next cursor
                const nextCursor = hasMore ? activitiesData[activitiesData.length - 1].id : null;

                // Group activities by date for better UX
                const groupedActivities = activitiesData.reduce((acc, activity) => {
                    const date = format(new Date(activity.createdAt), 'yyyy-MM-dd');
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(activity);
                    return acc;
                }, {} as Record<string, typeof activitiesData>);

                // Get activity summary statistics
                const [totalActivities, activityBreakdown] = await Promise.all([
                    db.activity.count({
                        where: {
                            workspaceId,
                            createdAt: {
                                gte: subDays(new Date(), days)
                            }
                        }
                    }),
                    db.activity.groupBy({
                        by: ['actionType'],
                        where: {
                            workspaceId,
                            createdAt: {
                                gte: subDays(new Date(), days)
                            }
                        },
                        _count: true
                    })
                ]);
                const data = {
                    activities: activitiesData,
                    groupedByDate: groupedActivities,
                    pagination: {
                        nextCursor,
                        hasMore,
                        limit,
                        total: totalActivities
                    },
                    summary: {
                        total: totalActivities,
                        breakdown: activityBreakdown.reduce((acc, item) => {
                            acc[item.actionType] = item._count;
                            return acc;
                        }, {} as Record<string, number>),
                        dateRange: {
                            from: subDays(new Date(), days),
                            to: new Date()
                        }
                    }
                }
                return c.json(successResponse(data), 200)
            }
            catch (error) {
                console.error("Activities fetch error:", error);
                return c.json({ error: "Failed to fetch activities" }, 500);
            }
        })
    .get("/:workspaceId/projects/analytics", sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");

                const { workspaceId } = c.req.param()

                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId,
                        members: {
                            some: {
                                userId: user.id
                            }
                        },
                    },
                    select: {
                        id: true,
                        members: true,
                        name: true
                    }
                });

                const member = workspace?.members.find((member) => member.userId == user.id)

                if (!workspace || !member) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const now = new Date();
                const thisMonthStart = startOfMonth(now);
                const thisMonthEnd = endOfMonth(now);
                const lastMonthStart = startOfMonth(subMonths(now, 1));
                const lastMonthEnd = endOfMonth(subMonths(now, 1));
                const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
                const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
                const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
                const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

                const [taskByPiority, tasksByStatus, overdueTasks, unassignedTasks, myTasksByStatus, myTotalOverdueTasks, activeMembers, comments, taskUpdates, lastWeekCompleted, thisWeekCompleted] = await Promise.all([

                    //this week tasks by priority
                    db.task.groupBy({
                        by: ['priority'],
                        where: {
                            workspaceId,
                            dueDate: {
                                gte: thisWeekStart,
                                lte: thisWeekEnd,
                            }
                        },
                        _count: true
                    }),

                    // all tasks by status
                    db.task.groupBy({
                        by: ['status'],
                        where: { workspaceId },
                        _count: true
                    }),

                    // Overdue tasks
                    db.task.count({
                        where: {
                            workspaceId,
                            status: { not: TaskStatus.DONE },
                            dueDate: { lt: now }
                        }
                    }),

                    // Unassigned tasks
                    db.task.count({
                        where: {
                            workspaceId,
                            status: { not: TaskStatus.DONE },
                            assignedToId: null
                        }
                    }),

                    // total user assigned task group by task status
                    db.task.groupBy({
                        by: ['status'],
                        where: {
                            workspaceId,
                            assignedToId: member.id
                        },
                        _count: true
                    }),

                    //user Overdue tasks
                    db.task.count({
                        where: {
                            workspaceId,
                            status: { not: TaskStatus.DONE },
                            dueDate: { lt: now },
                            assignedToId: member.id

                        }
                    }),

                    // Active members (excluding viewers)
                    db.member.count({
                        where: {
                            workspaceId,
                            role: { not: Role.VIWER }
                        }
                    }),

                    // comemnts added
                    db.activity.count({
                        where: {
                            workspaceId,

                            actionType: "COMMENT_ADDED",
                            createdAt: {
                                gte: thisWeekStart,
                                lte: thisWeekEnd
                            }
                        }
                    }),
                    // activity count
                    db.activity.count({
                        where: {
                            workspaceId,
                            actionType: "TASK_STATUS_UPDATED",
                            createdAt: {
                                gte: thisWeekStart,
                                lte: thisWeekEnd
                            }
                        }
                    }),

                    // Completed tasks this week
                    db.task.count({
                        where: {
                            workspaceId,
                            status: TaskStatus.DONE,
                            completedAt: { gte: thisWeekStart, lte: thisWeekEnd }
                        }
                    }),
                    // Completed tasks last week
                    db.task.count({
                        where: {
                            workspaceId,
                            status: TaskStatus.DONE,
                            completedAt: { gte: lastWeekStart, lte: lastWeekEnd }
                        }
                    })

                ])
                const thisweekOverdueTasks = taskByPiority.reduce((sum, item) => sum + item._count, 0);
                const taskPriority = taskByPiority.reduce((acc, item) => {
                    acc[item.priority] = item._count;
                    return acc;
                }, {} as Record<string, number>);

                const thisweekHighPriorityTasks = (taskPriority[TaskPriority.HIGH] + taskPriority[TaskPriority.CRITICAL]) || 0
                const thisweekMediumPriorityTasks = taskPriority[TaskPriority.MEDIUM] || 0
                const thisweekLowPriorityTasks = taskPriority[TaskPriority.LOW] || 0
                const taskChange = calculatePercentageChange(lastWeekCompleted, thisWeekCompleted);
                const totalTasks = tasksByStatus.reduce((sum, item) => sum + item._count, 0);
                const tasksStatus = tasksByStatus.reduce((acc, item) => {
                    acc[item.status] = item._count;
                    return acc;
                }, {} as Record<string, number>);
                const completedTasks = tasksStatus[TaskStatus.DONE] || 0

                const totalAssignedTasks = myTasksByStatus.reduce((sum, item) => sum + item._count, 0);
                const assignedTaskStatus = myTasksByStatus.reduce((acc, item) => {
                    acc[item.status] = item._count;
                    return acc;
                }, {} as Record<string, number>);
                const completedAssignedTasks = assignedTaskStatus[TaskStatus.DONE] || 0
                const completedAssignedTaskspercentage = calculatePercentageChange(totalAssignedTasks, completedAssignedTasks)

                const data = {
                    totalTasks,
                    thisweekOverdueTasks,
                    thisweekHighPriorityTasks,
                    thisweekMediumPriorityTasks,
                    thisweekLowPriorityTasks,
                    taskChange,
                    completedTasks,
                    overdueTasks,
                    unassignedTasks,
                    totalAssignedTasks,
                    myTotalOverdueTasks,
                    completedAssignedTasks,
                    completedAssignedTaskspercentage,
                    activeMembers,
                    comments,
                    taskUpdates

                }
                return c.json(successResponse(data), 200)
            } catch (error) {
                console.error("projects analytics error:", error);
                return c.json({ error: "Failed to fetch projects analytics" }, 500);
            }
        })
    .get("/:workspaceId/:projectId/analytics", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { workspaceId, projectId } = c.req.param()

            const workspace = await db.workspace.findUnique({
                where: {
                    id: workspaceId,
                    members: {
                        some: {
                            userId: user.id
                        }
                    },
                    projects: {
                        some: {
                            id: projectId
                        }
                    }
                }
            });

            const workspace1 = await db.workspace.findUnique({
                where: {
                    id: workspaceId,
                    members: {
                        some: {
                            userId: user.id
                        }
                    },

                }
            });

            if (!workspace) {
                return c.json(errorResponse("workspace not found"), 404);
            }
            const data = {
                workspace, workspace1
            }
            return c.json(successResponse(data))
        })


async function getTaskCounts(projectId: string) {
    const [total, completed,] = await Promise.all([
        db.task.count({ where: { projectId } }),
        db.task.count({ where: { projectId, status: 'DONE' } }),
    ]);

    return {
        total, completed
    };
}

function calculateTaskDifference(lastCount: number, thisCount: number) {
    let change = 0
    let direction = "no change"

    if (lastCount > thisCount) {
        change = lastCount - thisCount;
        direction = "less";
    } else if (thisCount > lastCount) {
        change = thisCount - lastCount;
        direction = "more";
    }
    return { change, direction }
}

function calculateHealthStatus(total: number, highCount: number, mediumCount: number, lowCount: number) {
    const highPercentage =
        total > 0 ? Math.round((highCount / total) * 100) : 0;
    const mediumPercentage =
        total > 0 ? Math.round((mediumCount / total) * 100) : 0;
    const lowPercentage =
        total > 0 ? Math.round((lowCount / total) * 100) : 0;

    // Determine health status
    let status: 'healthy' | 'caution' | 'unhealthy';
    let message: string;

    if (highPercentage <= 40) {
        status = 'healthy';
        message = 'Well-balanced priorities';
    } else if (highPercentage <= 60) {
        status = 'caution';
        message = 'Many high-priority tasks—review if all are urgent';
    } else {
        status = 'unhealthy';
        message = 'Priority inflation detected—consider re-prioritizing';
    }

    return {
        distribution: {
            high: highPercentage,
            medium: mediumPercentage,
            low: lowPercentage,
        },
        counts: {
            high: highCount,
            medium: mediumCount,
            low: lowCount,
        },
        health: {
            status,
            message,
        },
        total: total
    }
}

export default app