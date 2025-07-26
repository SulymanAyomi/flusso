import { z } from "zod";
import model from "@/lib/gemini";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfToday, startOfWeek, subMonths, subWeeks } from "date-fns";

import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createProjectSchema, updateProjectSchema } from "../schema";

import { validationPrompt, createProjectPrompt, createProjectTaskJson } from "@/lib/prompt";

import { TaskStatus } from "@/features/tasks/types";
import { requireAuth } from "@/lib/require-auth";
import { db } from "@/lib/db";
import workspaceId from "@/app/(dashboard)/workspaces/[workspaceId]/page";
import { ProjectsStatus } from "../types";
import { logActivity } from "@/lib/log-activity";
import { MemberRole } from "@/features/members/types";


async function getTaskCounts(projectId: string) {
    const [total, completed, In_progress, overdue] = await Promise.all([
        db.task.count({ where: { projectId } }),
        db.task.count({ where: { projectId, status: 'DONE' } }),
        db.task.count({ where: { projectId, status: { not: 'DONE' } } }),
        db.task.count({ where: { projectId, dueDate: { lt: new Date() } } }),
    ]);

    return {
        total, completed, In_progress, overdue
    };
}

const app = new Hono()
    .get("/",
        zValidator("query", z.object({
            workspaceId: z.string(),
            status: z.nativeEnum(ProjectsStatus).nullish(),
            ownerId: z.string().nullish(),
            search: z.string().nullish(),
            dueDate: z.string().nullish(),
        })),
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                return c.json({ error: "unauthorized" }, 401);
            }

            const { workspaceId, status, ownerId, search, dueDate } = c.req.valid("query")

            console.log(workspaceId, status, ownerId, search, dueDate)

            if (!workspaceId) {
                return c.json({ error: "Workspace not found" }, 404)
            }

            const member = await getMember({
                workspaceId,
                userId: user.id
            })

            if (!member) {
                return c.json({ error: "unauthorized" }, 401);
            }

            let query: Record<string, any> = {}
            query.workspaceId = workspaceId

            if (ownerId) {
                query.createdById = ownerId
            }
            if (status) {
                query.status = {
                    equals: status
                }
            }
            if (search) {
                query.name = {
                    contains: search,
                    mode: "insensitive"
                }
            }
            if (dueDate) {
                query.endDate = {
                    equals: dueDate
                }
            }

            const projects = await db.project.findMany({
                where: query
            })

            let expandedProjects =
                await Promise.all(
                    projects.map(async (project) => {
                        const counts = await getTaskCounts(project.id)
                        const percentage = ((counts.total - counts.completed) / counts.total) * 100

                        return {
                            ...project,
                            counts,
                            percentage: percentage ? percentage : 0
                        }

                    })
                )

            return c.json({ data: expandedProjects })
        }
    ).get("/qucik-project",
        zValidator("query", z.object({
            workspaceId: z.string(),

        })),
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                return c.json({ error: "unauthorized" }, 401);
            }

            const { workspaceId } = c.req.valid("query")

            if (!workspaceId) {
                return c.json({ error: "Workspace not found" }, 404)
            }
            const member = await getMember({
                workspaceId,
                userId: user.id
            })
            if (!member) {
                return c.json({ error: "unauthorized" }, 401);
            }
            let query: Record<string, any> = {}
            query.workspaceId = workspaceId



            const projects = await db.project.findMany({
                where: {
                    workspaceId
                },
                select: {
                    id: true,
                    name: true,
                    imageUrl: true
                }
            })

            return c.json({ data: projects })
        }
    )
    // .get("/chats",
    //     zValidator("query", z.object({ projectId: z.string() })),
    //     async (c) => {
    //           const user = await requireAuth(c)

    //                     if (!user) {
    //                         throw new Error("Unauthourize")
    //                     }
    // const { projectId } = c.req.valid("query")

    // if (!projectId) {
    //     return c.json({ error: "Project missing" }, 400)
    // }

    // const project = await db.project.findUnique({
    //     where:{
    //         id: projectId
    //     }
    // })
    // if (!project) {
    //     return c.json({ error: "Project missing" }, 400)
    // }
    // const member = await getMember({
    //     workspaceId: project.id,
    //     userId: user.id
    // })
    // if (!member) {
    //     return c.json({ error: "unauthorized" }, 401);
    // }



    // await chats = await db.aINote.findMany({
    //     where:{
    //         wo
    //     }
    // })

    // return c.json({ data: chats })

    // }
    // )
    .get("/:projectId",
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }

            const { projectId } = c.req.param()

            const project = await db.project.findUnique({
                where: {
                    id: projectId
                }
            })
            if (!project) {
                return c.json({ error: "Project not found" }, 404)
            }
            const member = await getMember(
                {
                    workspaceId: project.workspaceId,
                    userId: user.id
                }
            )
            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            const team = await db.member.findMany({
                where: {
                    Task: {
                        some: {
                            projectId
                        }
                    }
                },
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }

                }
            })

            return c.json({ data: project, team })
        })
    .post("/",
        zValidator("json", createProjectSchema),
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }

            const { name, image, workspaceId, description,
                startDate,
                endDate, status, tags } = c.req.valid("json")
            console.log(name, image, workspaceId, description,
                startDate,
                endDate,)

            const member = await getMember({
                workspaceId,
                userId: user.id,

            })
            if (!member) {
                return c.json({ error: "unauthorized" }, 400);
            }

            let uploadedImageUrl: string | undefined

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
            const imageUrl = ""

            const tagRecords = await Promise.all(
                tags.map(async (tag: string) => {
                    const normalized = tag.trim()
                    return db.tags.upsert({
                        where: {
                            workspaceId_name: {
                                workspaceId: workspaceId as string,
                                name: normalized
                            }
                        },
                        update: {},
                        create: {
                            workspaceId,
                            name: normalized
                        }
                    })
                })
            )
            const now = new Date()
            const thisMonthStart = startOfMonth(now)
            const thisMonthEnd = endOfMonth(now)
            const project = await db.project.create({
                data: {
                    name,
                    imageUrl,
                    workspaceId,
                    description,
                    status: status,
                    createdById: member.id,
                    archived: false,
                    startDate: startDate ?? thisMonthStart,
                    endDate: endDate ?? thisMonthEnd,
                }
            })
            await db.projectTags.createMany({
                data: tagRecords.map((tag) => ({
                    projectId: project.id,
                    tagId: tag.id
                })),
                skipDuplicates: true
            })

            await logActivity({
                workspaceId,
                memberId: member.id,
                actionType: "PROJECT_CREATED",
                entityType: "PROJECT",
                entityId: project.id,
                entityTitle: project.name,
                metadata: {},
            })
            return c.json({ data: project })
        }
    )
    // .post("/validate",
    //     // sessionMiddleware,
    //     zValidator("form", createProjectSchema),
    //     async (c) => {
    //         try {
    //             const { userPrompt } = c.req.valid("form")

    //             const result = await model.generateContent(validationPrompt(userPrompt))

    //             const validPrompt = result.response.text().trim()
    //             if (validPrompt.startsWith('valid')) {
    //                 return c.json({ data: { valid: true, feedback: null } });
    //             } else if (validPrompt.startsWith('invalid')) {
    //                 const feedback = validPrompt.replace('invalid:', '').trim();
    //                 return c.json({ data: { valid: false, feedback: feedback } }, 200)
    //             } else {
    //                 throw new Error('Unexpected response format from Gemini');
    //             }

    //         } catch (error) {
    //             console.error(error)
    //             return c.json({ error: "'Failed to validate prompt'" }, 500);

    //         }
    //     }
    // )
    .patch(
        "/:projectId",
        zValidator("json", createProjectSchema),
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }

            const { projectId } = c.req.param()
            const { name, image, endDate, startDate, status, description } = c.req.valid("json")


            const existingProject = await db.project.findUnique({
                where: {
                    id: projectId
                }
            })
            if (!existingProject) {
                return c.json({ error: "Project not found" }, 404)

            }

            const member = await getMember({
                workspaceId: existingProject.workspaceId,
                userId: user.id
            })

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            let uploadedImageUrl: string | undefined

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

            // } else {
            //     uploadedImageUrl = image;
            // }
            const imageUrl = ""
            // const project = await databases.updateDocument(
            //     DATABASE_ID,
            //     PROJECTS_ID,
            //     projectId,
            //     {
            //         name,
            //         imageUrl: uploadedImageUrl,
            //     }
            // )
            const project = await db.project.update({
                where: {
                    id: projectId,

                },
                data: {
                    name,
                    imageUrl,
                    status,
                    startDate,
                    endDate,
                    description
                }
            })

            return c.json({ data: project })

        }

    )
    .delete(
        "/:projectId",
        async (c) => {
            const user = await requireAuth(c)

            if (!user) {
                throw new Error("Unauthourize")
            }

            const { projectId } = c.req.param()



            const existingProject = await db.project.findUnique({
                where: {
                    id: projectId
                }
            })
            if (!existingProject) {
                return c.json({ error: "Project not found" }, 404)

            }

            const member = await getMember({
                workspaceId: existingProject!.workspaceId,
                userId: user.id
            })
            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }

            await db.project.delete({
                where: {
                    id: projectId
                }
            })

            return c.json({ data: { id: projectId } })

        }

    )
    .get("/all/analytics",
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = await requireAuth(c)
            if (!user) {
                throw new Error("Unauthourize")
            }

            const { workspaceId } = c.req.valid("query")

            if (!workspaceId) {
                return c.json({ error: "Workspace not found" }, 404)
            }

            const workspace = await db.workspace.findUnique({
                where: {
                    id: workspaceId
                }
            })

            if (!workspace) {
                return c.json({ error: "Workspace not found" }, 404)

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
            const today = startOfToday()
            const tomorrow = addDays(today, 1)
            const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 })
            const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 })
            const lastsWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
            const lastsWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })


            const totalTasksCount = await db.task.count({
                where: {
                    workspaceId

                }
            })
            const totalCompletedTasksCount = await db.task.count({
                where: {
                    workspaceId,
                    status: "DONE"

                }
            })
            const totalDelayTasksCount = await db.task.count({
                where: {
                    workspaceId

                }
            })
            const totalNotStartedTasksCount = await db.task.count({
                where: {
                    workspaceId

                }
            })
            const highPriorityTasksCount = await db.task.count({
                where: {
                    workspaceId,
                    priority: {
                        equals: "HIGH"
                    }

                }
            })
            const medPriorityTasksCount = await db.task.count({
                where: {
                    workspaceId,
                    priority: {
                        equals: "MEDIUM"
                    }
                }
            })
            const lowPriorityTasksCount = await db.task.count({
                where: {
                    workspaceId,
                    priority: {
                        equals: "LOW"
                    }

                }
            })

            const completedProjectCount = await db.project.count({
                where: {
                    workspaceId
                }
            })

            const totalOverdueTasksCount = await db.task.count({
                where: {
                    workspaceId,
                    status: {
                        not: "DONE"
                    },
                    dueDate: {
                        lt: now
                    }
                }
            })

            const thisMonthTasks = await db.task.count({
                where: {
                    workspaceId,
                    createdAt: {
                        gte: thisMonthStart,
                        lt: thisMonthEnd
                    }
                }
            })

            const lastMonthTasks = await db.project.count({
                where: {
                    workspaceId,
                    createdAt: {
                        gte: lastMonthStart,
                        lt: lastMonthEnd
                    }
                }
            })

            const taskDifference = ((thisMonthTasks - lastMonthTasks) / thisMonthTasks) * 100

            const TotalAssignedTasks =
                await db.task.count({
                    where: {
                        workspaceId,
                        assignedToId: member.id,
                    }
                })

            const completedAssignedTasks =
                await db.task.count({
                    where: {
                        workspaceId,
                        assignedToId: member.id,
                        status: "DONE"
                    }
                })

            const overdueAssignedTasks =
                await db.task.count({
                    where: {
                        workspaceId,
                        assignedToId: member.id,
                        status: {
                            not: "DONE"
                        },
                        dueDate: {
                            lt: now
                        }
                    }
                })
            const todayAssignedTasks =
                await db.task.count({
                    where: {
                        workspaceId,
                        assignedToId: member.id,
                        startDate: { lte: today },
                        dueDate: { gte: today, lt: tomorrow }

                    }
                })

            const thisweekAssignedTasks = await db.task.count({
                where: {
                    workspaceId,
                    assignedToId: member.id,
                    createdAt: {
                        gte: thisWeekStart,
                        lte: thisWeekEnd,
                    },

                }
            })
            const lastweekAssignedTasks = await db.task.count({
                where: {
                    workspaceId,
                    assignedToId: member.id,
                    createdAt: {
                        gte: lastsWeekStart,
                        lte: lastsWeekEnd,
                    },

                }
            })

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
                    workspaceId,
                    createdAt: {
                        gte: thisWeekStart,
                        lte: thisWeekEnd
                    }
                }
            })

            const totalComments = await db.activity.count({
                where: {
                    workspaceId,

                    actionType: "COMMENT_ADDED",
                    createdAt: {
                        gte: thisWeekStart,
                        lte: thisWeekEnd
                    }
                }
            })

            const totalTasksUpdate = await db.activity.count({
                where: {
                    workspaceId,
                    actionType: "TASK_STATUS_UPDATED",
                    createdAt: {
                        gte: thisWeekStart,
                        lte: thisWeekEnd
                    }
                }
            })

            function calculateTaskDiff(lastCount: number, thisCount: number) {
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


            const TaskDiff = calculateTaskDiff(lastweekAssignedTasks, thisweekAssignedTasks)
            return c.json({
                data: {
                    totalCompletedTasksCount,
                    totalTasksCount,
                    totalDelayTasksCount,
                    totalNotStartedTasksCount,
                    highPriorityTasksCount,
                    medPriorityTasksCount,
                    lowPriorityTasksCount,
                    completedProjectCount,
                    totalOverdueTasksCount,
                    taskDifference,
                    TotalAssignedTasks,
                    completedAssignedTasks,
                    overdueAssignedTasks,
                    todayAssignedTasks,
                    TaskDiff,
                    totalMember,
                    totalTasksUpdate,
                    totalComments,
                    totalActivities
                }
            })
        })
