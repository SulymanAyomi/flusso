/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `VerificationToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `VerificationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `otp` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT;

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "identifier",
DROP COLUMN "token",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "limit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp" TEXT NOT NULL,
ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Activity_workspaceId_idx" ON "Activity"("workspaceId");

-- CreateIndex
CREATE INDEX "Activity_memberId_idx" ON "Activity"("memberId");

-- CreateIndex
CREATE INDEX "Activity_entityId_idx" ON "Activity"("entityId");

-- CreateIndex
CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");

-- CreateIndex
CREATE INDEX "Subtask_taskId_idx" ON "Subtask"("taskId");

-- CreateIndex
CREATE INDEX "Task_workspaceId_status_idx" ON "Task"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "Task_workspaceId_projectId_idx" ON "Task"("workspaceId", "projectId");

-- CreateIndex
CREATE INDEX "Task_workspaceId_assignedToId_idx" ON "Task"("workspaceId", "assignedToId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_status_idx" ON "Task"("status");

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_email_key" ON "VerificationToken"("email");

-- CreateIndex
CREATE INDEX "VerificationToken_email_idx" ON "VerificationToken"("email");
