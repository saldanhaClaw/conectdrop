import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { userId: session.user.id },
    include: {
      qualificacao: true,
      produtos: { where: { status: { not: "INATIVO" } }, take: 5, orderBy: { createdAt: "desc" } },
    },
  });

  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });
  return NextResponse.json(fornecedor);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "FORNECEDOR") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();
  const { razaoSocial, cnpj, nichos, tempoDeMercado } = body;

  const fornecedor = await prisma.fornecedor.update({
    where: { userId: session.user.id },
    data: { razaoSocial, cnpj, nichos, tempoDeMercado },
  });

  return NextResponse.json(fornecedor);
}
