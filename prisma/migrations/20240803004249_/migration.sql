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
ALTER TABLE "PaymentTypes" ADD COLUMN     "codSefaz" TEXT,
ADD COLUMN     "paymentConditionId" INTEGER;

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
CREATE TABLE "PaymentCondition" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "codSefaz" TEXT NOT NULL,

    CONSTRAINT "PaymentCondition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentCondition_codSefaz_key" ON "PaymentCondition"("codSefaz");

-- AddForeignKey
ALTER TABLE "PaymentTypes" ADD CONSTRAINT "PaymentTypes_paymentConditionId_fkey" FOREIGN KEY ("paymentConditionId") REFERENCES "PaymentCondition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
