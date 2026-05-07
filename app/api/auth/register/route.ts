import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["VENDEDOR", "FORNECEDOR"]),
  razaoSocial: z.string().optional(),
  cnpj: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existente = await prisma.user.findUnique({ where: { email: data.email } });
    if (existente) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
    }

    const senha = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: senha,
        role: data.role,
      },
    });

    if (data.role === "FORNECEDOR") {
      await prisma.fornecedor.create({
        data: {
          userId: user.id,
          razaoSocial: data.razaoSocial || data.name,
          cnpj: data.cnpj || null,
          nichos: [],
          tempoDeMercado: 0,
        },
      });
    }

    await sendWelcomeEmail(user.email, user.name, user.role).catch(() => {});

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: (err as z.ZodError).issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