// .get("/:projectId/analytics",
//     sessionMiddleware,
//     async (c) => {
//         const user = await requireAuth(c)

//         if (!user) {
//             throw new Error("Unauthourize")
//         }

//         const { projectId } = c.req.param()

//         const project = await db.project.findUnique({
//             where: {
//                 id: projectId
//             }
//         })
//         if (!project) {
//             return c.json({ error: "Project not found" }, 404)

//         }

//         const member = await getMember(
//             {
//                 workspaceId: project.workspaceId,
//                 userId: user.id
//             }
//         )
//         if (!member) {
//             return c.json({ error: "Unauthorized" }, 401)
//         }

//         const now = new Date()
//         const thisMonthStart = startOfMonth(now)
//         const thisMonthEnd = endOfMonth(now)
//         const lastMonthStart = startOfMonth(subMonths(now, 1))
//         const lastMonthEnd = endOfMonth(subMonths(now, 1))


//         const totalTasksCount = await db.task.count({
//             where: {
//                 workspaceId: project.workspaceId,

//             }
//         })
//         const totalDelayTasksCount = await db.task.count({
//             where: {
//                 workspaceId: project.workspaceId,

//             }
//         })
//         const totalNotStartedTasksCount = await db.task.count({
//             where: {
//                 workspaceId: project.workspaceId,

