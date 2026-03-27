
export enum ProjectsStatusEnum {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD",
    ARCHIVED = "ARCHIVED",
}
export const ProjectStatus = {
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    ON_HOLD: "ON_HOLD",
    ARCHIVED: "ARCHIVED",
} as const;

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export type ProjectType = {
    name: string;
    status: ProjectStatus;
    id: string;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    workspaceId: string;
    description: string | null;
    createdById: string;
    archived: boolean;
    startDate: string | null;
    endDate: string | null;
}

export type Chat = {
    prompt: string,
    type: "user" | "AI"
}[]

export type ErrorType =
    // Validation errors
    | 'PROMPT_TOO_SHORT'
    | 'PROMPT_TOO_LONG'
    | 'PROMPT_NOT_A_PROJECT'
    | 'PROMPT_TOO_VAGUE'
    | 'PROMPT_CONTAINS_MULTIPLE_PROJECTS'
    | 'PROMPT_CONTAINS_MALICIOUS_CONTENT'
    | 'VALIDATION_NETWORK_ERROR'
    | 'VALIDATION_AI_TIMEOUT'
    // Generation errors
    | 'GENERATION_TIMEOUT'
    | 'AI_SERVICE_ERROR'
    | 'AI_INVALID_OUTPUT'
    | 'AI_RATE_LIMIT_EXCEEDED'
    | 'GENERATION_NETWORK_ERROR'
    | 'CIRCULAR_DEPENDENCY_DETECTED'
    | 'GENERATION_PARTIAL_SUCCESS'
    | 'RATE_LIMIT_USER_EXCEEDED'
    | 'PROJECT_TOO_COMPLEX'
    // System errors
    | 'SERVER_ERROR'
    | 'BROWSER_OFFLINE';

export interface ErrorAction {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    onClick: () => void;
    countdown?: number; // Seconds until enabled
    disabled?: boolean;
}

export interface AIChatAction {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    onClick: () => void | ((validatedPrompt: string) => Promise<void>);
    countdown?: number; // Seconds until enabled
    disabled?: boolean;
}



export type ChatMessage =
    | UserMessage
    | AIMessage
    | ErrorMessage;


interface UserMessage {
    type: 'USER';
    prompt: string;
    timestamp?: Date;
}


interface AIMessage {
    type: 'AI';
    projectTask: ProjectData;
    handleStreamComplete: () => void
    actions?: ErrorAction[];
    timestamp?: Date;
}

export interface ErrorMessage {
    prompt: string;
    type: "ERROR";
    timestamp?: Date;
    retryable?: boolean;
    errorType?: ErrorType;
    actions?: ErrorAction[];
    onSuggestion?: (suggestion: string) => void
    metadata?: {
        suggestions?: string[];
        retryAfter?: number;
        countdown?: boolean;
        errorId?: string;
        partialData?: any;
        currentLength?: number;
        maxLength?: number;
    };
}

export interface AppError {
    type: ErrorType;
    message: string;
    retryable: boolean;
    metadata?: {
        suggestions?: string[];
        retryAfter?: number;
        countdown?: boolean;
        errorId?: string;
        partialData?: any;
        currentLength?: number;
        maxLength?: number;
    };
}
export class ProjectError extends Error {
    constructor(
        public type: ErrorType,
        message: string,
        public retryable: boolean = false,
        public metadata?: AppError['metadata']
    ) {
        super(message);
        this.name = 'ProjectError';
    }
    toAppError(): AppError {
        return {
            type: this.type,
            message: this.message,
            retryable: this.retryable,
            metadata: this.metadata
        };
    }
}

export interface ErrorResponse {
    error: {
        type: ErrorType;
        message: string,
        retryable: boolean;
        metadata?: AppError['metadata']
    }
}

export interface ValidatePromptRequest {
    json: {
        prompt: string
    }
}
export interface ValidatePromptResponse {
    valid: boolean;
    reason?: string;
    rewrittenPrompt?: string;
    suggestions?: string[];
    type?: ErrorType; // For validation failures
    metadata?: {
        currentLength?: number;
        maxLength?: number;
        detectedProjects?: string[];
    };
}

export const geminiGenerationSchema = {
    type: "object",
    properties: {
        project: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "Project name (1-100 characters)"
                },
                description: {
                    type: "string",
                    description: "Project description (max 500 characters)"
                },
                estimatedDurationDays: {
                    type: "number",
                    description: "Estimated project duration in days (1-365)"
                }
            },
            required: ["name", "description", "estimatedDurationDays"]
        },
        tasks: {
            type: "array",
            description: "Array of 3-15 tasks",
            items: {
                type: "object",
                properties: {
                    title: {
                        type: "string",
                        description: "Task title starting with action verb (max 200 chars)"
                    },
                    description: {
                        type: "string",
                        description: "Task description (max 1000 chars)"
                    },
                    priority: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "Task priority"
                    },
                    tags: {
                        type: "array",
                        items: { type: "string" },
                        description: "Relevant tags (max 5)"
                    },
                    dependsOn: {
                        type: "array",
                        items: { type: "string" },
                        description: "Task TITLES this task depends on (not IDs)"
                    },
                    estimatedDays: {
                        type: "number",
                        description: "Estimated duration in days (1-30)"
                    }
                },
                required: ["title", "description", "priority", "tags", "dependsOn", "estimatedDays"]
            }
        }
    },
    required: ["project", "tasks"]
};

export const geminiValidationSchema = {
    type: "object",
    properties: {
        valid: { type: "boolean" },
        reason: {
            type: "string",
            nullable: true,
            description: "Reason why the prompt is invalid. null if valid."
        },
        rewrittenPrompt: {
            type: "string",
            nullable: true,
            description: "Improved, clearer version of the prompt. null if invalid."
        },
        type: {
            type: "string",
            enum: [
                "PROMPT_NOT_A_PROJECT",
                "PROMPT_TOO_VAGUE",
                "PROMPT_CONTAINS_MULTIPLE_PROJECTS"
            ],
            nullable: true,
            description: "Error type if invalid. null if valid."
        },
        suggestions: {
            type: "array",
            items: { type: "string" },
            nullable: true,
            description: "Suggested alternative prompts. null if valid or not applicable."
        },
        detectedProjects: {
            type: "array",
            items: { type: "string" },
            nullable: true,
            description: "List of detected projects if multiple found. null otherwise."
        }
    },
    required: ["valid", "reason", "rewrittenPrompt", "type"]
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    tags: string[];
    dependsOn: string[];
    estimatedDays: number;
    dueDate: string;
}

export interface ProjectData {
    project: {
        name: string;
        description: string;
        estimatedDurationDays: number;
        startDate: string;
        endDate: string;
    };
    tasks: Task[];
}