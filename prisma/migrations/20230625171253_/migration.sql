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
ALTER TABLE "User" ADD COLUMN     "adressCep" TEXT,
ADD COLUMN     "adressNeighborhood" TEXT,
ADD COLUMN     "adressNumber" TEXT,
ADD COLUMN     "adressState" TEXT,
ADD COLUMN     "adressStreet" TEXT,
ADD COLUMN     "andressCity" TEXT,
ADD COLUMN     "cellPhone" TEXT,
ADD COLUMN     "cnpj" TEXT,
ADD COLUMN     "fantasyName" TEXT,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;
