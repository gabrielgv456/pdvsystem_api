/*
  Warnings:

  - You are about to drop the `paymentSell` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paymentTypes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "paymentSell" DROP CONSTRAINT "paymentSell_sellId_fkey";

-- DropForeignKey
ALTER TABLE "paymentSell" DROP CONSTRAINT "paymentSell_storeId_fkey";

-- DropForeignKey
ALTER TABLE "paymentSell" DROP CONSTRAINT "paymentSell_typepayment_fkey";

-- DropTable
DROP TABLE "paymentSell";

-- DropTable
DROP TABLE "paymentTypes";

-- CreateTable
CREATE TABLE "PaymentTypes" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "PaymentTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSell" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "sellId" INTEGER NOT NULL,
    "typepayment" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "PaymentSell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTypes_type_key" ON "PaymentTypes"("type");

-- AddForeignKey
ALTER TABLE "PaymentSell" ADD CONSTRAINT "PaymentSell_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSell" ADD CONSTRAINT "PaymentSell_typepayment_fkey" FOREIGN KEY ("typepayment") REFERENCES "PaymentTypes"("type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSell" ADD CONSTRAINT "PaymentSell_sellId_fkey" FOREIGN KEY ("sellId") REFERENCES "Sells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
