
export enum MemberRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIEWER = "VIEWER",
}

export type Member = {
    id: string;
    imageUrl: string | null;
    userId: string;
    workspaceId: string;
    joinedAt: Date;
    role: MemberRole;
}