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
CREATE TABLE "FiscalSeries" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "FiscalSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalModels" (
    "id" SERIAL NOT NULL,
    "codSefaz" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "FiscalModels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalStatusNF" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "FiscalStatusNF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalNotes" (
    "id" SERIAL NOT NULL,
    "numberNF" INTEGER NOT NULL,
    "keyNF" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "enviroment" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "xml" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statudNFId" INTEGER NOT NULL,
    "serieNFId" INTEGER NOT NULL,
    "modelNFId" INTEGER NOT NULL,
    "sellId" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "FiscalNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FiscalNotes_keyNF_key" ON "FiscalNotes"("keyNF");

-- CreateIndex
CREATE UNIQUE INDEX "FiscalNotes_numberNF_storeId_key" ON "FiscalNotes"("numberNF", "storeId");

-- AddForeignKey
ALTER TABLE "FiscalNotes" ADD CONSTRAINT "FiscalNotes_statudNFId_fkey" FOREIGN KEY ("statudNFId") REFERENCES "FiscalStatusNF"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalNotes" ADD CONSTRAINT "FiscalNotes_serieNFId_fkey" FOREIGN KEY ("serieNFId") REFERENCES "FiscalSeries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalNotes" ADD CONSTRAINT "FiscalNotes_modelNFId_fkey" FOREIGN KEY ("modelNFId") REFERENCES "FiscalModels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalNotes" ADD CONSTRAINT "FiscalNotes_sellId_fkey" FOREIGN KEY ("sellId") REFERENCES "Sells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalNotes" ADD CONSTRAINT "FiscalNotes_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "States"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalNotes" ADD CONSTRAINT "FiscalNotes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
