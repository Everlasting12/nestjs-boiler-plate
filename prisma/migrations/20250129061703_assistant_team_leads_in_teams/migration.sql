-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "assistantTeamLeadIds" TEXT[],
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
