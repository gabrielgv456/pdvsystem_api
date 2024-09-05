-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Deliveries" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "FiscalNotes" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItensSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PaymentSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Plans" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

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
CREATE TABLE "FiscalEvents" (
    "id" SERIAL NOT NULL,
    "fiscalEventTypeId" INTEGER NOT NULL,
    "fiscalNoteId" INTEGER NOT NULL,
    "protocol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FiscalEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiscalEventsType" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "FiscalEventsType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FiscalEvents" ADD CONSTRAINT "FiscalEvents_fiscalEventTypeId_fkey" FOREIGN KEY ("fiscalEventTypeId") REFERENCES "FiscalEventsType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiscalEvents" ADD CONSTRAINT "FiscalEvents_fiscalNoteId_fkey" FOREIGN KEY ("fiscalNoteId") REFERENCES "FiscalNotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
