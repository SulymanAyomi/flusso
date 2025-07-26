import { z } from "zod";

export const createTagsSchema = z.object({
    workspaceId: z.string(),
    name: z.string(),
})