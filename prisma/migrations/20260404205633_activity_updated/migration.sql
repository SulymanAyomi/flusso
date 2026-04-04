-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_memberId_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "userName" TEXT;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
