import { z } from "zod"

export const assignMemberProject = z.object({
    projectsId: z.array(z.string()),

})