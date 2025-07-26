/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,name]` on the table `Tags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tags_workspaceId_name_key" ON "Tags"("workspaceId", "name");
