/*
  Warnings:

  - Added the required column `clientName` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectCode` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamLeadId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientEmailId" TEXT,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "projectCode" TEXT NOT NULL,
ADD COLUMN     "teamLeadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
