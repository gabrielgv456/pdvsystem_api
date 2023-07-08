-- AlterTable
ALTER TABLE "Clients" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

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
CREATE TABLE "icmsOrigem" (
    "id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "icmsOrigem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "icmsCst" (
    "id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "icmsCst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itemType" (
    "id" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "itemType_pkey" PRIMARY KEY ("id")
);
