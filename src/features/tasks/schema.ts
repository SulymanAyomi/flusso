import { z } from "zod";
// import { TaskStatus } from "./types";
import { TaskPriority, TaskStatus } from "@/generated/prisma";


export const createTaskSchema = z.object({
    name: z.string().min(1, "Required"),
    status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
    priority: z.nativeEnum(TaskPriority, { required_error: "Required" }),
    workspaceId: z.string().trim().min(1, "Required"),
    projectId: z.string().trim().min(1, "Required"),
    startDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    assignedToId: z.string().nullable(),
    description: z.string().optional(),
    comment: z.string().optional(),
    subTask: z.array(z.string()),
    tags: z.array(z.string()),
    dependencies: z.array(z.string()),
})



export const createTaskDependenciesSchema = z.object({
    dependencies: z.array(z.string()),

})

export const createSubTaskSchema = z.object({
    name: z.string(),
    isDone: z.boolean()

})
export const changeSubTaskSchema = z.object({
    id: z.string(),
    isDone: z.boolean()

})
export const createMultipleSubTaskSchema = z.object({
    subTasks: z.array(z.object({
        name: z.string(),
        isDone: z.boolean()
    })),
})
export const createCommentsSchema = z.object({
    content: z.string().min(2, "2 or more characters is required"),
})
