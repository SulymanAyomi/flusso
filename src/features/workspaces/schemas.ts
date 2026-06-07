import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional().nullable(),
})

export const createWorkspaceSchema1 = z.object({
    name: z.string().trim().min(1, "Required"),
    imageUrl: z.string().url().optional().nullable(),
    imagePublicId: z.string().optional().nullable(),
})

export const updateWorkspaceSchema = z.object({
    name: z.string().trim().min(1, "Must be 1 or more characters"),
    imageUrl: z.string().url().optional().nullable(),
    imagePublicId: z.string().optional().nullable(),
})

export const transferWorkspaceOwnershipSchema = z.object({
    newOwnerId: z.string(),

})