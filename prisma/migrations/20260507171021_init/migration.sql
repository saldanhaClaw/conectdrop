-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VENDEDOR', 'FORNECEDOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusFornecedor" AS ENUM ('PENDENTE', 'APROVADO', 'REPROVADO', 'SUSPENSO');

-- CreateEnum
CREATE TYPE "StatusProduto" AS ENUM ('ATIVO', 'INATIVO', 'ESGOTADO');

-- CreateEnum
CREATE TYPE "StatusAssinatura" AS ENUM ('ATIVA', 'CANCELADA', 'INADIMPLENTE');

-- CreateEnum
CREATE TYPE "TipoPlano" AS ENUM ('MENSAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "Canal" AS ENUM ('MERCADO_LIVRE', 'SHOPEE', 'MAGALU');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'VENDEDOR',
    "stripeId" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "razaoSocial" TEXT NOT NULL,
    "cnpj" TEXT,
    "status" "StatusFornecedor" NOT NULL DEFAULT 'PENDENTE',
    "nichos" TEXT[],
    "tempoDeMercado" INTEGER NOT NULL DEFAULT 0,
    "avaliacaoMedia" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QualificacaoFornecedor" (
    "id" TEXT NOT NULL,
    "fornecedorId" TEXT NOT NULL,
    "minProdutos" BOOLEAN NOT NULL DEFAULT false,
    "tempoEntregaOk" BOOLEAN NOT NULL DEFAULT false,
    "avaliacaoOk" BOOLEAN NOT NULL DEFAULT false,
    "imagensOk" BOOLEAN NOT NULL DEFAULT false,
    "descricaoOk" BOOLEAN NOT NULL DEFAULT false,
    "feedEstoqueOk" BOOLEAN NOT NULL DEFAULT false,
    "aprovadoEm" TIMESTAMP(3),
    "observacoes" TEXT,

    CONSTRAINT "QualificacaoFornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "fornecedorId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "precoSugerido" DECIMAL(10,2),
    "estoque" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT NOT NULL,
    "nicho" TEXT NOT NULL,
    "imagens" TEXT[],
    "status" "StatusProduto" NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoImportado" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "canal" "Canal" NOT NULL,
    "externalId" TEXT,
    "precoVenda" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoSync" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProdutoImportado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Canal_Config" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "canal" "Canal" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Canal_Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoPlano" NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "stripePriceId" TEXT NOT NULL,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assinatura" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "status" "StatusAssinatura" NOT NULL DEFAULT 'ATIVA',
    "suportePremium" BOOLEAN NOT NULL DEFAULT false,
    "inicioEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renovaEm" TIMESTAMP(3),
    "canceladaEm" TIMESTAMP(3),

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Afiliado" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "indicadoPorId" TEXT,
    "linkCode" TEXT NOT NULL,
    "comissaoTotal" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Afiliado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "produtoImportadoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNovo" TEXT,
    "sucesso" BOOLEAN NOT NULL,
    "erro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeId_key" ON "User"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_userId_key" ON "Fornecedor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "QualificacaoFornecedor_fornecedorId_key" ON "QualificacaoFornecedor"("fornecedorId");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_sku_key" ON "Produto"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Canal_Config_userId_canal_key" ON "Canal_Config"("userId", "canal");

-- CreateIndex
CREATE UNIQUE INDEX "Plano_stripePriceId_key" ON "Plano"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "Assinatura_userId_key" ON "Assinatura"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Assinatura_stripeSubscriptionId_key" ON "Assinatura"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_userId_key" ON "Afiliado"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Afiliado_linkCode_key" ON "Afiliado"("linkCode");

-- AddForeignKey
ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QualificacaoFornecedor" ADD CONSTRAINT "QualificacaoFornecedor_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "Fornecedor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoImportado" ADD CONSTRAINT "ProdutoImportado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoImportado" ADD CONSTRAINT "ProdutoImportado_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canal_Config" ADD CONSTRAINT "Canal_Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Afiliado" ADD CONSTRAINT "Afiliado_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Afiliado" ADD CONSTRAINT "Afiliado_indicadoPorId_fkey" FOREIGN KEY ("indicadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncLog" ADD CONSTRAINT "SyncLog_produtoImportadoId_fkey" FOREIGN KEY ("produtoImportadoId") REFERENCES "ProdutoImportado"("id") ON DELETE CASCADE ON UPDATE CASCADE;
