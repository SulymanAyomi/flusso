import { z, ZodError } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfToday, startOfWeek, subMonths, subWeeks } from "date-fns";

import { getMember } from "@/features/members/utils";

import { createProjectSchema, PromptSchema, validatePromptInputSchema, aiGenerationResponseSchema, saveAiGeneratedProjectSchema } from "../schema";

import { generateTaskPrompt, } from "@/lib/prompt";

import { TaskPriority, TaskStatus } from "@/features/tasks/types";
import { db } from "@/lib/db";
import { ProjectStatus } from "../types";
import { logActivity } from "@/lib/log-activity";
import { MemberRole } from "@/features/members/types";
import { ai, safetySetting, validatePromptWithAI } from "@/lib/gemini";
import { sessionMiddleware } from "@/lib/require-auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { containsMaliciousContent, sanitizePrompt } from "@/lib/validate/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";
import { calculateProjectDates, calculateTaskDates } from "@/lib/calculate-date";
import { autoFixCircularDependencies, hasCircularDependencies, resolveDependencies } from "@/lib/dependencies";

const validationResponse = [
    {
        User: "Tell me a joke",
        response: {
            "valid": false,
            "reason": "This is not related to project or task management. Try asking to create a project, plan tasks, or organize a schedule.",
            "rewrittenPrompt": null,
            "type": "PROMPT_NOT_A_PROJECT",
            "suggestions": ["Create a marketing campaign for Q4", "Build a portfolio website with a blog", "Plan a product launch event"], // If applicable
        }
    },
    {
        User: "Build an app",
        response:
        {
            "valid": false,
            "reason": "Your prompt 'Build an app' is too vague. What kind of website would you like to create?",
            "type": "PROMPT_TOO_VAGUE",
            "rewrittenPrompt": null,
            "suggestions": [
                "Build a portfolio website to showcase design work",
                "Create an e-commerce store for handmade products",
                "Design a blog platform for tech tutorials"
            ]
        }
    },
    {
        User: "Plan a training session",
        response:
        {
            "valid": true,
            "reason": null,
            "suggestions": null,
            "rewritten": "Create a project plan for organizing a training session, including scheduling, content preparation, and participant management."
        }
    },
    {
        User: "Plan a bungalow project",
        response:
        {
            "valid": true,
            "reason": null,
            "suggestions": null,
            "rewritten": "Create a project plan for constructing a bungalow, detailing phases like design, procurement, construction, and inspection."

        }
    }
]
const generateProjectResponseExample = {
    "project": {
        "name": "Portfolio Website Development",
        "description": "Create a professional portfolio website showcasing case studies, blog, and contact form with modern design and responsive layout",
        "estimatedDurationDays": 30,
        // "startDate": "2026-02-13",
        // "endDate": "2026-03-15"
    },
    "tasks": [
        {
            // "id": "task-1",
            "title": "Research design trends and competitor portfolios",
            "description": "Analyze top designer portfolios and current web design trends to inform the visual direction",
            "priority": "high",
            "tags": ["research", "design"],
            "dependsOn": [],
            "estimatedDays": 3,
            // "dueDate": "2026-02-16"
        },
        {
            // "id": "task-2",
            "title": "Create wireframes and site architecture",
            "description": "Design low-fidelity wireframes for all pages and plan the site structure and navigation",
            "priority": "high",
            "tags": ["design", "wireframes"],
            "dependsOn": ["task-1"],
            "estimatedDays": 4,
            // "dueDate": "2026-02-21"
        },
        {
            // "id": "task-3",
            "title": "Design high-fidelity mockups",
            "description": "Create polished visual designs for homepage, case study pages, blog, and contact form",
            "priority": "high",
            "tags": ["design", "ui"],
            "dependsOn": ["task-2"],
            "estimatedDays": 5,
            // "dueDate": "2026-02-27"
        },
        {
            // "id": "task-4",
            "title": "Set up development environment and tooling",
            "description": "Initialize Next.js project, configure Tailwind CSS, and set up Git repository",
            "priority": "medium",
            "tags": ["development", "setup"],
            "dependsOn": [],
            "estimatedDays": 1,
            // "dueDate": "2026-02-14"
        },
        {
            // "id": "task-5",
            "title": "Build homepage and navigation",
            "description": "Develop responsive homepage with hero section, featured work, and navigation menu",
            "priority": "high",
            "tags": ["development", "frontend"],
            "dependsOn": ["task-3", "task-4"],
            "estimatedDays": 3,
            // "dueDate": "2026-03-03"
        },
        {
            // "id": "task-6",
            "title": "Implement case study pages",
            "description": "Create dynamic case study template with image galleries and project details",
            "priority": "high",
            "tags": ["development", "frontend"],
            "dependsOn": ["task-5"],
            "estimatedDays": 4,
            // "dueDate": "2026-03-08"
        },
        {
            // "id": "task-7",
            "title": "Build blog functionality",
            "description": "Implement blog with markdown support, categories, and search",
            "priority": "medium",
            "tags": ["development", "cms"],
            "dependsOn": ["task-5"],
            "estimatedDays": 4,
            // "dueDate": "2026-03-08"
        },
        {
            // "id": "task-8",
            "title": "Create contact form with validation",
            "description": "Build contact form with email integration and spam protection",
            "priority": "medium",
            "tags": ["development", "forms"],
            "dependsOn": ["task-5"],
            "estimatedDays": 2,
            // "dueDate": "2026-03-06"
        },
        {
            // "id": "task-9",
            "title": "Implement SEO and meta tags",
            "description": "Add SEO optimization, Open Graph tags, and sitemap generation",
            "priority": "medium",
            "tags": ["seo", "optimization"],
            "dependsOn": ["task-6", "task-7"],
            "estimatedDays": 2,
            // "dueDate": "2026-03-11"
        },
        {
            // "id": "task-10",
            "title": "Test across devices and browsers",
            "description": "Perform comprehensive testing on mobile, tablet, desktop and major browsers",
            "priority": "high",
            "tags": ["testing", "qa"],
            "dependsOn": ["task-6", "task-7", "task-8"],
            "estimatedDays": 3,
            // "dueDate": "2026-03-12"
        },
        {
            // "id": "task-11",
            "title": "Deploy to production",
            "description": "Set up hosting on Vercel, configure domain, and deploy website",
            "priority": "high",
            "tags": ["deployment", "devops"],
            "dependsOn": ["task-10"],
            "estimatedDays": 1,
            // "dueDate": "2026-03-14"
        }
    ]
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const app = new Hono()
    .get("/",
        zValidator("query", z.object({
            workspaceId: z.string(),
            status: z.nativeEnum(ProjectStatus).optional(),
            ownerId: z.string().optional(),
            search: z.string().optional(),
            dueDate: z.string().optional(),
            limit: z.string().optional(),
        })),
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId, status, ownerId, search, dueDate, limit } = c.req.valid("query")

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
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
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
                const queryLimit = Math.min(Number(limit) || 10, 20); // Max 20

                const projects = await db.project.findMany({
                    where: query,
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        imageUrl: true,
                        status: true,
                        archived: true,
                        startDate: true,
                        endDate: true,
                        createdAt: true,
                        updatedAt: true,
                        workspaceId: true,
                        owner: {
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
                        },
                        tasks: {
                            select: {
                                id: true,
                                status: true,
                                priority: true
                            }
                        },
                        ProjectTags: {
                            select: {
                                tag: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        updatedAt: 'desc'
                    },
                    take: queryLimit
                })

                // Calculate task statistics efficiently
                const projectsWithStats = projects.map(project => {
                    const tasks = project.tasks;

                    // Count tasks by status
                    const taskStats = {
                        total: tasks.length,
                        completed: tasks.filter(t => t.status === TaskStatus.DONE).length,
                        inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
                        todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
                        backlog: tasks.filter(t => t.status === TaskStatus.BACKLOG).length,
                        inReview: tasks.filter(t => t.status === TaskStatus.IN_REVIEW).length
                    };

                    // Count by priority
                    const priorityStats = {
                        critical: tasks.filter(t => t.priority === TaskPriority.CRITICAL).length,
                        high: tasks.filter(t => t.priority === TaskPriority.HIGH).length,
                        medium: tasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
                        low: tasks.filter(t => t.priority === TaskPriority.LOW).length
                    };

                    // Calculate completion percentage (handle division by zero)
                    const completionPercentage = taskStats.total > 0
                        ? Math.round((taskStats.completed / taskStats.total) * 100)
                        : 0;

                    // Calculate project health
                    const now = new Date();
                    const isOverdue = project.endDate && new Date(project.endDate) < now && project.status !== ProjectStatus.COMPLETED;
                    const daysUntilDue = project.endDate
                        ? Math.ceil((new Date(project.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                        : null;

                    // Determine project health status
                    let healthStatus: 'on-track' | 'at-risk' | 'overdue' = 'on-track';
                    if (isOverdue) {
                        healthStatus = 'overdue';
                    } else if (daysUntilDue !== null && daysUntilDue <= 7 && completionPercentage < 70) {
                        healthStatus = 'at-risk';
                    }

                    // Extract tags
                    const tags = project.ProjectTags.map(pt => pt.tag);

                    // Remove tasks from response (we only needed them for calculations)
                    const { tasks: _, ProjectTags: __, ...projectData } = project;

                    return {
                        ...projectData,
                        tags,
                        stats: {
                            tasks: taskStats,
                            priorities: priorityStats,
                            completionPercentage,
                            healthStatus,
                            daysUntilDue,
                            isOverdue: isOverdue || false
                        }
                    };
                });

                return c.json(successResponse(projectsWithStats), 200, {
                    'Cache-Control': 'private, max-age=180' // Cache for 3 minutes
                })

            } catch (error) {
                console.error("fetch all workpace projects error:", error);
                return c.json(errorResponse("Failed to fetch workspace projects"), 500);
            }
        }
    )
    .get(
        "/p",
        zValidator(
            "query",
            z.object({
                workspaceId: z.string(),
                status: z.nativeEnum(ProjectStatus).optional(),
                ownerId: z.string().optional(),
                search: z.string().optional(),
                dueDate: z.string().optional(),
                limit: z.number().optional(),
                cursor: z.string().optional(), // For future cursor pagination
            })
        ),
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { workspaceId, status, ownerId, search, dueDate, limit, cursor } =
                    c.req.valid("query");

                // 1️⃣ Validate workspace
                const workspace = await db.workspace.findUnique({
                    where: {
                        id: workspaceId, deletedAt: null,
                        members: { some: { userId: user.id } },
                    },
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }

                // 2️⃣ Build project filter
                const projectFilter: Record<string, any> = { workspaceId };

                if (ownerId) projectFilter.createdById = ownerId;
                if (status) projectFilter.status = { equals: status };
                if (search)
                    projectFilter.name = { contains: search, mode: "insensitive" };
                if (dueDate) projectFilter.endDate = { equals: dueDate };

                // 3️⃣ Pagination settings
                const queryLimit = Math.min(Number(limit) || 10, 20);

                // 4️⃣ Fetch projects (only metadata)
                const projects = await db.project.findMany({
                    where: projectFilter,
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        imageUrl: true,
                        status: true,
                        archived: true,
                        startDate: true,
                        endDate: true,
                        createdAt: true,
                        updatedAt: true,
                        workspaceId: true,
                        owner: {
                            select: {
                                id: true,
                                role: true,
                                user: { select: { id: true, name: true, imageUrl: true } },
                            },
                        },
                        ProjectTags: { select: { tag: { select: { id: true, name: true } } } },
                    },
                    orderBy: [{ createdAt: "desc" }], // stable for MVP
                    take: queryLimit,
                });

                const projectIds = projects.map((p) => p.id);

                // 5️⃣ Aggregate task stats in DB
                const taskStats = await db.task.groupBy({
                    by: ["projectId", "status", "priority"],
                    where: { projectId: { in: projectIds } },
                    _count: { id: true },
                });

                // 6️⃣ Transform task stats per project
                const statsByProject: Record<string, any> = {};

                projects.forEach((p) => {
                    statsByProject[p.id] = {
                        tasks: { total: 0, completed: 0, inProgress: 0, todo: 0, backlog: 0, inReview: 0 },
                        priorities: { critical: 0, high: 0, medium: 0, low: 0 },
                    };
                });

                taskStats.forEach((row) => {
                    const s = statsByProject[row.projectId];
                    s.tasks.total += row._count;
                    // Status counts
                    switch (row.status) {
                        case TaskStatus.DONE:
                            s.tasks.completed += row._count;
                            break;
                        case TaskStatus.IN_PROGRESS:
                            s.tasks.inProgress += row._count;
                            break;
                        case TaskStatus.TODO:
                            s.tasks.todo += row._count;
                            break;
                        case TaskStatus.BACKLOG:
                            s.tasks.backlog += row._count;
                            break;
                        case TaskStatus.IN_REVIEW:
                            s.tasks.inReview += row._count;
                            break;
                    }
                    // Priority counts
                    switch (row.priority) {
                        case TaskPriority.CRITICAL:
                            s.priorities.critical += row._count;
                            break;
                        case TaskPriority.HIGH:
                            s.priorities.high += row._count;
                            break;
                        case TaskPriority.MEDIUM:
                            s.priorities.medium += row._count;
                            break;
                        case TaskPriority.LOW:
                            s.priorities.low += row._count;
                            break;
                    }
                });

                // 7️⃣ Compute business logic in Node
                const now = new Date();
                const projectsWithStats = projects.map((project) => {
                    const stats = statsByProject[project.id];
                    const completionPercentage =
                        stats.tasks.total > 0
                            ? Math.round((stats.tasks.completed / stats.tasks.total) * 100)
                            : 0;

                    const isOverdue =
                        project.endDate && new Date(project.endDate) < now && project.status !== ProjectStatus.COMPLETED;

                    const daysUntilDue = project.endDate
                        ? Math.ceil((new Date(project.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                        : null;

                    let healthStatus: "on-track" | "at-risk" | "overdue" = "on-track";
                    if (isOverdue) healthStatus = "overdue";
                    else if (daysUntilDue !== null && daysUntilDue <= 7 && completionPercentage < 70)
                        healthStatus = "at-risk";

                    const tags = project.ProjectTags.map((pt) => pt.tag);

                    const { ProjectTags: _, ...projectData } = project;

                    return {
                        ...projectData,
                        tags,
                        stats: { ...stats, completionPercentage, healthStatus, daysUntilDue, isOverdue: isOverdue || false },
                    };
                });

                // 8️⃣ Return response
                return c.json(successResponse(projectsWithStats), 200, {
                    "Cache-Control": "private, max-age=180", // 3 minutes
                });
            } catch (error) {
                console.error("fetch all workspace projects error:", error);
                return c.json(errorResponse("Failed to fetch workspace projects"), 500);
            }
        }
    )
    .post("/",
        zValidator("json", createProjectSchema),
        sessionMiddleware,
        async (c) => {
            try {
                const user = c.get("user");
                const { name, image, workspaceId, description,
                    startDate,
                    endDate, status, tags } = c.req.valid("json")

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
                    select: {
                        id: true,
                        members: {
                            select: {
                                id: true,
                                userId: true
                            }
                        }
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }
                const member = workspace.members.find((member) => member.userId === user.id)

                if (!member) {
                    // return 404 error for security reasons
                    return c.json(errorResponse("workspace not found"), 404);
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
                const now = new Date()
                const thisMonthStart = startOfMonth(now)
                const thisMonthEnd = endOfMonth(now)

                const result = await db.$transaction(async (tx) => {
                    const tagRecords = await Promise.all(
                        tags.map(async (tag: string) => {
                            const normalized = tag.trim()
                            return tx.tags.upsert({
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
                    const project = await tx.project.create({
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
                    await tx.projectTags.createMany({
                        data: tagRecords.map((tag) => ({
                            projectId: project.id,
                            tagId: tag.id
                        })),
                        skipDuplicates: true
                    })

                    await logActivity
                        (tx,
                            {
                                workspaceId,
                                memberId: member.id,
                                actionType: "PROJECT_CREATED",
                                entityType: "PROJECT",
                                entityId: project.id,
                                entityTitle: project.name,
                                metadata: {},
                            })

                    return project
                })

                return c.json(successResponse(result), 201)
            } catch (error) {
                console.error("create project error:", error);
                return c.json(errorResponse("Failed to create project"), 500);
            }
        }
    )
    .get("/qucik-project",
        zValidator("query", z.object({
            workspaceId: z.string(),
        })),
        sessionMiddleware,
        async (c) => {

            const user = c.get("user");
            const { workspaceId } = c.req.valid("query")

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
            });

            if (!workspace) {
                return c.json(errorResponse("workspace not found"), 404);
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
    .get("/:projectId", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { projectId } = c.req.param()

            const project = await db.project.findUnique({
                where: {
                    id: projectId,
                }
            })
            if (!project) {
                return c.json(errorResponse("Project not found"), 404)
            }

            const workspace = await db.workspace.findUnique({
                where: {
                    id: project.workspaceId,
                    deletedAt: null,
                    members: {
                        some: {
                            userId: user.id
                        }
                    }
                },
            });

            if (!workspace) {
                return c.json(errorResponse("workspace not found"), 404)
            }

            // members assigned to task in this project 
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
                            imageUrl: true
                        }
                    }

                }
            })

            return c.json({ data: project, team })
        })
    .post("/validate", sessionMiddleware, async (c) => {

        const startTime = Date.now();

        try {
            const ip = c.req.header('x-forwarded-for') ||
                c.req.header('x-real-ip') ||
                'unknown';

            const rateLimit = checkRateLimit(ip, 10, 60000); // 10 requests per minute

            // Add rate limit headers
            const headers = {
                'X-RateLimit-Limit': rateLimit.limit.toString(),
                'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
            };
            if (!rateLimit.allowed) {
                return c.json(
                    {
                        error: {
                            type: 'RATE_LIMIT_USER_EXCEEDED',
                            message: `Too many requests. Please wait ${rateLimit.retryAfter} seconds.`,
                            retryable: false,
                            metadata: {
                                retryAfter: rateLimit.retryAfter
                            }
                        }
                    },
                    {
                        status: 429,
                        headers: {
                            ...headers,
                            'Retry-After': rateLimit.retryAfter?.toString() || '60'
                        }
                    }
                );
            }

            let body;
            try {
                body = await c.req.json();
            } catch (error) {
                return c.json(
                    {
                        error: {
                            type: 'VALIDATION_FAILED',
                            message: 'Invalid JSON in request body',
                            retryable: false
                        }
                    },
                    { status: 400, headers }
                );
            }

            // validate input

            let validatedInput;
            try {
                validatedInput = validatePromptInputSchema.parse(body);
            } catch (error) {
                if (error instanceof ZodError) {
                    const firstError = error.errors[0];

                    // Handle length errors specially
                    if (firstError.code === 'too_small') {
                        return c.json(
                            {
                                valid: false,
                                reason: 'Your prompt is too short. Please describe your project in more detail.',
                                type: 'PROMPT_TOO_SHORT',
                                rewrittenPrompt: null,
                                suggestions: [
                                    'Create a marketing campaign for Q4',
                                    'Build a portfolio website with a blog',
                                    'Plan a product launch event'
                                ],
                                metadata: {
                                    currentLength: (body.prompt as string)?.length || 0,
                                    maxLength: 2000
                                }
                            },
                            { status: 200, headers }
                        );
                    }

                    if (firstError.code === 'too_big') {
                        return c.json(
                            {
                                valid: false,
                                reason: `Your prompt is too long (${(body.prompt as string).length} characters). Please keep it under 2,000 characters.`,
                                type: 'PROMPT_TOO_LONG',
                                rewrittenPrompt: null,
                                suggestions: null,
                                metadata: {
                                    currentLength: (body.prompt as string).length,
                                    maxLength: 2000
                                }
                            },
                            { status: 200, headers }
                        );
                    }

                    return c.json(
                        {
                            error: {
                                type: 'VALIDATION_FAILED',
                                message: firstError.message,
                                retryable: false
                            }
                        },
                        { status: 400, headers }
                    );
                }

                throw error;
            }

            // sanitized input
            const sanitized = sanitizePrompt(validatedInput.prompt);

            // security check

            if (containsMaliciousContent(sanitized)) {
                return c.json(
                    {
                        valid: false,
                        reason: 'Your prompt contains invalid characters or patterns. Please remove any HTML, scripts, or special characters and try again.',
                        type: 'PROMPT_CONTAINS_MALICIOUS_CONTENT',
                        rewrittenPrompt: null,
                        suggestions: null
                    },
                    { status: 200, headers }
                );
            }
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            let aiResponse;
            try {
                // aiResponse = await validatePromptWithAI(sanitized, controller.signal);
                aiResponse = validationResponse.find((v) => v.User == sanitized)?.response

            } catch (error: any) {
                clearTimeout(timeout);
                if (error.name === 'AbortError') {
                    return c.json(
                        {
                            error: {
                                type: 'VALIDATION_AI_TIMEOUT',
                                message: 'Validation took too long. Please try again or simplify your prompt.',
                                retryable: true
                            }
                        },
                        { status: 408, headers }
                    );
                }
                // Handle Gemini API errors
                if (error.message?.includes('quota')) {
                    return c.json(
                        {
                            error: {
                                type: 'SERVER_ERROR',
                                message: 'AI service quota exceeded. Please try again later.',
                                retryable: false
                            }
                        },
                        { status: 503, headers }
                    );
                }

                // Generic AI error
                console.error('Gemini validation error:', error);
                return c.json(
                    {
                        error: {
                            type: 'AI_SERVICE_ERROR',
                            message: 'AI validation service temporarily unavailable. Please try again.',
                            retryable: true,
                            metadata: {
                                retryAfter: 30
                            }
                        }
                    },
                    { status: 503, headers }
                );
            } finally {
                clearTimeout(timeout);
            }
            const duration = Date.now() - startTime;
            console.log(`[Validation] ${aiResponse?.valid ? 'Valid' : 'Invalid'} - ${duration}ms - IP: ${ip}`);

            if (aiResponse?.valid) {
                return c.json(
                    {
                        valid: true,
                        rewrittenPrompt: aiResponse.rewrittenPrompt,
                        reason: null,
                        suggestions: null
                    },
                    { status: 200, headers }
                );
            } else {
                return c.json(
                    {
                        valid: false,
                        reason: aiResponse?.reason,
                        type: aiResponse?.type,
                        rewrittenPrompt: null,
                        suggestions: aiResponse?.suggestions,
                        // @ts-ignore
                        metadata: aiResponse?.detectedProjects ? {
                            // @ts-ignore
                            detectedProjects: aiResponse?.detectedProjects
                        } : undefined
                    },
                    { status: 200, headers }
                );
            }

            // await sleep(20_000)

        } catch (error) {
            console.error('Unexpected validation error:', error);
            return c.json(
                {
                    error: {
                        type: 'SERVER_ERROR',
                        message: 'An unexpected error occurred. Please try again.',
                        retryable: true,
                        metadata: {
                            errorId: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                        }
                    }
                },
                { status: 500 }
            );
        }

    }

    )
    .post("/generate/project", sessionMiddleware,
        async (c) => {
            const startTime = Date.now();
            try {
                const ip = c.req.header('x-forwarded-for') ||
                    c.req.header('x-real-ip') ||
                    'unknown';
                const rateLimit = checkRateLimit(ip, 10, 60000); // 10 requests per minute

                // Add rate limit headers
                const headers = {
                    'X-RateLimit-Limit': rateLimit.limit.toString(),
                    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                    'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
                };
                if (!rateLimit.allowed) {
                    return c.json(
                        {
                            error: {
                                type: 'RATE_LIMIT_USER_EXCEEDED',
                                message: `Too many requests. Please wait ${rateLimit.retryAfter} seconds.`,
                                retryable: false,
                                metadata: {
                                    retryAfter: rateLimit.retryAfter
                                }
                            }
                        },
                        {
                            status: 429,
                            headers: {
                                ...headers,
                                'Retry-After': rateLimit.retryAfter?.toString() || '60'
                            }
                        }
                    );
                }

                let body;
                try {
                    body = await c.req.json()
                } catch (error) {
                    return c.json(
                        {
                            error: {
                                type: 'VALIDATION_FAILED',
                                message: 'Invalid JSON in request body',
                                retryable: false
                            }
                        },
                        { status: 400, headers }
                    );
                }

                // Validate with Zod
                let validatedInput;
                try {
                    validatedInput = validatePromptInputSchema.parse(body);
                } catch (error) {
                    if (error instanceof ZodError) {
                        const firstError = error.errors[0];

                        // Handle length errors specially
                        if (firstError.code === 'too_small') {
                            return c.json(
                                {
                                    valid: false,
                                    reason: 'Your prompt is too short. Please describe your project in more detail.',
                                    type: 'PROMPT_TOO_SHORT',
                                    rewrittenPrompt: null,
                                    suggestions: [
                                        'Create a marketing campaign for Q4',
                                        'Build a portfolio website with a blog',
                                        'Plan a product launch event'
                                    ],
                                    metadata: {
                                        currentLength: (body.prompt as string)?.length || 0,
                                        maxLength: 2000
                                    }
                                },
                                { status: 200, headers }
                            );
                        }

                        if (firstError.code === 'too_big') {
                            return c.json(
                                {
                                    valid: false,
                                    reason: `Your prompt is too long (${(body.prompt as string).length} characters). Please keep it under 2,000 characters.`,
                                    type: 'PROMPT_TOO_LONG',
                                    rewrittenPrompt: null,
                                    suggestions: null,
                                    metadata: {
                                        currentLength: (body.prompt as string).length,
                                        maxLength: 2000
                                    }
                                },
                                { status: 200, headers }
                            );
                        }

                        return c.json(
                            {
                                error: {
                                    type: 'VALIDATION_FAILED',
                                    message: firstError.message,
                                    retryable: false
                                }
                            },
                            { status: 400, headers }
                        );
                    }

                    throw error;
                }
                const sanitized = sanitizePrompt(validatedInput.prompt);
                if (containsMaliciousContent(sanitized)) {
                    return c.json(
                        {
                            valid: false,
                            reason: 'Your prompt contains invalid characters or patterns. Please remove any HTML, scripts, or special characters and try again.',
                            type: 'PROMPT_CONTAINS_MALICIOUS_CONTENT',
                            rewrittenPrompt: null,
                            suggestions: null
                        },
                        { status: 200, headers }
                    );
                }

                // Create abort controller for timeout
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                let aiResponse;

                try {
                    // await sleep(45_000)
                    // aiResponse = await generateProjectWithAI(sanitized, controller.signal);
                    aiResponse = generateProjectResponseExample
                } catch (error: any) {
                    clearTimeout(timeout);


                    // Handle timeout
                    if (error.name === 'AbortError') {
                        return c.json(
                            {
                                error: {
                                    type: 'GENERATION_TIMEOUT',
                                    message: 'Generation took too long. Your project might be too complex. Try simplifying it.',
                                    retryable: true
                                }
                            },
                            { status: 408, headers }
                        );
                    }
                    // Handle Gemini API errors
                    if (error.message?.includes('quota')) {
                        return c.json(
                            {
                                error: {
                                    type: 'SERVER_ERROR',
                                    message: 'AI service quota exceeded. Please try again later.',
                                    retryable: false
                                }
                            },
                            { status: 503, headers }
                        );
                    }
                    if (error.message?.includes('rate limit') || error.status === 429) {
                        return c.json(
                            {
                                error: {
                                    type: 'AI_RATE_LIMIT_EXCEEDED',
                                    message: 'AI service is busy. Please wait 60 seconds and try again.',
                                    retryable: true,
                                    metadata: {
                                        retryAfter: 60
                                    }
                                }
                            },
                            { status: 429, headers }
                        );
                    }
                    // Generic AI error
                    console.error('Gemini generation error:', error);
                    return c.json(
                        {
                            error: {
                                type: 'AI_SERVICE_ERROR',
                                message: 'AI generation service temporarily unavailable. Please try again.',
                                retryable: true,
                                metadata: {
                                    retryAfter: 30
                                }
                            }
                        },
                        { status: 503, headers }
                    )

                } finally {
                    clearTimeout(timeout);
                }

                let validatedAIResponse;
                try {
                    validatedAIResponse = aiGenerationResponseSchema.parse(aiResponse);
                } catch (error) {
                    if (error instanceof ZodError) {
                        console.error('AI output validation failed:', error);

                        return c.json(
                            {
                                error: {
                                    type: 'AI_INVALID_OUTPUT',
                                    message: 'AI generated invalid data. Please try again.',
                                    retryable: true
                                }
                            },
                            { status: 422, headers }
                        );
                    }
                    throw error;
                }

                let tasksWithIds = resolveDependencies(validatedAIResponse.tasks);
                // Check for circular dependencies
                if (hasCircularDependencies(tasksWithIds)) {
                    console.warn('Circular dependencies detected, attempting auto-fix');

                    tasksWithIds = autoFixCircularDependencies(tasksWithIds);

                    // If still has cycles after auto-fix, return error
                    if (hasCircularDependencies(tasksWithIds)) {
                        return c.json(
                            {
                                error: {
                                    type: 'CIRCULAR_DEPENDENCY_DETECTED',
                                    message: 'Circular dependencies detected and could not be automatically fixed. Please try again.',
                                    retryable: true
                                }
                            },
                            { status: 422, headers }
                        );
                    }
                }

                //  calculate Dates
                const { startDate, endDate } = calculateProjectDates(
                    validatedAIResponse.project.estimatedDurationDays
                );
                // @ts-ignore
                const tasksWithDates = calculateTaskDates(tasksWithIds, startDate);

                const response = {
                    project: {
                        ...validatedAIResponse.project,
                        startDate,
                        endDate
                    },
                    tasks: tasksWithDates
                };

                const duration = Date.now() - startTime;
                console.log(`[Generation] Success - ${duration}ms - ${response.tasks.length} tasks - IP: ${ip}`);

                return c.json(response, { status: 200, headers });

            } catch (error) {
                console.error('Unexpected validation error:', error);
                return c.json(
                    {
                        error: {
                            type: 'SERVER_ERROR',
                            message: 'An unexpected error occurred. Please try again.',
                            retryable: true,
                            metadata: {
                                errorId: `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                            }
                        }
                    },
                    { status: 500 }
                );
            }
        }
    )
    .post("/generate/tasks", sessionMiddleware,
        zValidator("json", PromptSchema),
        async (c) => {
            try {
                const { prompt } = c.req.valid("json")
                const result = await ai.models.generateContent({
                    model: "gemini-2.0-flash",
                    contents: generateTaskPrompt(prompt),
                    config: {
                        safetySettings: safetySetting,
                        responseMimeType: "application/json",
                        // responseSchema: {
                        //     type: Type.OBJECT,
                        //     response: {
                        //         status: ["valid", "needs_rewrite", "invalid"],
                        //         reason: Type.STRING,
                        //         rewritten: Type.STRING,
                        //         suggestedRewrite: Type.STRING,
                        //         suggestion: Type.STRING
                        //     }

                        // }

                    }
                })

                const AIResponse = result.text
                console.log(AIResponse)

                const objResponse = JSON.parse(AIResponse!)
                console.log("rrrr", objResponse, typeof (objResponse))
                return c.json({ data: { success: true, tasks: objResponse }, feedback: "ok" })


            } catch (error) {
                console.error(error)
                return c.json({ data: { success: false, tasks: [], feedback: "Our AI service hit a snag. Try again in a moment." } }, 500);

            }
        }
    )
    .post("/generate/save",
        zValidator("json", saveAiGeneratedProjectSchema),
        sessionMiddleware,
        async (c) => {
            try {
                // await sleep(50_000);
                const user = c.get("user");
                const { workspaceId, data } = c.req.valid("json")

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
                    select: {
                        id: true,
                        members: {
                            select: {
                                id: true,
                                userId: true
                            }
                        }
                    }
                });

                if (!workspace) {
                    return c.json(errorResponse("workspace not found"), 404);
                }
                const member = workspace.members.find((member) => member.userId === user.id)

                if (!member) {
                    // return 404 error for security reasons
                    return c.json(errorResponse("workspace not found"), 404);
                }

                const { project, tasks } = data
                const now = new Date()
                const thisMonthStart = startOfMonth(now)
                const thisMonthEnd = endOfMonth(now)
                const priorty = {
                    'low': TaskPriority.LOW,
                    'medium': TaskPriority.MEDIUM,
                    'high': TaskPriority.HIGH,
                    'critical': TaskPriority.CRITICAL
                }
                const result = await db.$transaction(async (tx) => {
                    const newProject = await tx.project.create({
                        data: {
                            workspaceId,
                            name: project.name,
                            description: project.description,
                            status: "ACTIVE",
                            createdById: member.id,
                            imageUrl: "",
                            archived: false,
                            startDate: project.startDate ? new Date(project.startDate) : thisMonthStart,
                            endDate: project.endDate ? new Date(project.endDate) : thisMonthEnd,
                            // aiGenerated: true
                        }
                    })

                    const taskMap = new Map<string, string>(); // tempId -> real task id

                    let index = 0
                    for (const task of tasks) {
                        const t = await tx.task.create({
                            data: {
                                workspaceId,
                                projectId: newProject.id,
                                name: task.title,
                                description: task.description,
                                status: "TODO",
                                startDate: newProject.startDate,
                                dueDate: new Date(task.dueDate),
                                priority: priorty[task.priority],
                                position: Math.min((index + 1) * 1000, 1_000_000),
                            }
                        });

                        // map the temp id to real task
                        const tempId = task.id
                        taskMap.set(tempId, t.id)
                        index = index + 1

                    }

                    // 3. connect the dependencies
                    for (const task of tasks) {
                        const tempId = task.id
                        const currentTaskId = taskMap.get(tempId)

                        if (currentTaskId && task.dependsOn.length > 0) {
                            const dependencyIds = task.dependsOn.map((tempId) => taskMap.get(tempId)).filter((id) => id !== undefined)

                            if (dependencyIds.length > 0) {
                                await tx.taskDependency.createMany({
                                    data: dependencyIds.map((dependsOnId) => ({
                                        taskId: currentTaskId,
                                        dependsOnId,
                                    }))
                                })
                            }
                        }
                    }
                    await logActivity(
                        tx,
                        {
                            workspaceId,
                            memberId: member.id,
                            actionType: "PROJECT_CREATED",
                            entityType: "PROJECT",
                            entityId: newProject.id,
                            entityTitle: newProject.name,
                            metadata: {
                                "AI": true
                            },
                        })

                    return await tx.project.findUniqueOrThrow({
                        where: {
                            id: newProject.id
                        }
                    })


                })
                // const results = {
                //     id: 'ff891449-95f3-41d9-aa05-1f02edb607b0',
                //     name: 'Portfolio Website Development',
                //     description: 'Create a professional portfolio website showcasing case studies, blog, and contact form with modern design and responsive layout',
                //     imageUrl: '',
                //     status: 'ACTIVE',
                //     workspaceId: '465bf03d-8cc7-40ec-a793-0c4a5d50bca7',
                //     createdById: '2faa61c3-cb85-4834-a189-6b6da133ba30',
                //     archived: false,
                //     startDate: "2026-02 - 24T00:00:00.000Z",
                //     endDate: "2026-03 - 26T00:00:00.000Z",
                //     createdAt: "2026-02 - 23T11: 44: 59.777Z",
                //     updatedAt: "2026-02 - 23T11: 44: 59.777Z"
                // }
                console.log(result)
                return c.json(successResponse(result))

            } catch (error) {
                console.error(error)
                return c.json(errorResponse("Something went wrong"), 500);
            }
        }
    )
    .patch(
        "/:projectId",
        zValidator("json", createProjectSchema),
        sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { projectId } = c.req.param()
            const { name, image, endDate, startDate, status, description, workspaceId } = c.req.valid("json")

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

            const existingProject = await db.project.findUnique({
                where: {
                    id: projectId
                }
            })
            if (!existingProject) {
                return c.json({ error: "Project not found" }, 404)

            }

            const member = workspace.members.find((member) => member.userId == user.id)
            if (!member) {
                return c.json(errorResponse("Project not found"), 404)
            }

            if (member.role !== MemberRole.ADMIN) {
                return c.json(errorResponse("You do not have permission to carry out action."), 403)
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
            const result = await db.$transaction(async (tx) => {
                const project = await tx.project.update({
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
                await logActivity(tx, {
                    workspaceId, memberId: member.id,
                    actionType: "PROJECT_EDITED", entityType: "PROJECT",
                    entityId: project.id, entityTitle: project.name,
                    metadata: { "oldName": existingProject.name },
                })

                return project
            })

            return c.json({ data: result })

        }

    )
    .delete(
        "/:projectId", sessionMiddleware,
        async (c) => {
            const user = c.get("user");

            const { projectId } = c.req.param()

            const existingProject = await db.project.findUnique({
                where: {
                    id: projectId
                },
            })
            if (!existingProject) {
                return c.json(errorResponse("Project not found"), 404)
            }


            const member = await db.member.findFirst({
                where: {
                    workspaceId: existingProject.workspaceId,
                    userId: user.id
                }
            })
            if (!member) {
                return c.json(errorResponse("Project not found"), 404)
            }

            if (member.role !== MemberRole.ADMIN) {
                return c.json(errorResponse("You do not have permission to carry out action."), 403)
            }

            await db.$transaction(async (tx) => {
                const deletedAt = new Date()
                await tx.taskDependency.deleteMany({
                    where: {
                        task: {
                            projectId
                        }
                    }
                })
                await tx.task.deleteMany({
                    where: {
                        projectId
                    }
                })
                await tx.project.delete({
                    where: {
                        id: projectId
                    },
                })
                await logActivity(tx, {
                    workspaceId: existingProject.workspaceId, memberId: member.id,
                    actionType: "PROJECT_DELETED", entityType: "PROJECT",
                    entityId: null, entityTitle: existingProject.name,
                    metadata: { "projectName": existingProject.name },
                })
            })
            const data = { id: projectId }
            return c.json(successResponse(data, "Project deleted successfully"), 200)
        }

    )
    .get("/all/analytics",
        zValidator("query", z.object({ workspaceId: z.string() })), sessionMiddleware,
        async (c) => {
            const user = c.get("user");


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


export default app