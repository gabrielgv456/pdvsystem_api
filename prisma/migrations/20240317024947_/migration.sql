-- DropForeignKey
ALTER TABLE "TaxIcms" DROP CONSTRAINT "TaxIcms_taxIcmsOriginId_fkey";

-- DropForeignKey
ALTER TABLE "TaxIcmsNfce" DROP CONSTRAINT "TaxIcmsNfce_taxCstIcmsId_fkey";

-- DropForeignKey
ALTER TABLE "TaxIcmsNfe" DROP CONSTRAINT "TaxIcmsNfe_taxCstIcmsId_fkey";

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
ALTER TABLE "TaxIcms" ALTER COLUMN "taxIcmsOriginId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TaxIcmsNfce" ALTER COLUMN "taxCstIcmsId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TaxIcmsNfe" ALTER COLUMN "taxCstIcmsId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "TaxIcms" ADD CONSTRAINT "TaxIcms_taxIcmsOriginId_fkey" FOREIGN KEY ("taxIcmsOriginId") REFERENCES "TaxIcmsOrigin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfe" ADD CONSTRAINT "TaxIcmsNfe_taxCstIcmsId_fkey" FOREIGN KEY ("taxCstIcmsId") REFERENCES "TaxIcmsCst"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfce" ADD CONSTRAINT "TaxIcmsNfce_taxCstIcmsId_fkey" FOREIGN KEY ("taxCstIcmsId") REFERENCES "TaxIcmsCst"("id") ON DELETE SET NULL ON UPDATE CASCADE;
