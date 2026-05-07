"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, CheckCircle2, ArrowLeft, Sparkles, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const planos = [
  {
    id: "mensal",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MENSAL,
    icone: Zap,
    nome: "Mensal",
    preco: "R$ 149,90",
    periodo: "/mês",
    descricao: "Ideal para começar seu dropshipping",
    features: [
      "Catálogo completo de fornecedores",
      "Importação com 1 clique",
      "Sincronização automática de estoque",
      "Mercado Livre + TikTok Shop",
      "Anúncios ilimitados",
      "Suporte por e-mail",
    ],
    destaque: false,
    cor: "border-white/[0.08]",
    badge: null,
  },
  {
    id: "vitalicio",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANUAL,
    icone: Crown,
    nome: "Vitalício",
    preco: "R$ 249,90",
    periodo: " único",
    descricao: "Pague uma vez, use para sempre",
    features: [
      "Tudo do plano Mensal",
      "Sem mensalidade para sempre",
      "Análise de tendências por IA",
      "Precificação inteligente",
      "Prioridade em novos fornecedores",
      "Relatórios avançados",
      "Badge exclusivo Vitalício",
      "Suporte prioritário",
    ],
    destaque: true,
    cor: "border-primary/40",
    badge: "Melhor escolha",
  },
];

export default function PlanosPage() {
  const [incluiSuporte, setIncluiSuporte] = useState(false);
  const [carregando, setCarregando] = useState<string | null>(null);
  const router = useRouter();

  async function handleAssinar(priceId: string, planoId: string) {
    setCarregando(planoId);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planoId: priceId, incluiSuporte }),
    });

    if (res.status === 401) {
      router.push("/login?callbackUrl=/planos");
      return;
    }

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setCarregando(null);
  }

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.01_260)]">
      <header className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">
              <span className="text-primary">DROP</span>
              <span className="text-white">CONNECT</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-white/40 hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black text-white">Escolha seu plano</h1>
          <p className="text-white/50">Acesso imediato após o pagamento. Sem período de teste.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {planos.map((plano) => {
            const Icon = plano.icone;
            return (
              <div
                key={plano.id}
                className={cn(
                  "relative rounded-2xl border bg-[oklch(0.14_0.01_260)] p-7 flex flex-col gap-6 transition-all",
                  plano.cor,
                  plano.destaque && "shadow-[0_0_40px_oklch(0.62_0.26_250/0.15)]"
                )}
              >
                {plano.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-primary/30">
                      {plano.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn("p-2 rounded-lg", plano.destaque ? "bg-primary/20" : "bg-white/[0.06]")}>
                      <Icon className={cn("h-5 w-5", plano.destaque ? "text-primary" : "text-white/60")} />
                    </div>
                    <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                      {plano.nome}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{plano.preco}</span>
                    <span className="text-sm text-white/40">{plano.periodo}</span>
                  </div>
                  <p className="text-sm text-white/40 mt-2">{plano.descricao}</p>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plano.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                      <CheckCircle2 className={cn("h-4 w-4 shrink-0 mt-0.5", plano.destaque ? "text-primary" : "text-emerald-400")} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full font-semibold py-2.5",
                    plano.destaque
                      ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                      : "bg-white/[0.07] hover:bg-white/[0.12] text-white border border-white/[0.08]"
                  )}
                  disabled={carregando === plano.id}
                  onClick={() => handleAssinar(plano.priceId || "", plano.id)}
                >
                  {carregando === plano.id ? "Redirecionando..." : `Assinar ${plano.nome}`}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Upsell suporte */}
        <div
          className={cn(
            "rounded-2xl border p-5 transition-all cursor-pointer",
            incluiSuporte
              ? "border-emerald-400/30 bg-emerald-400/5"
              : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
          )}
          onClick={() => setIncluiSuporte(!incluiSuporte)}
        >
          <div className="flex items-start gap-4">
            <div className={cn("p-2.5 rounded-xl shrink-0", incluiSuporte ? "bg-emerald-400/10" : "bg-white/[0.05]")}>
              <Shield className={cn("h-5 w-5", incluiSuporte ? "text-emerald-400" : "text-white/40")} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">
                  + Suporte Premium
                  <span className="text-white/50 font-normal"> — R$ 27/mês</span>
                </span>
                <div
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all shrink-0",
                    incluiSuporte ? "bg-emerald-400" : "bg-white/10"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all",
                      incluiSuporte ? "left-5" : "left-0.5"
                    )}
                  />
                </div>
              </div>
              <p className="text-sm text-white/40 mt-1">
                Atendimento humanizado no app, resposta em menos de 2h e onboarding personalizado.
              </p>
            </div>
          </div>
        </div>

        {/* IA teaser */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">IA incluída no plano Vitalício</p>
            <p className="text-xs text-white/40 mt-1">
              Detecção de tendências, precificação automática e publicação com 1 clique em todos os marketplaces.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/30">
          Pagamentos processados com segurança via Stripe · Cancele a qualquer momento
        </p>
      </main>
    </div>
  );
}
