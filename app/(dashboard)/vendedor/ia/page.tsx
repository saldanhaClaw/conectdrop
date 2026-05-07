"use client";
import { Sparkles, TrendingUp, Calculator, Zap, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
  {
    icon: TrendingUp,
    value: "+340%",
    label: "produtos em tendência identificados",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: Calculator,
    value: "68%",
    label: "de margem calculada automaticamente",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Zap,
    value: "1 clique",
    label: "para publicar em qualquer marketplace",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
];

const features = [
  {
    title: "Detecção de tendências",
    desc: "Nossa IA analisa dados de busca, redes sociais e vendas em tempo real para identificar produtos com alta demanda antes de virarem concorrência.",
    icon: TrendingUp,
  },
  {
    title: "Precificação inteligente",
    desc: "Calcule automaticamente a margem ideal levando em conta frete, comissão do marketplace e custo do produto.",
    icon: Calculator,
  },
  {
    title: "Publicação com 1 clique",
    desc: "Selecione um produto e publique em todos os seus marketplaces conectados simultaneamente, com título e descrição otimizados por IA.",
    icon: Zap,
  },
];

export default function IAPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-white">IA para dropshipping</h1>
        <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full">PRO</span>
      </div>

      {/* Hero card */}
      <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.62_0.26_250/0.15),transparent_60%)]" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-white mb-3">
            Encontre os produtos<br />
            <span className="text-primary">campeões de vendas</span>
          </h2>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Nossa inteligência artificial monitora tendências, calcula margens e sugere os melhores produtos para o seu nicho — tudo automaticamente, enquanto você foca em vender.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Sparkles className="h-4 w-4" />
              Analisar agora
              <Lock className="h-3.5 w-3.5 opacity-60" />
            </Button>
            <Link href="/planos">
              <Button variant="outline" className="border-white/20 text-white/70 hover:text-white gap-2">
                Ver planos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.value}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 flex items-start gap-4"
            >
              <div className={`p-2.5 rounded-lg ${s.bg}`}>
                <Icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-white/50 mt-0.5 leading-snug">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider">
          O que está incluído no plano PRO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3"
              >
                <div className="p-2 w-fit rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold text-white text-sm">{f.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA bloqueado */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/[0.05]">
            <Lock className="h-5 w-5 text-white/40" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Recurso disponível no plano Mensal</p>
            <p className="text-xs text-white/40">Faça upgrade para desbloquear a análise por IA</p>
          </div>
        </div>
        <Link href="/planos">
          <Button className="bg-primary hover:bg-primary/90 shrink-0">
            Fazer upgrade
          </Button>
        </Link>
      </div>
    </div>
  );
}