//             }
//         })
//         const highProTasksCount = await db.task.count({
//             where: {
//                 workspaceId: project.workspaceId,

//             }
//         })
//         const medProTasksCount = await db.task.count({
//             where: {
//                 workspaceId: project.workspaceId,

//             }
//         })
//         const lowProTasksCount = await db.task.count({
//             where: {
//                 workspaceId: project.workspaceId,

//             }
//         })

//         const thisMonthTasks = await db.project.findMany({
//             where: {
//                 id: projectId,
//                 createdAt: {
//                     gte: thisMonthStart,
//                     lt: thisMonthEnd
//                 }
//             }
//         })

//         const lastMonthTasks = await db.project.findMany({
//             where: {
//                 id: projectId,
//                 createdAt: {
//                     gte: lastMonthStart,
//                     lt: lastMonthEnd
//                 }
//             }
//         })

//         const taskCount = thisMonthTasks.length
//         const taskDifference = taskCount - lastMonthTasks.length

//         const thisMonthAssignedTasks =
//             await db.task.findMany({
//                 where: {
//                     projectId: projectId,
//                     assignedToId: member.id,
//                     createdAt: {
//                         gte: thisMonthStart,
//                         lt: thisMonthEnd
//                     }
//                 }
//             })

//         const lastMonthAssignedTasks = await db.task.findMany({
//             where: {
//                 projectId: projectId,
//                 assignedToId: member.id,
//                 createdAt: {
//                     gte: lastMonthStart,
//                     lt: lastMonthEnd
//                 }
//             }
//         })

