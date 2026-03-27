import { useGetTasksResponseType } from "./api/use-get-tasks";

export enum TaskStatusEnum {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE",
}

export enum TaskPriorityEnum {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}

export const TaskStatus = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    IN_REVIEW: "IN_REVIEW",
    DONE: "DONE",
    BACKLOG: "BACKLOG"
} as const;

export const TaskPriority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];


export type Task = {
    id: string
    name: string
    status: TaskStatus
    priority: TaskPriority
    workspaceId: string
    assignedToId: string | null
    projectId: string
    position: number
    dueDate: string | null
    startDate: string | null;
    description: string | null;
    orderIndex: number
    createdAt: string
    updatedAt: string
}

export type SubTask = {
    id: string
    name: string
    isDone: boolean
    taskId: string
    createdAt: string
    updatedAt: string
}

export type EditTask = Task & {
    assignedTo: {
        id: string;
        user: {
            name: string | null;
            email: string | null;
        };
    } | null;
    project: {
        name: string;
        id: string;
        imageUrl: string | null;
    };
    dependencies: {
        dependsOnId: string;
        id: string;
        taskId: string;
    }[];
}

export type TasksType = useGetTasksResponseType["data"]["documents"][0];