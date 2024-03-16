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
ALTER TABLE "TaxCfop" ALTER COLUMN "environment" SET DEFAULT 'estadual';

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TaxIcmsST" (
    "id" SERIAL NOT NULL,
    "taxIcmsId" INTEGER NOT NULL,
    "taxCstIcmsStId" INTEGER,
    "taxCfopStateIdSt" INTEGER,
    "taxCfopInterstateIdSt" INTEGER,
    "taxModalityBCIdSt" INTEGER,
    "taxMvaPauta" DOUBLE PRECISION,
    "taxRedBCICMSSt" DOUBLE PRECISION,
    "taxAliquotIcmsInner" DOUBLE PRECISION,
    "taxRedBCICMSInner" DOUBLE PRECISION,

    CONSTRAINT "TaxIcmsST_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaxIcmsST" ADD CONSTRAINT "TaxIcmsST_taxIcmsId_fkey" FOREIGN KEY ("taxIcmsId") REFERENCES "TaxIcms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsST" ADD CONSTRAINT "TaxIcmsST_taxCstIcmsStId_fkey" FOREIGN KEY ("taxCstIcmsStId") REFERENCES "TaxIcmsCst"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsST" ADD CONSTRAINT "TaxIcmsST_taxCfopStateIdSt_fkey" FOREIGN KEY ("taxCfopStateIdSt") REFERENCES "TaxCfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsST" ADD CONSTRAINT "TaxIcmsST_taxCfopInterstateIdSt_fkey" FOREIGN KEY ("taxCfopInterstateIdSt") REFERENCES "TaxCfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsST" ADD CONSTRAINT "TaxIcmsST_taxModalityBCIdSt_fkey" FOREIGN KEY ("taxModalityBCIdSt") REFERENCES "TaxModalityBCICMS"("id") ON DELETE SET NULL ON UPDATE CASCADE;
