/*
  Warnings:

  - The `content` column on the `Pages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Pages" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA;
