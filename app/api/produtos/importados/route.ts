import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const importados = await prisma.produtoImportado.findMany({
    where: { userId: session.user.id },
    include: {
      produto: {
        include: { fornecedor: { select: { razaoSocial: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(importados);
}
