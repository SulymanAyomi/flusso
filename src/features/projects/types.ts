import { Project, ProjectStatus as PrismaProjectStatus } from "@/generated/prisma";
import { Models } from "node-appwrite";

export enum ProjectsStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    ON_HOLD = "ON_HOLD",
    ARCHIVED = "ARCHIVED",
}
export type ProjectType = {
    name: string;
    status: ProjectsStatus | PrismaProjectStatus;
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

export type Chat = Models.Document & {
    userPrompt: string
    AIResponse: string
    projectId: string
}