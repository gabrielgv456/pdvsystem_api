/*
  Warnings:

  - You are about to drop the column `adressCep` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `adressCity` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `adressComplement` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `adressNeighborhood` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `adressNumber` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `adressState` on the `Clients` table. All the data in the column will be lost.
  - You are about to drop the column `adressStreet` on the `Clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "adressCep",
DROP COLUMN "adressCity",
DROP COLUMN "adressComplement",
DROP COLUMN "adressNeighborhood",
DROP COLUMN "adressNumber",
DROP COLUMN "adressState",
DROP COLUMN "adressStreet",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Deliveries" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FiscalNotes" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

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
