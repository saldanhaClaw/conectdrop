"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, CheckCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const planos = [
  {
    id: "mensal",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MENSAL,
    nome: "Mensal",
    preco: "R$ 169,90",
    periodo: "/mês",
    descricao: "Ideal para começar",
    features: [
      "Catálogo completo de fornecedores",
      "Importação 1 clique para Mercado Livre",
      "Sincronização automática de estoque",
      "Dashboard de vendedor",
      "Suporte por e-mail",
    ],
    destaque: false,
    economia: null,
  },
  {
    id: "anual",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANUAL,
    nome: "Anual",
    preco: "R$ 97",
    periodo: "/mês · cobrado anualmente",
    descricao: "Para quem leva a sério",
    features: [
      "Tudo do plano Mensal",
      "43% de desconto vs. mensal",
      "Prioridade em novos fornecedores",
      "Relatórios avançados",
      "Badge de assinante anual",
    ],
    destaque: true,
    economia: "Economia de R$874/ano",
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">
              <span className="text-primary">DROP</span>
              <span className="text-foreground">CONNECT</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-3">Escolha seu plano</h1>
          <p className="text-muted-foreground text-lg">Sem período trial. Acesso imediato após o pagamento.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {planos.map((plano) => (
            <Card key={plano.id} className={`relative ${plano.destaque ? "border-primary" : "border-border"}`}>
              {plano.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>⭐ Mais popular</Badge>
                </div>
              )}
              <CardContent className="p-8">
                <div className="text-sm font-semibold text-muted-foreground mb-3">{plano.nome.toUpperCase()}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-foreground">{plano.preco}</span>
                  <span className="text-sm text-muted-foreground">{plano.periodo}</span>
                </div>
                {plano.economia && (
                  <div className="text-sm text-accent font-medium mb-4">{plano.economia}</div>
                )}
                <p className="text-sm text-muted-foreground mb-6">{plano.descricao}</p>
                <ul className="space-y-3 mb-8">
                  {plano.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plano.destaque ? "default" : "outline"}
                  disabled={carregando === plano.id}
                  onClick={() => handleAssinar(plano.priceId || "", plano.id)}
                >
                  {carregando === plano.id ? "Redirecionando..." : `Assinar ${plano.nome}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* UPSELL SUPORTE PREMIUM */}
        <Card className={`border-2 transition-all ${incluiSuporte ? "border-accent bg-accent/5" : "border-border"}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="suporte"
                  checked={incluiSuporte}
                  onChange={(e) => setIncluiSuporte(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="suporte" className="cursor-pointer">
                  <div className="font-semibold text-foreground">
                    + Suporte Premium — R$ 27/mês
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Atendimento humanizado direto no app, tempo de resposta em menos de 2 horas e onboarding personalizado.
                  </p>
                </label>
              </div>
              <Badge variant={incluiSuporte ? "success" : "secondary"} className="shrink-0">
                {incluiSuporte ? "Incluído ✓" : "Opcional"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Pagamentos processados com segurança via Stripe · Cancele a qualquer momento
        </p>
      </main>
    </div>
  );
}
