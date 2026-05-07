import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from "@/lib/email";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as {
        metadata?: { userId?: string; planoId?: string };
        customer?: string;
        subscription?: string;
        amount_total?: number;
      };
      const { userId, planoId } = session.metadata || {};
      if (!userId || !planoId) break;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) break;

      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeId: stripeCustomerId },
      });

      let plano = await prisma.plano.findFirst({ where: { stripePriceId: planoId } });
      if (!plano) {
        plano = await prisma.plano.create({
          data: {
            nome: "Mensal",
            tipo: "MENSAL",
            preco: 169.9,
            stripePriceId: planoId,
          },
        });
      }

      await prisma.assinatura.upsert({
        where: { userId },
        update: { status: "ATIVA", stripeSubscriptionId, planoId: plano.id },
        create: { userId, planoId: plano.id, stripeSubscriptionId, status: "ATIVA" },
      });

      const valor = `R$ ${((session.amount_total || 0) / 100).toFixed(2).replace(".", ",")}`;
      await sendPaymentSuccessEmail(user.email, user.name, plano.nome, valor).catch(() => {});
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as { customer?: string };
      const user = await prisma.user.findFirst({ where: { stripeId: invoice.customer as string } });
      if (!user) break;

      await prisma.assinatura.updateMany({
        where: { userId: user.id },
        data: { status: "INADIMPLENTE" },
      });

      await sendPaymentFailedEmail(user.email, user.name).catch(() => {});
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as { id: string };
      await prisma.assinatura.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: "CANCELADA", canceladaEm: new Date() },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
