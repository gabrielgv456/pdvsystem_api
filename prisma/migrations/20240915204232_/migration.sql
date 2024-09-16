/*
  Warnings:

  - You are about to drop the column `taxIcmsId` on the `TaxIcmsNfce` table. All the data in the column will be lost.
  - You are about to drop the column `taxIcmsId` on the `TaxIcmsNfe` table. All the data in the column will be lost.
  - You are about to drop the column `taxIcmsId` on the `TaxIcmsNoPayer` table. All the data in the column will be lost.
  - You are about to drop the column `taxIcmsId` on the `TaxIcmsST` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaxIcmsNfce" DROP CONSTRAINT "TaxIcmsNfce_taxIcmsId_fkey";

-- DropForeignKey
ALTER TABLE "TaxIcmsNfe" DROP CONSTRAINT "TaxIcmsNfe_taxIcmsId_fkey";

-- DropForeignKey
ALTER TABLE "TaxIcmsNoPayer" DROP CONSTRAINT "TaxIcmsNoPayer_taxIcmsId_fkey";

-- DropForeignKey
ALTER TABLE "TaxIcmsST" DROP CONSTRAINT "TaxIcmsST_taxIcmsId_fkey";

-- DropIndex
DROP INDEX "TaxIcmsNfce_taxIcmsId_key";

-- DropIndex
DROP INDEX "TaxIcmsNfe_taxIcmsId_key";

-- DropIndex
DROP INDEX "TaxIcmsNoPayer_taxIcmsId_key";

-- DropIndex
DROP INDEX "TaxIcmsST_taxIcmsId_key";

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
ALTER TABLE "Products" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sellers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sells" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TaxIcms" ADD COLUMN     "taxIcmsNfceId" INTEGER,
ADD COLUMN     "taxIcmsNfeId" INTEGER,
ADD COLUMN     "taxIcmsNoPayerId" INTEGER,
ADD COLUMN     "taxIcmsStId" INTEGER;

-- AlterTable
ALTER TABLE "TaxIcmsNfce" DROP COLUMN "taxIcmsId";

-- AlterTable
ALTER TABLE "TaxIcmsNfe" DROP COLUMN "taxIcmsId";

-- AlterTable
ALTER TABLE "TaxIcmsNoPayer" DROP COLUMN "taxIcmsId";

-- AlterTable
ALTER TABLE "TaxIcmsST" DROP COLUMN "taxIcmsId";

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "TaxIcms" ADD CONSTRAINT "TaxIcms_taxIcmsNfeId_fkey" FOREIGN KEY ("taxIcmsNfeId") REFERENCES "TaxIcmsNfe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcms" ADD CONSTRAINT "TaxIcms_taxIcmsNoPayerId_fkey" FOREIGN KEY ("taxIcmsNoPayerId") REFERENCES "TaxIcmsNoPayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcms" ADD CONSTRAINT "TaxIcms_taxIcmsNfceId_fkey" FOREIGN KEY ("taxIcmsNfceId") REFERENCES "TaxIcmsNfce"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcms" ADD CONSTRAINT "TaxIcms_taxIcmsStId_fkey" FOREIGN KEY ("taxIcmsStId") REFERENCES "TaxIcmsST"("id") ON DELETE SET NULL ON UPDATE CASCADE;
