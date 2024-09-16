/*
  Warnings:

  - You are about to drop the column `productId` on the `TaxCofins` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `TaxIcms` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `TaxIpi` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `TaxPis` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaxCofins" DROP CONSTRAINT "TaxCofins_productId_fkey";

-- DropForeignKey
ALTER TABLE "TaxIcms" DROP CONSTRAINT "TaxIcms_productId_fkey";

-- DropForeignKey
ALTER TABLE "TaxIpi" DROP CONSTRAINT "TaxIpi_productId_fkey";

-- DropForeignKey
ALTER TABLE "TaxPis" DROP CONSTRAINT "TaxPis_productId_fkey";

-- DropIndex
DROP INDEX "TaxCofins_productId_key";

-- DropIndex
DROP INDEX "TaxIcms_productId_key";

-- DropIndex
DROP INDEX "TaxIpi_productId_key";

-- DropIndex
DROP INDEX "TaxPis_productId_key";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Deliveries" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FiscalEvents" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FiscalNotes" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItensSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PaymentSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Plans" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "taxGroupId" INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sellers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sells" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TaxCofins" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "TaxIcms" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "TaxIpi" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "TaxPis" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TaxGroup" (
    "id" SERIAL NOT NULL,
    "individual" BOOLEAN NOT NULL,
    "taxIcmsId" INTEGER,
    "taxCofinsId" INTEGER,
    "taxIpiId" INTEGER,
    "taxPisId" INTEGER,

    CONSTRAINT "TaxGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_taxGroupId_fkey" FOREIGN KEY ("taxGroupId") REFERENCES "TaxGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxGroup" ADD CONSTRAINT "TaxGroup_taxIcmsId_fkey" FOREIGN KEY ("taxIcmsId") REFERENCES "TaxIcms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxGroup" ADD CONSTRAINT "TaxGroup_taxCofinsId_fkey" FOREIGN KEY ("taxCofinsId") REFERENCES "TaxCofins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxGroup" ADD CONSTRAINT "TaxGroup_taxIpiId_fkey" FOREIGN KEY ("taxIpiId") REFERENCES "TaxIpi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxGroup" ADD CONSTRAINT "TaxGroup_taxPisId_fkey" FOREIGN KEY ("taxPisId") REFERENCES "TaxPis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
