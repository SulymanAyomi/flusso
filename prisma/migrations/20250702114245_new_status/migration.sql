/*
  Warnings:

  - You are about to drop the column `StartDate` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "StartDate",
ADD COLUMN     "startDate" TIMESTAMP(3);
