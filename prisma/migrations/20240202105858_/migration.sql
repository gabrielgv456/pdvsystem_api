/*
  Warnings:

  - You are about to drop the `Cfop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Crt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `icmsCst` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `icmsOrigem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Crt" DROP CONSTRAINT "Crt_taxRegimeId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_cfopId_fkey";

-- DropForeignKey
ALTER TABLE "Products" DROP CONSTRAINT "Products_itemTypeId_fkey";

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
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Cfop";

-- DropTable
DROP TABLE "Crt";

-- DropTable
DROP TABLE "icmsCst";

-- DropTable
DROP TABLE "icmsOrigem";

-- DropTable
DROP TABLE "itemType";

-- CreateTable
CREATE TABLE "TaxIcmsOrigem" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxIcmsOrigem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxIcmsCst" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxIcmsCst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxItemType" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxItemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCfop" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxCfop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCrt" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "taxRegimeId" INTEGER,

    CONSTRAINT "TaxCrt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_crtId_fkey" FOREIGN KEY ("crtId") REFERENCES "TaxCrt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "TaxItemType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_cfopId_fkey" FOREIGN KEY ("cfopId") REFERENCES "TaxCfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCrt" ADD CONSTRAINT "TaxCrt_taxRegimeId_fkey" FOREIGN KEY ("taxRegimeId") REFERENCES "TaxRegime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
