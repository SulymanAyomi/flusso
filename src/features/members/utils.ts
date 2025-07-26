import { Query, type Databases } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { db } from "@/lib/db";

interface GetMemberProps {
    workspaceId: string
    userId: string
}

export const getMember = async ({
    workspaceId,
    userId
}: GetMemberProps) => {

    const members = await db.member.findMany({
        where: {
            workspaceId: workspaceId,
            userId: userId
        }
    })

    return members[0]
}