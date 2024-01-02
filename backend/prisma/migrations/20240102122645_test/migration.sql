/*
  Warnings:

  - Made the column `content` on table `Pages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Pages" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '[]';
