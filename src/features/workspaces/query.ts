import { Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { getCurrent } from "../auth/query";
import { db } from "@/lib/db";

export const getWorkspaces = async () => {

    const user = await getCurrent()
    if (!user) {
        throw new Error("Unauthourize")
    }


    const members = await db.member.findMany({
        where: {
            userId: user.id
        }
    })
    if (members.length === 0) {
        return { data: { documents: [], total: 0 } }
    }
    const workspaceIds = members.map((members) => members.workspaceId);




    const workspaces = await db.workspace.findMany({
        where: {
            id: {
                in: workspaceIds
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return { documents: workspaces ?? [], total: workspaces.length }


}

interface GetWorkspaceProps {
    workspaceId: string
}
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
    const user = await getCurrent()
    if (!user) {
        throw new Error("Unauthourize")

    }

    const member = await getMember({
        workspaceId,
        userId: user.id
    })

    if (!member) {
        throw new Error("Unauthourize")
    }

    const workspace = await db.workspace.findFirst({
        where: {
            id: workspaceId
        }
    })

    return workspace


}

interface GetWorkspaceInfoProps {
    workspaceId: string
}

export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
    const user = await getCurrent()
    if (!user) {
        throw new Error("Unauthourize")
    }
    const workspace = await db.workspace.findUnique({
        where: {
            id: workspaceId
        }
    })
    if (!workspace) {
        throw new Error("workspace not found")

    }

    return { name: workspace?.name as string }

}