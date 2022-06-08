/*
  Warnings:

  - A unique constraint covering the columns `[Token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "Token" DROP DEFAULT,
ALTER COLUMN "Token" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_Token_key" ON "User"("Token");
