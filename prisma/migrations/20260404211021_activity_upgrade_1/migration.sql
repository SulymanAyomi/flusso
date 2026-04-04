/*
  Warnings:

  - Made the column `userName` on table `Activity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userName` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "userName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "userName" SET NOT NULL;
