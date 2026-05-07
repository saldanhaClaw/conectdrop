-- CreateEnum
CREATE TYPE "StatusAnuncio" AS ENUM ('ATIVO', 'PAUSADO', 'RASCUNHO', 'ENCERRADO', 'COM_ERRO');

-- AlterEnum
ALTER TYPE "TipoPlano" ADD VALUE 'VITALICIO';

-- AlterTable
ALTER TABLE "ProdutoImportado" ADD COLUMN     "statusAnuncio" "StatusAnuncio" NOT NULL DEFAULT 'ATIVO',
ADD COLUMN     "vendidos" INTEGER NOT NULL DEFAULT 0;
