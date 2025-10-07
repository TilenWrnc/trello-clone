/*
  Warnings:

  - Added the required column `dueDate` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "priority" "public"."Priority" NOT NULL DEFAULT 'LOW';