//         const assignedTaskCount = thisMonthAssignedTasks.length
//         const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.length

//         const thisMonthIncompleteTasks = await db.task.findMany({
//             where: {
//                 projectId, status: {
//                     not: "DONE"
//                 },
//                 createdAt: {
//                     gte: thisMonthStart,
//                     lt: thisMonthEnd
//                 }
//             }
//         })

//         const lastMonthIncompleteTasks = await db.task.findMany({
//             where: {
//                 projectId, status: {
//                     not: "DONE"

//                 },
//                 createdAt: {
//                     gte: lastMonthStart,
//                     lt: lastMonthEnd
//                 }
//             }
//         })

//         const incompleteTaskCount = thisMonthIncompleteTasks.length
//         const incompleteTaskDifference =
//             incompleteTaskCount - lastMonthIncompleteTasks.length

//         const thisMonthCompletedTasks = await db.task.count({
//             where: {
//                 projectId,
//                 status: {
//                     equals: "DONE"

//                 }, createdAt: {
//                     gte: thisMonthStart,
//                     lt: thisMonthEnd
//                 }
//             }
//         })

//         const lastMonthCompletedTasks = await db.task.count({
//             where: {
//                 projectId,
//                 status: {
//                     equals: "DONE"

//                 }, createdAt: {
//                     gte: lastMonthStart,
//                     lt: lastMonthEnd
//                 }
//             }
//         })


