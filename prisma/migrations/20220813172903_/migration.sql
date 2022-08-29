-- AlterTable
ALTER TABLE "ItensSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "PaymentSell" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Sells" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transactions" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransactionsProducts" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Sellers" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "cpf" TEXT,
    "email" TEXT,
    "birthDate" TIMESTAMP(3),
    "matricula" INTEGER,
    "phone" TEXT,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "Sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT,
    "birthDate" TIMESTAMP(3),
    "phoneNumber" TEXT,
    "cellNumber" TEXT,
    "adressStreet" TEXT,
    "adressNumber" INTEGER,
    "adressNeighborhood" TEXT,
    "adressComplement" TEXT,
    "adressCity" TEXT,
    "adressState" TEXT,
    "adressCep" INTEGER,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sellers" ADD CONSTRAINT "Sellers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
