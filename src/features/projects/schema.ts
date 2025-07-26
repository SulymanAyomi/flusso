import { z } from "zod"
import { ProjectsStatus } from "./types"

export const createAIProjectSchema = z.object({
    userPrompt: z.string().trim().min(1, "Required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional(),
    workspaceId: z.string()
})

export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, "Required").optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional(),
    // workspaceId: z.string(),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectsStatus, { required_error: "Required" }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
})

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional(),
    workspaceId: z.string(),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectsStatus, { required_error: "Required" }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    tags: z.array(z.string())




})