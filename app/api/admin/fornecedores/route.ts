import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const fornecedores = await prisma.fornecedor.findMany({
    include: {
      user: { select: { email: true, name: true } },
      qualificacao: true,
      _count: { select: { produtos: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(fornecedores);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { fornecedorId, status } = await req.json();

  const fornecedor = await prisma.fornecedor.update({
    where: { id: fornecedorId },
    data: { status },
  });

  return NextResponse.json(fornecedor);
}
