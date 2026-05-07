import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nicho = searchParams.get("nicho");
  const busca = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {
    status: "ATIVO",
    estoque: { gt: 0 },
    fornecedor: { status: "APROVADO" },
  };

  if (nicho && nicho !== "todos") where.nicho = nicho;
  if (busca) where.nome = { contains: busca, mode: "insensitive" };

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      include: {
        fornecedor: { select: { razaoSocial: true, status: true, avaliacaoMedia: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.produto.count({ where }),
  ]);

  return NextResponse.json({ produtos, total, page, pages: Math.ceil(total / limit) });
}

const createSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().min(10),
  preco: z.number().positive(),
  precoSugerido: z.number().positive().optional(),
  estoque: z.number().int().min(0),
  sku: z.string().min(3),
  nicho: z.string(),
  imagens: z.array(z.string().url()).min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user.role !== "FORNECEDOR") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const fornecedor = await prisma.fornecedor.findUnique({
      where: { userId: session.user.id },
    });
    if (!fornecedor) {
      return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });
    }

    const produto = await prisma.produto.create({
      data: {
        ...data,
        fornecedorId: fornecedor.id,
        preco: data.preco,
        precoSugerido: data.precoSugerido,
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: (err as z.ZodError).issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