//         const completedTaskCount = thisMonthCompletedTasks
//         const completedTaskDifference =
//             completedTaskCount - lastMonthCompletedTasks

//         const thisMonthOverdueTasks = await db.task.count({
//             where: {
//                 projectId,
//                 status: {
//                     not: "DONE"

//                 },
//                 dueDate: {
//                     lt: now,
//                 },
//                 createdAt: {
//                     gte: thisMonthStart,
//                     lt: thisMonthEnd
//                 }
//             }
//         })

//         const lastMonthOverdueTasks = await db.task.count({
//             where: {
//                 projectId,
//                 status: {

//                     not: "DONE"

//                 },
//                 dueDate: {
//                     lt: now,
//                 },
//                 createdAt: {
//                     gte: lastMonthStart,
//                     lt: lastMonthEnd
//                 }
//             }
//         })

//         const overDueTaskCount = thisMonthOverdueTasks
//         const overDueTaskCountDifference =
//             overDueTaskCount - lastMonthOverdueTasks
//         return c.json({
//             data: {
//                 taskCount,
//                 taskDifference,
//                 assignedTaskCount,
//                 assignedTaskDifference,
//                 completedTaskCount,
//                 completedTaskDifference,
//                 incompleteTaskCount,
//                 incompleteTaskDifference,
//                 overDueTaskCount,
//                 overDueTaskCountDifference
//             }
//         })
//     })



export default app