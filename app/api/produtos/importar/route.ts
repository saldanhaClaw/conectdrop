import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { publishToMercadoLivre } from "@/lib/mercadolivre";
import { decrypt } from "@/lib/utils";
import type { Canal } from "@prisma/client";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "VENDEDOR") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { produtoId, canal, precoVenda } = await req.json();

  const produto = await prisma.produto.findUnique({
    where: { id: produtoId },
    include: { fornecedor: true },
  });
  if (!produto) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

  const canalConfig = await prisma.canal_Config.findUnique({
    where: { userId_canal: { userId: session.user.id, canal: canal as Canal } },
  });
  if (!canalConfig) {
    return NextResponse.json({ error: "Canal não conectado. Conecte primeiro." }, { status: 400 });
  }

  let externalId: string | undefined;

  if (canal === "MERCADO_LIVRE") {
    const accessToken = decrypt(canalConfig.accessToken);
    const result = await publishToMercadoLivre(accessToken, {
      nome: produto.nome,
      descricao: produto.descricao,
      preco: precoVenda || Number(produto.preco),
      estoque: produto.estoque,
      imagens: produto.imagens,
      nicho: produto.nicho,
    });
    externalId = result.id;
  }

  const importado = await prisma.produtoImportado.create({
    data: {
      userId: session.user.id,
      produtoId,
      canal: canal as Canal,
      externalId,
      precoVenda: precoVenda || produto.preco,
    },
  });

  return NextResponse.json(importado, { status: 201 });
}
