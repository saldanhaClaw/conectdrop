import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || (!key.startsWith("sk_") && !key.startsWith("rk_"))) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(key, {
    apiVersion: "2026-04-22.dahlia" as never,
    typescript: true,
  });
}

let _stripe: Stripe | null = null;
export function stripe(): Stripe {
  if (!_stripe) {
    try {
      _stripe = getStripe();
    } catch {
      throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
    }
  }
  return _stripe;
}

export const PLANOS = {
  MENSAL: {
    nome: "Mensal",
    preco: 169.9,
    precoFormatado: "R$ 169,90/mês",
    stripeId: process.env.STRIPE_PRICE_MENSAL!,
    descricao: "Acesso completo à plataforma",
    features: [
      "Catálogo completo de fornecedores",
      "Importação para Mercado Livre",
      "Sincronização automática de estoque",
      "Dashboard de vendedor",
      "Suporte via e-mail",
    ],
  },
  ANUAL: {
    nome: "Anual",
    preco: 97,
    precoFormatado: "R$ 97/mês",
    stripeId: process.env.STRIPE_PRICE_ANUAL!,
    descricao: "Economia de R$874/ano",
    features: [
      "Tudo do plano Mensal",
      "43% de desconto",
      "Prioridade em novos fornecedores",
      "Relatórios avançados",
      "Badge de assinante anual",
    ],
    destaque: true,
  },
  SUPORTE: {
    nome: "Suporte Premium",
    preco: 27,
    precoFormatado: "R$ 27/mês",
    stripeId: process.env.STRIPE_PRICE_SUPORTE!,
    descricao: "Upsell — atendimento humanizado",
    features: [
      "Suporte direto no app",
      "Tempo de resposta < 2h",
      "Onboarding personalizado",
    ],
  },
};

export async function createCheckoutSession({
  userId,
  planoId,
  incluiSuporte,
  email,
}: {
  userId: string;
  planoId: string;
  incluiSuporte: boolean;
  email: string;
}) {
  const lineItems: { price: string; quantity: number }[] = [
    { price: planoId, quantity: 1 },
  ];

  if (incluiSuporte) {
    lineItems.push({ price: process.env.STRIPE_PRICE_SUPORTE!, quantity: 1 });
  }

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: lineItems,
    metadata: { userId, planoId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/planos`,
    subscription_data: {
      transfer_data: {
        destination: process.env.STRIPE_VINICIUS_ACCOUNT_ID!,
        amount_percent: 50,
      },
    },
  });

  return session;
}

export async function createPortalSession(stripeCustomerId: string) {
  const session = await stripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/vendedor`,
  });
  return session;
}
