import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";

import { endOfMonth, endOfToday, endOfWeek, startOfMonth, startOfToday, startOfWeek, subMonths, subWeeks } from "date-fns";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { getMember } from "@/features/members/utils";
import { TaskStatus } from "@/features/tasks/types";
import { db } from "@/lib/db";

import { AppContext } from "@/lib/context"
import { AuthUser } from "@/features/auth/type";
import { requireAuth } from "@/lib/require-auth";
import { error } from "console";
import { ProjectsStatus } from "@/features/projects/types";

const app = new Hono()
    .get("/",
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }

            const members = await db.member.findMany({
                where: {
                    userId: user?.id
                }
            })
            if (members.length === 0) {
                return c.json({ data: [] });
            }
            const workspaceIds = members.map((members) => members.workspaceId);

            const workspaces = await db.workspace.findMany({
                where: {
                    id: {
                        in: workspaceIds
                    }
                }
            })

            return c.json({ data: workspaces })
        }
    ).get("/:workspaceId",
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }
            const { workspaceId } = c.req.param()

            const workspace = await db.workspace.findFirst({ where: { id: workspaceId } })

            const member = await getMember(
                {
                    workspaceId: workspaceId,
                    userId: user.id
                }
            )
            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            return c.json({ data: workspace })
        }
    )
    .post("/",
        zValidator("form", createWorkspaceSchema),
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                throw new Error("Unauthourize")
                return c.json({ workspace: null, error: "Unauthourize" }, 401)
            }
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
            const userId = user.id as string
            const user1 = await db.user.findFirst({
                where: {
                    id: userId
                }
            })
            console.log(user1)

            const inviteCode = generateInviteCode(6)
            const workspace = await db.workspace.create({
                data: {
                    name,
                    imageUrl,
                    inviteCode,
                    ownerId: userId,
                    members: {
                        create: {
                            imageUrl: imageUrl,
                            role: MemberRole.ADMIN,
                            userId: userId,
                        }
                    }
                }
            })
            return c.json({ workspace })
        }
    )
    .patch(
        "/:workspaceId",
        zValidator("form", updateWorkspaceSchema),
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }

            const { workspaceId } = c.req.param()
            const { name, image } = c.req.valid("form")

            const member = await getMember({
                workspaceId,
                userId: user.id
            })

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401)
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


            const workspace = await db.workspace.update({
                where: {
                    id: workspaceId
                },
                data: {
                    name,
                    imageUrl: uploadedImageUrl
                }
            })

            return c.json({ data: workspace })

        }

    )
    .delete(
        "/:workspaceId",
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }

            const { workspaceId } = c.req.param()

            const member = await getMember({
                workspaceId,
                userId: user.id
            })

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            await db.workspace.delete({
                where: {
                    id: workspaceId
                }
            })

            return c.json({ data: { id: workspaceId } })

        }

    ).post(
        "/:workspaceId/reset-invite-code",
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }

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
    .post("/:workspaceId/join",
        zValidator("json", z.object({ code: z.string() })),
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const { workspaceId } = c.req.param()
            const { code } = c.req.valid("json")

            const member = await getMember({
                workspaceId,
                userId: user.id
            })
            if (member) {
                return c.json({ error: "Already a member" }, 400)
            }

            const workspace = await db.workspace.findFirst({
                where: { id: workspaceId }
            })
            if (workspace?.inviteCode !== code) {
                return c.json({ error: "Invalid invite code" }, 400)
            }

            await db.member.create({
                data: {
                    workspaceId,
                    userId: user.id,
                    role: MemberRole.MEMBER,
                    imageUrl: ""
                }
            })
            return c.json({ data: workspace })

        }
    )
    .get("/:workspaceId/analytics",
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const { workspaceId } = c.req.param()

            const workspace = await db.workspace.findUnique({
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
            const thisMonthStart = startOfMonth(now)
            const thisMonthEnd = endOfMonth(now)
            const lastMonthStart = startOfMonth(subMonths(now, 1))
            const lastMonthEnd = endOfMonth(subMonths(now, 1))
            const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 })
            const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 })
            const lastsWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
            const lastsWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
            function calculatePercenatge(lastCount: number, thisCount: number) {
                let change = 0
                let direction = "no change"

                if (lastCount > 0) {
                    const diff = thisCount - lastCount;
                    change = Math.abs((diff / lastCount) * 100);
                    direction = diff > 0 ? "more" : "less";
                } else if (thisCount > 0) {
                    change = 100;
                    direction = "more";
                }
                return { change, direction }
            }

            const totalProject = await db.project.count({
                where: {
                    workspaceId,
                }
            })

            const notStartedProject = await db.project.count({
                where: {
                    workspaceId,
                    status: {
                        equals: ProjectsStatus.ON_HOLD
                    }
                }
            })

            const delayedProject = await db.project.count({
                where: {
                    workspaceId,
                    endDate: {
                        lte: now
                    }
                }
            })

            const activeProject = await db.project.count({
                where: {
                    workspaceId,
                    status: { equals: ProjectsStatus.ACTIVE }
                }
            })

            const thisMonthProjects = await db.project.count({
                where: {
                    workspaceId,
                    createdAt: {
                        gte: thisMonthStart,
                        lt: thisMonthEnd
                    },
                    status: ProjectsStatus.COMPLETED
                }
            })
            const lastMonthProjects = await db.project.count({
                where: {
                    id: workspaceId,
                    createdAt: {
                        gte: lastMonthStart,
                        lt: lastMonthEnd
                    },
                    status: ProjectsStatus.COMPLETED

                }
            })



            let percentageChange = 0
            if (lastMonthProjects > 0) {

                percentageChange = ((thisMonthProjects - lastMonthProjects) / lastMonthProjects) * 100
            }
            const { change: ProdChange, direction: ProdDir } = calculatePercenatge(thisMonthProjects, lastMonthProjects)

            console.log(ProdChange, ProdDir)
            // const taskCompleted = await db.task.count({
            //     where: {
            //         workspaceId: workspaceId,
            //         status: TaskStatus.DONE
            //     }
            // })
            const totalTask = await db.task.count({
                where: {
                    workspaceId: workspaceId,
                }
            })

            const taskCompleted = await db.task.count({
                where: {
                    workspaceId: workspaceId,
                    status: TaskStatus.DONE
                }
            })

            const overDueTask = await db.task.count({
                where: {
                    workspaceId: workspaceId,
                    status: {
                        not: TaskStatus.DONE
                    },
                    dueDate: {
                        lt: now,
                    },

                }
            })
            const UnassignedTask = await db.task.count({
                where: {
                    workspaceId: workspaceId,
                    status: {
                        not: TaskStatus.DONE
                    },
                    assignedToId: null
                }
            })

            const thisWeekTaskCount = await db.task.count({
                where: {
                    workspaceId,
                    // completedAt,
                    updatedAt: {
                        gte: thisWeekStart,
                        lt: thisWeekEnd
                    },
                    status: TaskStatus.DONE
                }
            })

            const lastWeekTaskCount = await db.task.count({
                where: {
                    workspaceId,
                    // completedAt,
                    updatedAt: {
                        gte: lastsWeekStart,
                        lt: lastsWeekEnd
                    },
                    status: TaskStatus.DONE
                }
            })
            const TaskDiff = calculatePercenatge(thisWeekTaskCount, lastWeekTaskCount)

            const totalMember = await db.member.count({
                where: {
                    workspaceId,
                    role: {
                        not: MemberRole.VIWER
                    }
                }
            })

            const totalActivities = await db.activity.count({
                where: {
                    createdAt: {
                        gte: thisWeekStart,
                        lte: thisWeekEnd
                    }
                }
            })

            const totalComments = await db.activity.count({
                where: {
                    actionType: "COMMENT_ADDED",
                    createdAt: {
                        gte: thisWeekStart,
                        lte: thisWeekEnd
                    }
                }
            })

            const totalTasksUpdate = await db.activity.count({
                where: {
                    actionType: "TASK_STATUS_UPDATED",
                    createdAt: {
                        gte: thisWeekStart,
                        lte: thisWeekEnd
                    }
                }
            })
            const totalViwer = await db.member.count({
                where: {
                    workspaceId,
                    role: MemberRole.VIWER
                }
            })

            return c.json({
                data: {
                    totalProject,
                    notStartedProject,
                    delayedProject,
                    activeProject,
                    percentageChange: Math.round(percentageChange),
                    taskCompleted,
                    totalTask,
                    overDueTask,
                    UnassignedTask,
                    TaskDiff,
                    totalMember,
                    totalViwer,
                    totalActivities,
                    totalComments,
                    totalTasksUpdate
                }
            })
        })
    .get("/:workspaceId/recentProjects",
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
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

        })
    .get("/:workspaceId/highpiority",
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
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
    .get("/:workspaceId/tasks",
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
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

            const highpiorityTasks = await db.task.findMany({
                where: {
                    workspaceId,
                    priority: {
                        in: ["HIGH", "CRITICAL"]
                    }
                },
                select: {
                    id: true,
                    name: true,
                    priority: true,
                    dueDate: true,
                    status: true
                },
                take: 5

            })

            const todayTasks = await db.task.findMany({
                where: {
                    workspaceId,
                    assignedToId: user.id,
                    dueDate: {
                        lte: today
                    }
                },
                select: {
                    id: true,
                    name: true,
                    priority: true,
                    dueDate: true,
                    status: true
                },
                take: 5
            })
            const tasks = await db.task.findMany({
                where: {
                    workspaceId,
                    assignedToId: member.id
                },
                select: {
                    id: true,
                    name: true,
                    priority: true,
                    dueDate: true,
                    status: true
                },
                take: 5
            })

            return c.json({
                data: {
                    highpiorityTasks,
                    todayTasks,
                    tasks,
                }
            })

        })
    .get("/:workspaceId/activities",
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
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

            const activities = await db.activity.findMany({
                where: {
                    workspaceId
                },
                take: 5,
                include: {
                    member: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            })

            return c.json({
                data: {
                    activities
                }
            })

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

export default app