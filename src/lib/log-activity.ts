import { Prisma, PrismaClient } from '@prisma/client'

type LogActivityInput = {
    userName: string
    workspaceId: string
    memberId: string
    actionType: 'TASK_CREATED' | 'TASK_STATUS_UPDATED' | 'TASK_EDITED' | 'TASK_ASSIGNED' | 'TASK_DELETED' | 'PROJECT_CREATED' | 'PROJECT_COMPLETED' | 'PROJECT_EDITED' | 'PROJECT_STATUS_UPDATED' | 'PROJECT_DELETED' | 'COMMENT_ADDED' | 'SUBTASK_ADDED' | 'SUBTASK_DELETED' | 'JOINED_WORKSPACE' | 'LEFT_WORKSPACE' | 'WORKSPACE_DELETED' | 'WORKSPACE_UPDATED'
    entityType: 'TASK' | 'PROJECT' | 'COMMENT' | 'MEMBER' | 'WORKSPACE'
    entityId: string | null
    entityTitle?: string
    metadata: Record<string, any>  // e.g., { from: "todo", to: "in_progress", taskTitle: "Design Homepage" }
}
type AppContext = {
    db: PrismaClient
    userId?: string
}
type DBClient = PrismaClient | Prisma.TransactionClient
export async function logActivity(
    ctx: DBClient,
    input: LogActivityInput
) {
    await ctx.activity.create({
        data: {
            workspaceId: input.workspaceId,
            memberId: input.memberId,
            actionType: input.actionType,
            entityType: input.entityType,
            entityId: input.entityId ?? null,
            metadata: input.metadata ?? {},
            entityTitle: input.entityTitle ?? null,
            userName: input.userName
        },
    })

}
