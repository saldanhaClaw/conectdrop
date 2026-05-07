import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "FORNECEDOR") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { userId: session.user.id },
    include: { qualificacao: true },
  });

  return NextResponse.json(fornecedor?.qualificacao || null);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "FORNECEDOR") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();
  const fornecedor = await prisma.fornecedor.findUnique({
    where: { userId: session.user.id },
  });

  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });

  const qualificacao = await prisma.qualificacaoFornecedor.upsert({
    where: { fornecedorId: fornecedor.id },
    update: body,
    create: { fornecedorId: fornecedor.id, ...body },
  });

  const critPrincipais = [
    qualificacao.minProdutos,
    qualificacao.tempoEntregaOk,
    qualificacao.avaliacaoOk,
    qualificacao.imagensOk,
    qualificacao.descricaoOk,
  ];

  if (critPrincipais.every(Boolean)) {
    await prisma.qualificacaoFornecedor.update({
      where: { fornecedorId: fornecedor.id },
      data: { aprovadoEm: new Date() },
    });
    await prisma.fornecedor.update({
      where: { id: fornecedor.id },
      data: { status: "PENDENTE" },
    });
  }

  return NextResponse.json(qualificacao);
}
