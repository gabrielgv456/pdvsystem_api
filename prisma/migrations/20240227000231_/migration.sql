/*
  Warnings:

  - You are about to drop the column `cfopId` on the `Products` table. All the data in the column will be lost.
  - You are about to drop the `TaxIcmsOrigem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_cfopId_fkey";

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
ALTER TABLE "Products" DROP COLUMN "cfopId",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sellers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sells" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TaxCfop" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'state';

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "TaxIcmsOrigem";

-- CreateTable
CREATE TABLE "TaxIcms" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "taxIcmsOriginId" INTEGER NOT NULL,
    "fcpAliquot" DOUBLE PRECISION,

    CONSTRAINT "TaxIcms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxIcmsOrigin" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxIcmsOrigin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxIcmsNfe" (
    "id" SERIAL NOT NULL,
    "taxIcmsId" INTEGER NOT NULL,
    "taxCstIcmsId" INTEGER NOT NULL,
    "taxModalityBCId" INTEGER,
    "taxReasonExemptionId" INTEGER,
    "taxCfopStateId" INTEGER,
    "taxCfopInterstateId" INTEGER,
    "taxRedBCICMS" DOUBLE PRECISION,
    "taxAliquotIcms" DOUBLE PRECISION,

    CONSTRAINT "TaxIcmsNfe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxReasonExemption" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxReasonExemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxModalityBCICMS" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxModalityBCICMS_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaxIcms" ADD CONSTRAINT "TaxIcms_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcms" ADD CONSTRAINT "TaxIcms_taxIcmsOriginId_fkey" FOREIGN KEY ("taxIcmsOriginId") REFERENCES "TaxIcmsOrigin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfe" ADD CONSTRAINT "TaxIcmsNfe_taxIcmsId_fkey" FOREIGN KEY ("taxIcmsId") REFERENCES "TaxIcms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfe" ADD CONSTRAINT "TaxIcmsNfe_taxCstIcmsId_fkey" FOREIGN KEY ("taxCstIcmsId") REFERENCES "TaxIcmsCst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfe" ADD CONSTRAINT "TaxIcmsNfe_taxModalityBCId_fkey" FOREIGN KEY ("taxModalityBCId") REFERENCES "TaxModalityBCICMS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfe" ADD CONSTRAINT "TaxIcmsNfe_taxReasonExemptionId_fkey" FOREIGN KEY ("taxReasonExemptionId") REFERENCES "TaxReasonExemption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfe" ADD CONSTRAINT "TaxIcmsNfe_taxCfopStateId_fkey" FOREIGN KEY ("taxCfopStateId") REFERENCES "TaxCfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfe" ADD CONSTRAINT "TaxIcmsNfe_taxCfopInterstateId_fkey" FOREIGN KEY ("taxCfopInterstateId") REFERENCES "TaxCfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
