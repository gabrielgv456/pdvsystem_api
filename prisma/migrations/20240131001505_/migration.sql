/*
  Warnings:

  - You are about to drop the column `descricao` on the `Cfop` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `icmsCst` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `icmsOrigem` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `itemType` table. All the data in the column will be lost.
  - Added the required column `description` to the `Cfop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `icmsCst` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `icmsOrigem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `itemType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Cfop" DROP COLUMN "descricao",
ADD COLUMN     "description" TEXT NOT NULL;

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
ALTER TABLE "User" ADD COLUMN     "crtId" INTEGER,
ADD COLUMN     "ie" TEXT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "icmsCst" DROP COLUMN "descricao",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "icmsOrigem" DROP COLUMN "descricao",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "itemType" DROP COLUMN "descricao",
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Crt" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "taxRegimeId" INTEGER,

    CONSTRAINT "Crt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRegime" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TaxRegime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_crtId_fkey" FOREIGN KEY ("crtId") REFERENCES "Crt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crt" ADD CONSTRAINT "Crt_taxRegimeId_fkey" FOREIGN KEY ("taxRegimeId") REFERENCES "TaxRegime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
