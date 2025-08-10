import { db } from './db'

type LogActivityInput = {
    workspaceId: string
    memberId: string
    actionType: 'TASK_CREATED' | 'TASK_STATUS_UPDATED' | 'TASK_EDITED' | 'TASK_ASSIGNED' | 'PROJECT_CREATED' | 'PROJECT_COMPLETED' | 'PROJECT_EDITED' | 'PROJECT_STATUS_UPDATED' | 'COMMENT_ADDED' | 'SUBTASK_ADDED' | 'SUBTASK_DELETED' | 'JOINED_WORKSPACE' | 'LEFT_WORKSPACE'
    entityType: 'TASK' | 'PROJECT' | 'COMMENT' | 'MEMBER' | 'WORKSPACE'
    entityId: string
    entityTitle?: string
    metadata: Record<string, any>  // e.g., { from: "todo", to: "in_progress", taskTitle: "Design Homepage" }
}

export async function logActivity(input: LogActivityInput) {
    try {
        await db.activity.create({
            data: {
                workspaceId: input.workspaceId,
                memberId: input.memberId,
                actionType: input.actionType,
                entityType: input.entityType,
                entityId: input.entityId ?? null,
                metadata: input.metadata ?? {},
                entityTitle: input.entityTitle ?? null,
            },
        })
    } catch (err) {
        console.error('Failed to log activity:', err)
        // Optional: do not throw — logging failure shouldn’t crash the whole flow
    }
}
