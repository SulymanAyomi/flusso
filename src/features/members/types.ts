
export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIWER = "VIWER",
}

export type Member = {
    id: string;
    imageUrl: string | null;
    userId: string;
    workspaceId: string;
    joinedAt: Date;
    role: MemberRole;
}