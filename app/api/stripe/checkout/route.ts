import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const { planoId, incluiSuporte } = await req.json();

  try {
    const checkout = await createCheckoutSession({
      userId: session.user.id,
      planoId,
      incluiSuporte: incluiSuporte || false,
      email: session.user.email,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Erro ao criar sessão de pagamento" }, { status: 500 });
  }
}
