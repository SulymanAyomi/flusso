import { useGetMemberResponseType } from "./api/use-get-member";
import { useGetAllWorkspaceMemberResponseType } from "./api/use-get-members";
import { useGetMemberProjectsResponseType } from "./api/use-get-single-project-member";

export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    VIWER = "VIEWER",
}

export const Role = {
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
    VIWER: "VIEWER",
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

export type useGetMemberProjectsType = useGetMemberProjectsResponseType["data"]["member"]
export type useGetAllWorkspaceMemberType = useGetAllWorkspaceMemberResponseType["data"]
export type useGetMemberType = useGetMemberResponseType["data"]["data"]