/*
  Warnings:

  - The values [PROJECT_UPDATED] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('TASK_CREATED', 'TASK_STATUS_UPDATED', 'TASK_EDITED', 'TASK_ASSIGNED', 'TASK_TITLE_UPDATED', 'PROJECT_CREATED', 'PROJECT_EDITED', 'PROJECT_COMPLETED', 'PROJECT_STATUS_UPDATED', 'SUBTASK_ADDED', 'SUBTASK_DELETED', 'COMMENT_ADDED', 'MEMBER_INVITED', 'MEMBER_JOINED', 'MEMBER_REMOVED', 'JOINED_WORKSPACE', 'LEFT_WORKSPACE');
ALTER TABLE "Activity" ALTER COLUMN "actionType" TYPE "ActivityType_new" USING ("actionType"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "ActivityType_old";
COMMIT;
