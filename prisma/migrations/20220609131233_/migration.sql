-- CreateTable
CREATE TABLE "paymentTypes" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "paymentTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paymentSell" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "sellId" INTEGER NOT NULL,
    "typepayment" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "paymentSell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "paymentTypes_type_key" ON "paymentTypes"("type");

-- AddForeignKey
ALTER TABLE "paymentSell" ADD CONSTRAINT "paymentSell_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentSell" ADD CONSTRAINT "paymentSell_typepayment_fkey" FOREIGN KEY ("typepayment") REFERENCES "paymentTypes"("type") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentSell" ADD CONSTRAINT "paymentSell_sellId_fkey" FOREIGN KEY ("sellId") REFERENCES "Sells"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
