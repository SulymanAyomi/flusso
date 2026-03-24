// import { Query } from "node-appwrite";

import { getMember } from "../members/utils";
import { getCurrent } from "../auth/query";
import { db } from "@/lib/db";

export const getWorkspaces = async (userId: string) => {
    const workspaces = await db.workspace.findFirst({
        where: {
            members: {
                some: {
                    userId: userId
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return {
        workspaces,
        total: workspaces ? 1 : 0
    };
};
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

    const workspace = await db.workspace.findUnique({
        where: {
            id: workspaceId,
            deletedAt: null
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
        return null
    }
    const workspace = await db.workspace.findUnique({
        where: {
            id: workspaceId,
            deletedAt: null
        }
    })
    if (!workspace) {
        return null

    }

    return { name: workspace?.name as string }

}