
import { db } from "@/lib/db";

interface GetMemberProps {
    workspaceId: string
    userId: string
}

export const getMember = async ({
    workspaceId,
    userId
}: GetMemberProps) => {

    const member = await db.member.findUnique({
        where: {
            workspaceId_userId: {
                workspaceId: workspaceId,
                userId: userId
            }
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    })

    return member
}