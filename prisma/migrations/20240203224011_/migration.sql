/*
  Warnings:

  - You are about to drop the column `crtId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_crtId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Deliveries" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItensSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PaymentSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sellers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sells" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "crtId",
ADD COLUMN     "taxCrtAliquot" DOUBLE PRECISION,
ADD COLUMN     "taxCrtId" INTEGER,
ADD COLUMN     "taxRegimeAliquot" DOUBLE PRECISION,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TaxCstPis" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxCstPis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCstCofins" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxCstCofins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaxCstPisToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TaxCstCofinsToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TaxCstPisToUser_AB_unique" ON "_TaxCstPisToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TaxCstPisToUser_B_index" ON "_TaxCstPisToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TaxCstCofinsToUser_AB_unique" ON "_TaxCstCofinsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TaxCstCofinsToUser_B_index" ON "_TaxCstCofinsToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_taxCrtId_fkey" FOREIGN KEY ("taxCrtId") REFERENCES "TaxCrt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaxCstPisToUser" ADD CONSTRAINT "_TaxCstPisToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "TaxCstPis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaxCstPisToUser" ADD CONSTRAINT "_TaxCstPisToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaxCstCofinsToUser" ADD CONSTRAINT "_TaxCstCofinsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "TaxCstCofins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaxCstCofinsToUser" ADD CONSTRAINT "_TaxCstCofinsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
