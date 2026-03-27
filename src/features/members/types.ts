
export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIWER = "VIWER",
}

export const Role = {
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
    VIWER: "VIWER",
} as const;



export type Role = (typeof Role)[keyof typeof Role];

export type Member = {
    id: string;
    imageUrl: string | null;
    userId: string;
    workspaceId: string;
    joinedAt: Date;
    role: Role;
}