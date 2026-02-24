-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "aiGenerated" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Activity_workspaceId_createdAt_idx" ON "Activity"("workspaceId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Activity_workspaceId_actionType_createdAt_idx" ON "Activity"("workspaceId", "actionType", "createdAt" DESC);
