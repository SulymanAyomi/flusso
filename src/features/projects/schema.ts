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

export const PromptSchema = z.object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters").max(2000, "Prompt must be less than 2000 characters").trim(),
})

export const AIResponseSchema = z.discriminatedUnion("status", [
    z.object({
        status: z.literal("valid"),
        reason: z.string().optional(),
        rewritten: z.string(),
    }),
    z.object({
        status: z.literal("needs_rewrite"),
        reason: z.string(),
        suggestedRewrite: z.string(),
    }),
    z.object({
        status: z.literal("invalid"),
        reason: z.string(),
        suggestion: z.string(),
    }),
]);

export const AIProjectResponseSchema = z.object({
    name: z.string(),
    description: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    tags: z.array(z.string())

})


export const AItaskResponseSchema = z.object({
    id: z.string(), // unique identifier
    name: z.string(),
    description: z.string(),
    status: z.enum(["todo", "in_progress", "done"]),
    priority: z.enum(["low", "medium", "high"]),

    // Dates: enforce YYYY-MM-DD format with regex
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format, expected YYYY-MM-DD",
    }),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Invalid date format, expected YYYY-MM-DD",
    }),

    dependencies: z.array(z.string()),

    // tags: 1–3 strings
    tags: z
        .array(z.string())
        .min(1, "At least one tag required")
        .max(3, "No more than 3 tags allowed"),
});


export const validatePromptInputSchema = z.object({
    prompt: z.string()
        .min(10, 'Prompt must be at least 10 characters')
        .max(2000, 'Prompt must be less than 2000 characters')
        .trim()
});

export type ValidatePromptInput = z.infer<typeof validatePromptInputSchema>;

/**
 * Success response schema
 */
export const validatePromptSuccessSchema = z.object({
    valid: z.literal(true),
    rewrittenPrompt: z.string(),
    reason: z.null(),
    suggestions: z.null()
});


export const validatePromptFailureSchema = z.object({
    valid: z.literal(false),
    reason: z.string(),
    type: z.enum([
        'PROMPT_TOO_SHORT',
        'PROMPT_TOO_LONG',
        'PROMPT_NOT_A_PROJECT',
        'PROMPT_TOO_VAGUE',
        'PROMPT_CONTAINS_MULTIPLE_PROJECTS',
        'PROMPT_CONTAINS_MALICIOUS_CONTENT'
    ]),
    rewrittenPrompt: z.null(),
    suggestions: z.array(z.string()).optional(),
    metadata: z.object({
        currentLength: z.number().optional(),
        maxLength: z.number().optional(),
        detectedProjects: z.array(z.string()).optional()
    }).optional()
});


export const validatePromptResponseSchema = z.union([
    validatePromptSuccessSchema,
    validatePromptFailureSchema
]);

export type ValidatePromptResponse = z.infer<typeof validatePromptResponseSchema>;

export const generateProjectInputSchema = z.object({
    prompt: z.string()
        .min(10, 'Prompt must be at least 10 characters')
        .max(2000, 'Prompt must be less than 2000 characters')
        .trim()
});

export type GenerateProjectInput = z.infer<typeof generateProjectInputSchema>;

export const taskSchema = z.object({
    title: z.string()
        .min(1, 'Task title is required')
        .max(200, 'Task title too long'),
    description: z.string()
        .max(1000, 'Task description too long'),
    priority: z.enum(['low', 'medium', 'high']),
    tags: z.array(z.string())
        .max(5, 'Maximum 5 tags per task'),
    dependsOn: z.array(z.string())
        .max(10, 'Maximum 10 dependencies per task'),
    estimatedDays: z.number()
        .int()
        .min(1, 'Estimated days must be at least 1')
        .max(30, 'Estimated days cannot exceed 30')
});

export type Task = z.infer<typeof taskSchema>;

/**
 * Project schema (from AI)
 */
export const projectSchema = z.object({
    name: z.string()
        .min(1, 'Project name is required')
        .max(100, 'Project name too long'),
    description: z.string()
        .max(500, 'Project description too long'),
    estimatedDurationDays: z.number()
        .int()
        .min(1, 'Duration must be at least 1 day')
        .max(365, 'Duration cannot exceed 365 days')
});

export type Project = z.infer<typeof projectSchema>;

/**
 * AI response schema (what Gemini returns)
 */
export const aiGenerationResponseSchema = z.object({
    project: projectSchema,
    tasks: z.array(taskSchema)
        .min(1, 'At least 1 task is required')
        .max(15, 'Maximum 15 tasks allowed')
});



export type AIGenerationResponse = z.infer<typeof aiGenerationResponseSchema>;

/**
 * Final API response schema (after processing)
 */
export const generationResponseSchema = z.object({
    project: projectSchema.extend({
        id: z.string().optional(),
        startDate: z.string(), // ISO 8601
        endDate: z.string()    // ISO 8601
    }),
    tasks: z.array(taskSchema.extend({
        id: z.string(),
        dueDate: z.string() // ISO 8601
    }))
});
export type GenerationResponse = z.infer<typeof generationResponseSchema>;

export const saveAiGeneratedProjectSchema = z.object({
    workspaceId: z.string(),
    data: generationResponseSchema
})