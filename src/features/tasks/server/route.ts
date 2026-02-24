import { Hono } from "hono";
import { string, z } from "zod"
// import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { getMember } from "@/features/members/utils";
import { changeSubTaskSchema, createCommentsSchema, createSubTaskSchema, createTaskDependenciesSchema, createTaskSchema } from "../schema";
import { Task, TaskStatus } from "../types";
import { ProjectType } from "@/features/projects/types";
import { db } from "@/lib/db";
import { endOfMonth, startOfMonth } from "date-fns";
import { logActivity } from "@/lib/log-activity";
import { hasCircularDependency } from "@/lib/dep-check";
import { sessionMiddleware } from "@/lib/require-auth";
import { successResponse } from "@/lib/api-response";


const app = new Hono()
    .delete("/:taskId", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { taskId } = c.req.param()

            const task = await db.task.findUnique({
                where: {
                    id: taskId
                }
            })
            if (!task) {
                return c.json({ error: "task not found" }, 400)
            }
            const member = await getMember({
                workspaceId: task.workspaceId,
                userId: user.id
            })
            if (!member) {
                return c.json({ error: "Unauthorized" }, 401)
            }


            await db.task.delete({
                where: {
                    id: taskId
                }
            })

            return c.json({ data: { id: task.id } })
        }
    )
    .get("/",
        zValidator(
            "query",
            z.object({
                workspaceId: z.string(),
                projectId: z.string().nullish(),
                assignedToId: z.string().nullish(),
                status: z.nativeEnum(TaskStatus).nullish(),
                search: z.string().nullish(),
                dueDate: z.string().nullish(),
            })
        ),
        sessionMiddleware,
        async (c) => {
            const user = c.get("user");
            const { workspaceId,
                projectId,
                assignedToId,
                status,
                search,
                dueDate
            } = c.req.valid("query")

            console.log(workspaceId,
                projectId,
                assignedToId,
                status,
                search,
                dueDate)

            const member = await getMember({
                workspaceId,
                userId: user.id
            })
            if (!member) {
                return c.json({ error: "unauthorized" }, 401)
            }
            let query: Record<string, any> = {}

            query.workspaceId = workspaceId


            if (projectId) {
                query.projectId = projectId
            }
            if (assignedToId) {
                query.assignedToId = assignedToId
            }
            if (search) {
                query.name = {
                    contains: search,
                    mode: "insensitive"
                }
            }
            if (status) {
                query.status = {
                    equals: status
                }
            }

            if (dueDate) {
                query.dueDate = {
                    equals: dueDate
                }
            }

            const tasks = await db.task.findMany({
                where: query,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    },
                    project: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true
                        }
                    },
                    blockedBy: {
                        select: {
                            id: true
                        }
                    },
                }

            })

            if (tasks.length == 0) {
                return c.json({
                    data: {
                        documents: [],
                        total: 0
                    }
                })
            }

            return c.json({
                data: {
                    documents: tasks,
                    total: tasks.length

                }
            })
        }
    )
    .post("/",
        zValidator("json", createTaskSchema), sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const {
                name,
                status,
                workspaceId,
                projectId,
                dueDate,
                startDate,
                assignedToId,
                description,
                priority,
                tags,
                subTask,
                comment,
                dependencies
            } = c.req.valid("json")
            console.log("bava", c.req.valid("json"))

            const member = await getMember({
                workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }
            // prevent circular dependency
            if (dependencies.length > 0) {
                const existing = await db.task.findMany({
                    where: { id: { in: dependencies } },
                    select: { id: true }
                })
                const exisitingIds = new Set(existing.map(t => t.id))
                const missing = dependencies.filter(id => !exisitingIds.has(id))
                if (missing.length > 0) {
                    return c.json({
                        error: "Some dependencies do not exist", missing
                    }, 400)
                }
            }
            const highestPositionTask = await db.task.findMany({
                where: {
                    status,
                    workspaceId
                },
                orderBy: {
                    position: "asc"
                },
                take: 1
            })

            const newPosition = highestPositionTask.length > 0 ? highestPositionTask[0].position + 1000 : 1000

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
            const task = await db.task.create({
                data: {
                    name,
                    status,
                    workspaceId,
                    projectId,
                    startDate: startDate ?? thisMonthStart,
                    dueDate: dueDate ?? thisMonthEnd,
                    assignedToId,
                    position: newPosition,
                    description,
                    priority,

                }
            })

            if (dependencies.length > 0) {
                await db.taskDependency.createMany({
                    data: dependencies.map((dependsOnId) => ({
                        taskId: task.id,
                        dependsOnId,
                    }))
                });
            }

            await db.taskTags.createMany({
                data: tagRecords.map((tag) => ({
                    taskId: task.id,
                    tagId: tag.id
                })),
                skipDuplicates: true
            })
            if (subTask.length > 0) {
                await db.subtask.createMany({
                    data: subTask.map((sub) => ({
                        taskId: task.id,
                        name: sub
                    })),
                    skipDuplicates: true
                })
            }
            if (comment) {
                await db.comment.create({
                    data: {
                        userId: member.id,
                        content: comment,
                        taskId: task.id
                    }
                })
            }

            await logActivity({
                workspaceId,
                memberId: member.id,
                actionType: "TASK_CREATED",
                entityType: "TASK",
                entityId: task.id,
                entityTitle: task.name,
                metadata: {},
            })


            return c.json({ data: task })
        }
    )
    .patch("/:taskId",
        zValidator("json", createTaskSchema.partial()), sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const { taskId } = c.req.param()

            const {
                name,
                status,
                description,
                projectId,
                dueDate,
                assignedToId,
                dependencies
            } = c.req.valid("json")
            console.log(name,
                status,
                description,
                projectId,
                dueDate,
                assignedToId,
                dependencies)

            const exisitingTask = await db.task.findUnique({
                where: {
                    id: taskId
                }
            })

            if (!exisitingTask) {
                return c.json({ error: "task not found" }, 400)
            }


            const member = await getMember({
                workspaceId: exisitingTask.workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }

            const task = await db.task.update({
                where: {
                    id: taskId
                },
                data: {
                    name,
                    status,
                    description,
                    projectId,
                    dueDate,
                    assignedToId,
                }
            })

            if (dependencies && dependencies?.length > 0) {
                // Check for circular dependency
                const hasCycle = await hasCircularDependency(taskId, dependencies);
                if (hasCycle) {
                    return c.json({ error: 'Circular dependency detected.' }, { status: 400 });
                }
                await db.taskDependency.deleteMany({
                    where: { taskId },
                });

                // Add new dependencies
                const newLinks = dependencies.map((dependsOnId: string) => ({
                    taskId,
                    dependsOnId,
                }));

                await db.taskDependency.createMany({ data: newLinks });
            }

            return c.json({ data: task })

        }
    )
    .patch("/:taskId/dependencies",
        zValidator("json", createTaskDependenciesSchema), sessionMiddleware,
        async (c) => {

            const user = c.get("user");


            const { taskId } = c.req.param()

            const {
                dependencies
            } = c.req.valid("json")

            if (!dependencies) {
                return c.json({ error: "dependencies not found" }, 400)
            }

            const exisitingTask = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true,
                    projectId: true
                }
            })

            if (!exisitingTask) {
                return c.json({ error: "task not found" }, 400)
            }


            const member = await getMember({
                workspaceId: exisitingTask.workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }

            if (dependencies && dependencies?.length > 0) {
                // Check for circular dependency
                const hasCycle = await hasCircularDependency(taskId, dependencies);
                if (hasCycle) {
                    return c.json({ error: 'Circular dependency detected.' }, { status: 409 });
                }

                await db.taskDependency.deleteMany({
                    where: { taskId },
                });

                // Add new dependencies
                const newLinks = dependencies.map((dependsOnId: string) => ({
                    taskId,
                    dependsOnId,
                }));

                await db.taskDependency.createMany({ data: newLinks });
            }

            return c.json({ data: exisitingTask }, { status: 200 })

        }
    )
    .get("/:taskId/dependencies", sessionMiddleware,
        async (c) => {

            const user = c.get("user");
            const { taskId } = c.req.param()

            const exisitingTask = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    name: true,
                    workspaceId: true,
                    projectId: true,
                    blockedBy: true
                }
            })

            if (!exisitingTask) {
                return c.json({ error: "task not found" }, 400)
            }

            const member = await getMember({
                workspaceId: exisitingTask.workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }

            const otherTasks = await db.task.findMany({
                where: {
                    projectId: exisitingTask.projectId
                },
                select: {
                    id: true,
                    name: true
                }
            })
            const data = {
                task: exisitingTask,
                otherTasks: otherTasks
            }

            return c.json(successResponse(data), { status: 200 })

        }
    )
    .get("/:taskId", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }

            const { taskId } = c.req.param()

            const task = await db.task.findUnique({
                where: {
                    id: taskId
                },
                include: {
                    assignedTo: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    imageUrl: true
                                }
                            }
                        }
                    },
                    project: {
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true
                        }
                    },
                    dependencies: true,
                    blockedBy: true
                }
            })

            if (!task) {
                return c.json({ error: 'Task not found' }, 400)
            }

            const currentMember = await getMember({
                workspaceId: task.workspaceId,
                userId: user.id
            })

            if (!currentMember) {
                return c.json({ error: "unauthorized" }, 401)
            }

            return c.json({
                data: {
                    task
                }
            })

        }
    )
    .get("/:taskId/activities", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { taskId } = c.req.param()

            const task = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true
                }
            })
            if (!task) {
                return c.json({ error: 'Task not found' }, 400)
            }
            const currentMember = await getMember({
                workspaceId: task.workspaceId,
                userId: user.id
            })

            if (!currentMember) {
                return c.json({ error: "unauthorized" }, 401)
            }
            const activities = await db.activity.findMany({
                where: {
                    workspaceId: task?.workspaceId,
                    entityId: taskId
                },
                include: {
                    member: {
                        select: {
                            user: {
                                select: {
                                    name: true,
                                    imageUrl: true
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

        }
    )
    .get("/:taskId/subtasks", sessionMiddleware,
        async (c) => {
            const user = c.get("user");


            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }

            const { taskId } = c.req.param()

            const task = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true,
                    Subtask: true
                }
            })
            if (!task) {
                return c.json({ error: 'Task not found' }, 400)
            }
            const currentMember = await getMember({
                workspaceId: task.workspaceId,
                userId: user.id
            })

            if (!currentMember) {
                return c.json({ error: "unauthorized" }, 401)
            }
            const subTask = task.Subtask

            return c.json({
                data: {
                    subTask
                }
            })

        }
    )
    .post("/:taskId/subtasks",
        zValidator("json", createSubTaskSchema), sessionMiddleware,
        async (c) => {
            const user = c.get("user");


            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const { taskId } = c.req.param()

            const { name, isDone } = c.req.valid("json")


            const exisitingTask = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true,
                    name: true
                }
            })

            if (!exisitingTask) {
                return c.json({ error: "task not found" }, 400)
            }


            const member = await getMember({
                workspaceId: exisitingTask.workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }

            // const subtaskList = subTasks.map((task) => ({
            //     taskId,
            //     name: task.name,
            //     isDone: task.isDone
            // }))

            // const subTask = await db.subtask.createMany({
            //     data: subtaskList,
            //     skipDuplicates: true
            // })

            const subTask = await db.subtask.create({
                data: {
                    taskId,
                    name,
                    isDone
                },
            })

            await logActivity({
                workspaceId: exisitingTask.workspaceId,
                memberId: member.id,
                actionType: "SUBTASK_ADDED",
                entityType: "TASK",
                entityId: taskId,
                entityTitle: exisitingTask.name,
                metadata: {
                    "subTaskName": subTask.name
                },
            })

            return c.json({ data: subTask })
        }
    )
    .patch("/:taskId/subtasks",
        zValidator("json", changeSubTaskSchema), sessionMiddleware,
        async (c) => {
            const user = c.get("user");


            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const { taskId } = c.req.param()

            const { id, isDone } = c.req.valid("json")


            const exisitingTask = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true,
                    name: true
                }
            })

            if (!exisitingTask) {
                return c.json({ error: "task not found" }, 400)
            }


            const member = await getMember({
                workspaceId: exisitingTask.workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }

            const subTask = await db.subtask.update({
                where: {
                    id,
                    taskId
                },
                data: {
                    isDone
                }
            })
            if (!subTask) {
                return c.json({ error: "subtask not found" }, 400)
            }


            // await logActivity({
            //     workspaceId: exisitingTask.workspaceId,
            //     memberId: member.id,
            //     actionType: "SUBTASK_ADDED",
            //     entityType: "TASK",
            //     entityId: subTask.id,
            //     entityTitle: subTask.name,
            //     metadata: {
            //         "task_name": exisitingTask.name
            //         ""
            //     },
            // })

            return c.json({ data: subTask })
        }
    )
    .delete("/:taskId/subtasks",
        zValidator("json", changeSubTaskSchema), sessionMiddleware,
        async (c) => {
            const user = c.get("user");


            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const { taskId } = c.req.param()

            const { id, isDone } = c.req.valid("json")


            const exisitingTask = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true,
                    name: true
                }
            })

            if (!exisitingTask) {
                return c.json({ error: "task not found" }, 400)
            }


            const member = await getMember({
                workspaceId: exisitingTask.workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }

            const subTask = await db.subtask.delete({
                where: {
                    id,
                    taskId
                },

            })
            if (!subTask) {
                return c.json({ error: "subtask not found" }, 400)
            }


            await logActivity({
                workspaceId: exisitingTask.workspaceId,
                memberId: member.id,
                actionType: "SUBTASK_DELETED",
                entityType: "TASK",
                entityId: taskId,
                entityTitle: exisitingTask.name,
                metadata: {
                    "subTaskName": subTask.name
                },
            })

            return c.json({ data: subTask })
        }
    ).post("/:taskId/comments",
        zValidator("json", createCommentsSchema), sessionMiddleware,
        async (c) => {
            const user = c.get("user");


            if (!user) {
                return c.json({ error: "Unauthourize" }, 401)
            }
            const { taskId } = c.req.param()

            const { content } = c.req.valid("json")

            const exisitingTask = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true,
                    name: true
                }
            })

            if (!exisitingTask) {
                return c.json({ error: "task not found" }, 400)
            }


            const member = await getMember({
                workspaceId: exisitingTask.workspaceId,
                userId: user.id
            })
            if (!member) {
                c.json({ error: "Unauthorized" }, 401)
            }


            const comment = await db.comment.create({
                data: {
                    taskId,
                    content,
                    userId: member.id
                },
            })

            await logActivity({
                workspaceId: exisitingTask.workspaceId,
                memberId: member.id,
                actionType: "COMMENT_ADDED",
                entityType: "TASK",
                entityId: taskId,
                entityTitle: exisitingTask.name,
                metadata: {
                },
            })

            return c.json({ data: comment })
        }
    )
    .get("/:taskId/comments", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { taskId } = c.req.param()

            const task = await db.task.findUnique({
                where: {
                    id: taskId
                },
                select: {
                    id: true,
                    workspaceId: true,
                }

            })
            if (!task) {
                return c.json({ error: 'Task not found' }, 400)
            }
            const currentMember = await getMember({
                workspaceId: task.workspaceId,
                userId: user.id
            })

            if (!currentMember) {
                return c.json({ error: "unauthorized" }, 401)
            }
            const comments = await db.comment.findMany({
                where: {
                    taskId
                },
                select: {
                    id: true,
                    content: true,
                    // createdAt: true,
                    user: {
                        select: {
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }

            })

            return c.json({
                data: {
                    comments
                }
            })

        }
    )
    .post("/bulk-update",
        zValidator(
            "json",
            z.object({
                tasks: z.array(
                    z.object({
                        id: z.string(),
                        status: z.nativeEnum(TaskStatus),
                        position: z.number().int().positive().min(1000).max(1_000_000)
                    })
                )
            })
        ), sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                if (!user) {
                    return c.json({ error: "Unauthourize" }, 401)
                }
                const { tasks } = c.req.valid("json")

                const tasksToUpdate = await db.task.findMany({
                    where: {
                        id: {
                            in: tasks.map((task) => task.id)
                        }
                    }
                })
                const workspaceIds = new Set(tasksToUpdate.map(task => task.workspaceId))
                if (workspaceIds.size !== 1) {
                    return c.json({ error: "All tasks must belong to the sane workspace." })

                }
                console.log("workspaceIds", workspaceIds)
                const workspaceId = workspaceIds.values().next().value as string

                const member = await getMember({
                    workspaceId,
                    userId: user.id
                })

                if (!member) {
                    return c.json({ error: "Unauthorized" }, 401)
                }

                // const updatedTasks = await Promise.all(
                //     tasks.map(async (task) => {
                //         const { $id, status, position } = task
                //         return databases.updateDocument<Task>(
                //             DATABASE_ID,
                //             TASKS_ID,
                //             $id,
                //             { status, position }
                //         )
                //     })
                // )

                const batchUpdate = tasks.map((task) => db.task.update({
                    where: { id: task.id },
                    data: {
                        status: task.status,
                        position: task.position
                    }
                }))

                const updatedTasks = await db.$transaction(batchUpdate)
                return c.json({ data: updatedTasks })
            } catch (error) {
                console.error("batch", error)
            }
        }
    )

export default app