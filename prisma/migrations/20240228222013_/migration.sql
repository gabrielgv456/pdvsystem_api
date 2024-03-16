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

-- CreateTable
CREATE TABLE "TaxIcmsNfce" (
    "id" SERIAL NOT NULL,
    "taxIcmsId" INTEGER NOT NULL,
    "taxCstIcmsId" INTEGER NOT NULL,
    "taxCfopId" INTEGER,
    "taxCfopDevolutionId" INTEGER,
    "taxRedBCICMS" DOUBLE PRECISION,
    "taxAliquotIcms" DOUBLE PRECISION,

    CONSTRAINT "TaxIcmsNfce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxIcmsNoPayer" (
    "id" SERIAL NOT NULL,
    "taxIcmsId" INTEGER NOT NULL,
    "taxCstIcmsId" INTEGER,
    "taxRedBCICMS" DOUBLE PRECISION,
    "taxAliquotIcms" DOUBLE PRECISION,

    CONSTRAINT "TaxIcmsNoPayer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaxIcmsNfce" ADD CONSTRAINT "TaxIcmsNfce_taxIcmsId_fkey" FOREIGN KEY ("taxIcmsId") REFERENCES "TaxIcms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfce" ADD CONSTRAINT "TaxIcmsNfce_taxCstIcmsId_fkey" FOREIGN KEY ("taxCstIcmsId") REFERENCES "TaxIcmsCst"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfce" ADD CONSTRAINT "TaxIcmsNfce_taxCfopId_fkey" FOREIGN KEY ("taxCfopId") REFERENCES "TaxCfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNfce" ADD CONSTRAINT "TaxIcmsNfce_taxCfopDevolutionId_fkey" FOREIGN KEY ("taxCfopDevolutionId") REFERENCES "TaxCfop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNoPayer" ADD CONSTRAINT "TaxIcmsNoPayer_taxIcmsId_fkey" FOREIGN KEY ("taxIcmsId") REFERENCES "TaxIcms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIcmsNoPayer" ADD CONSTRAINT "TaxIcmsNoPayer_taxCstIcmsId_fkey" FOREIGN KEY ("taxCstIcmsId") REFERENCES "TaxIcmsCst"("id") ON DELETE SET NULL ON UPDATE CASCADE;
