import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPortalSession } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.stripeId) {
    return NextResponse.json({ error: "Sem assinatura ativa" }, { status: 400 });
  }

  const portal = await createPortalSession(user.stripeId);
  return NextResponse.json({ url: portal.url });
}
