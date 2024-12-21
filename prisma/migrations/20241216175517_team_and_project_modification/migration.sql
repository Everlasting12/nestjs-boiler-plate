/*
  Warnings:

  - You are about to drop the column `dueTime` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Team` table. All the data in the column will be lost.
  - Made the column `drawingTitle` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_projectId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "dueTime",
DROP COLUMN "title",
ALTER COLUMN "drawingTitle" SET NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "projectId";
