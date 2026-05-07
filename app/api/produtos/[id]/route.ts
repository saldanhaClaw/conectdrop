import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "FORNECEDOR") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const fornecedor = await prisma.fornecedor.findUnique({ where: { userId: session.user.id } });
  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });

  const produto = await prisma.produto.findFirst({
    where: { id: params.id, fornecedorId: fornecedor.id },
  });
  if (!produto) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });

  const body = await req.json();
  const atualizado = await prisma.produto.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(atualizado);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || session.user.role !== "FORNECEDOR") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const fornecedor = await prisma.fornecedor.findUnique({ where: { userId: session.user.id } });
  if (!fornecedor) return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });

  await prisma.produto.deleteMany({
    where: { id: params.id, fornecedorId: fornecedor.id },
  });

  return NextResponse.json({ success: true });
}
