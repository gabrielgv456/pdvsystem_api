/*
  Warnings:

  - You are about to drop the column `taxCrtAliquot` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `taxRegimeAliquot` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_TaxCstCofinsToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TaxCstPisToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TaxCstCofinsToUser" DROP CONSTRAINT "_TaxCstCofinsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaxCstCofinsToUser" DROP CONSTRAINT "_TaxCstCofinsToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_TaxCstPisToUser" DROP CONSTRAINT "_TaxCstPisToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TaxCstPisToUser" DROP CONSTRAINT "_TaxCstPisToUser_B_fkey";

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
ALTER TABLE "User" DROP COLUMN "taxCrtAliquot",
DROP COLUMN "taxRegimeAliquot",
ADD COLUMN     "taxCstAliquot" DOUBLE PRECISION,
ADD COLUMN     "taxCstCofinsAliquot" DOUBLE PRECISION,
ADD COLUMN     "taxCstCofinsId" INTEGER,
ADD COLUMN     "taxCstPisId" INTEGER,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_TaxCstCofinsToUser";

-- DropTable
DROP TABLE "_TaxCstPisToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_taxCstPisId_fkey" FOREIGN KEY ("taxCstPisId") REFERENCES "TaxCstPis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_taxCstCofinsId_fkey" FOREIGN KEY ("taxCstCofinsId") REFERENCES "TaxCstCofins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
