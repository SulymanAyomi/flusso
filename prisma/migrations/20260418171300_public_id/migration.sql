-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "memberId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "imageUrlPublicId" TEXT,
ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "imageUrlPublicId" TEXT,
ALTER COLUMN "imageUrl" DROP NOT NULL;
