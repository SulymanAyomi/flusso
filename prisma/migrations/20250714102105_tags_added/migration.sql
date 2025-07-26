/*
  Warnings:

  - You are about to drop the `_TagsToTask` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workspaceId` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "_TagsToTask" DROP CONSTRAINT "_TagsToTask_A_fkey";

-- DropForeignKey
ALTER TABLE "_TagsToTask" DROP CONSTRAINT "_TagsToTask_B_fkey";

-- AlterTable
ALTER TABLE "Tags" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_TagsToTask";

-- CreateTable
CREATE TABLE "TaskTags" (
    "taskId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "TaskTags_pkey" PRIMARY KEY ("taskId","tagId")
);

-- CreateTable
CREATE TABLE "ProjectTags" (
    "projectId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ProjectTags_pkey" PRIMARY KEY ("projectId","tagId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tags" ADD CONSTRAINT "Tags_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTags" ADD CONSTRAINT "TaskTags_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTags" ADD CONSTRAINT "TaskTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTags" ADD CONSTRAINT "ProjectTags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTags" ADD CONSTRAINT "ProjectTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
