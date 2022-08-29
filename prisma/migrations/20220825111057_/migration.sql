/*
  Warnings:

  - You are about to drop the column `phone` on the `Sellers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItensSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PaymentSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sellers" DROP COLUMN "phone",
ADD COLUMN     "adressCep" TEXT,
ADD COLUMN     "adressCity" TEXT,
ADD COLUMN     "adressComplement" TEXT,
ADD COLUMN     "adressNeighborhood" TEXT,
ADD COLUMN     "adressNumber" TEXT,
ADD COLUMN     "adressState" TEXT,
ADD COLUMN     "adressStreet" TEXT,
ADD COLUMN     "cellNumber" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sells" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
