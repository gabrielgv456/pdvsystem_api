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
ALTER TABLE "TaxCstCofins" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'entrance';

-- AlterTable
ALTER TABLE "TaxCstPis" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'entrance';

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TaxIpi" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "taxCstIpiExitId" INTEGER,
    "taxCstIpiEntranceId" INTEGER,
    "taxAliquotIpi" DOUBLE PRECISION,
    "taxClassificationClassIpi" TEXT,
    "taxStampIpi" TEXT,
    "taxQtdStampControlIpi" INTEGER,
    "taxCodEnquadLegalIpi" TEXT,
    "taxCnpjProd" TEXT,

    CONSTRAINT "TaxIpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCstIpi" (
    "id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "TaxCstIpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPis" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "taxCstPisExitId" INTEGER,
    "taxCstPisEntranceId" INTEGER,
    "taxAliquotPisExit" DOUBLE PRECISION,
    "taxAliquotPisEntrance" DOUBLE PRECISION,

    CONSTRAINT "TaxPis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCofins" (
    "id" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "taxCstCofinsExitId" INTEGER,
    "taxCstCofinsEntranceId" INTEGER,
    "taxAliquotCofinsExit" DOUBLE PRECISION,
    "taxAliquotCofinsEntrance" DOUBLE PRECISION,

    CONSTRAINT "TaxCofins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaxIpi" ADD CONSTRAINT "TaxIpi_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIpi" ADD CONSTRAINT "TaxIpi_taxCstIpiExitId_fkey" FOREIGN KEY ("taxCstIpiExitId") REFERENCES "TaxCstIpi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxIpi" ADD CONSTRAINT "TaxIpi_taxCstIpiEntranceId_fkey" FOREIGN KEY ("taxCstIpiEntranceId") REFERENCES "TaxCstIpi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPis" ADD CONSTRAINT "TaxPis_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPis" ADD CONSTRAINT "TaxPis_taxCstPisExitId_fkey" FOREIGN KEY ("taxCstPisExitId") REFERENCES "TaxCstPis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPis" ADD CONSTRAINT "TaxPis_taxCstPisEntranceId_fkey" FOREIGN KEY ("taxCstPisEntranceId") REFERENCES "TaxCstPis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCofins" ADD CONSTRAINT "TaxCofins_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCofins" ADD CONSTRAINT "TaxCofins_taxCstCofinsExitId_fkey" FOREIGN KEY ("taxCstCofinsExitId") REFERENCES "TaxCstCofins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCofins" ADD CONSTRAINT "TaxCofins_taxCstCofinsEntranceId_fkey" FOREIGN KEY ("taxCstCofinsEntranceId") REFERENCES "TaxCstCofins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
