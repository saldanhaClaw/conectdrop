"use client";
import { useState } from "react";
import {
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Package,
  ShoppingBag,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const lojas = [
  {
    id: "ml",
    nome: "Mercado Livre",
    descricao: "Maior marketplace da América Latina",
    conectada: true,
    gradientFrom: "#F5A623",
    gradientTo: "#E8900A",
    textColor: "#1a0a00",
    features: [
      { icon: Package, label: "Importação automática de produtos" },
      { icon: RefreshCw, label: "Sincronização de estoque em tempo real" },
      { icon: TrendingUp, label: "Precificação inteligente" },
      { icon: BarChart3, label: "Relatórios de vendas integrados" },
    ],
    logo: (
      <svg viewBox="0 0 60 40" className="h-8 w-auto" fill="none">
        <ellipse cx="30" cy="20" rx="28" ry="18" fill="#FFE600" stroke="#F5A623" strokeWidth="1" />
        <text x="30" y="26" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1a0a00">ML</text>
      </svg>
    ),
  },
  {
    id: "tiktok",
    nome: "TikTok Shop",
    descricao: "Venda diretamente para a Gen Z",
    conectada: false,
    gradientFrom: "#1a0a2e",
    gradientTo: "#0d0720",
    textColor: "#ffffff",
    features: [
      { icon: Package, label: "Catálogo sincronizado automaticamente" },
      { icon: RefreshCw, label: "Pedidos integrados ao painel" },
      { icon: TrendingUp, label: "Live shopping nativo" },
      { icon: ShoppingBag, label: "Afiliados e influenciadores" },
    ],
    logo: (
      <svg viewBox="0 0 40 40" className="h-8 w-auto" fill="none">
        <rect width="40" height="40" rx="8" fill="#010101" />
        <path
          d="M28 8h-4.5v16.5a5.5 5.5 0 01-5.5 5.5 5.5 5.5 0 01-5.5-5.5 5.5 5.5 0 015.5-5.5c.5 0 1 .07 1.5.2V14.6a10 10 0 00-1.5-.1A10 10 0 008 24.5 10 10 0 0018 34.5a10 10 0 0010-10V16.8A16.1 16.1 0 0028 17V8z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    id: "shopee",
    nome: "Shopee",
    descricao: "Crescimento acelerado no Brasil",
    conectada: false,
    gradientFrom: "#EE4D2D",
    gradientTo: "#CC3311",
    textColor: "#ffffff",
    features: [
      { icon: Package, label: "Importação de catálogo completo" },
      { icon: RefreshCw, label: "Sincronização de preço e estoque" },
      { icon: TrendingUp, label: "Campanhas e cupons integrados" },
      { icon: BarChart3, label: "Analytics de desempenho" },
    ],
    logo: (
      <svg viewBox="0 0 40 40" className="h-8 w-auto" fill="none">
        <circle cx="20" cy="20" r="20" fill="#EE4D2D" />
        <text x="20" y="26" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">S</text>
      </svg>
    ),
  },
];

export default function LojasPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleConnect = async (id: string) => {
    setLoading(id);
    if (id === "ml") {
      window.location.href = "/api/marketplaces/mercadolivre/auth";
    } else {
      setTimeout(() => setLoading(null), 1500);
    }
  };

  const handleDisconnect = async (id: string) => {
    setLoading(id);
    setTimeout(() => setLoading(null), 1000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Lojas conectadas</h1>
        <p className="text-white/50 mt-1 text-sm">
          Conecte seus marketplaces para importar e sincronizar produtos automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {lojas.map((loja) => (
          <div
            key={loja.id}
            className="rounded-2xl overflow-hidden border border-white/[0.08] flex flex-col"
            style={{
              background: `linear-gradient(145deg, ${loja.gradientFrom}, ${loja.gradientTo})`,
            }}
          >
            <div className="p-5 flex items-start justify-between">
              <div>
                {loja.logo}
                <h3
                  className="mt-3 text-lg font-bold"
                  style={{ color: loja.textColor }}
                >
                  {loja.nome}
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: loja.textColor, opacity: 0.7 }}
                >
                  {loja.descricao}
                </p>
              </div>
              {loja.conectada && (
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ color: loja.textColor }}>
                  <CheckCircle2 className="h-3 w-3" />
                  Conectada
                </span>
              )}
            </div>

            <div className="px-5 pb-4 flex-1">
              <ul className="space-y-2">
                {loja.features.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li
                      key={f.label}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: loja.textColor, opacity: 0.85 }}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" style={{ opacity: 0.9 }} />
                      {f.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="px-5 pb-5">
              {loja.conectada ? (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-xs"
                    onClick={() => handleDisconnect(loja.id)}
                    disabled={loading === loja.id}
                  >
                    {loading === loja.id ? "..." : "Desconectar conta"}
                  </Button>
                  <Button
                    size="sm"
                    className="border-white/30 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-xs"
                    style={{ color: loja.textColor }}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  className="w-full text-xs font-semibold bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20"
                  style={{ color: loja.id === "ml" ? "#1a0a00" : "#ffffff" }}
                  onClick={() => handleConnect(loja.id)}
                  disabled={loading === loja.id}
                >
                  {loading === loja.id ? "Conectando..." : `Conectar com ${loja.nome}`}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white/70 mb-1">Em breve</h2>
        <p className="text-xs text-white/40">
          Magalu, Amazon, Americanas e outros marketplaces estão sendo integrados. Você será notificado quando estiverem disponíveis.
        </p>
      </div>
    </div>
  );
}
