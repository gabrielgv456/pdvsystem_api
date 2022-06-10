/*
  Warnings:

  - Added the required column `sellValue` to the `Sells` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typePayment` to the `Sells` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valuePayment` to the `Sells` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sells" ADD COLUMN     "sellValue" INTEGER NOT NULL,
ADD COLUMN     "typePayment" TEXT NOT NULL,
ADD COLUMN     "valuePayment" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ItensSell" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "sellId" INTEGER NOT NULL,
    "idProduct" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "valueProduct" INTEGER NOT NULL,
    "totalValue" INTEGER NOT NULL,
    "descriptionProduct" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItensSell_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItensSell" ADD CONSTRAINT "ItensSell_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItensSell" ADD CONSTRAINT "ItensSell_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItensSell" ADD CONSTRAINT "ItensSell_sellId_fkey" FOREIGN KEY ("sellId") REFERENCES "Sells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
