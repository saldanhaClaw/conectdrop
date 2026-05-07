"use client";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, TrendingUp, AlertTriangle, Grid3X3, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  precoSugerido?: number;
  nicho: string;
  imagens: string[];
  estoque: number;
  fornecedor: { razaoSocial: string; avaliacaoMedia?: number };
}

const NICHOS = [
  "Todos",
  "Pet",
  "Casa",
  "Limpeza",
  "Baby",
  "Beleza",
  "Eletrônicos",
  "Fitness",
  "Moda",
];

function ProdutoCard({ produto, onImportar }: { produto: Produto; onImportar: (id: string) => void }) {
  const [importing, setImporting] = useState(false);

  async function handleClick() {
    setImporting(true);
    await onImportar(produto.id);
    setImporting(false);
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[oklch(0.16_0.01_260)] overflow-hidden group hover:border-white/10 transition-all">
      <div className="relative aspect-square bg-white/[0.04] overflow-hidden">
        {produto.imagens[0] ? (
          <Image
            src={produto.imagens[0]}
            alt={produto.nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-white/10" />
          </div>
        )}
        {produto.estoque > 0 && (
          <span className="absolute bottom-2 right-2 bg-emerald-500/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
            Em estoque
          </span>
        )}
        {produto.estoque === 0 && (
          <span className="absolute bottom-2 right-2 bg-red-500/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
            Esgotado
          </span>
        )}
      </div>
      <div className="p-3 space-y-2">
        <p className="text-xs text-white/40 font-medium">{produto.fornecedor.razaoSocial}</p>
        <p className="text-sm text-white font-medium line-clamp-2 leading-snug">{produto.nome}</p>
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-base font-bold text-white">
              R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
            </p>
            {produto.precoSugerido && (
              <p className="text-xs text-emerald-400">
                Venda por R$ {Number(produto.precoSugerido).toFixed(2).replace(".", ",")}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          className="w-full text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 hover:border-primary/40"
          onClick={handleClick}
          disabled={importing || produto.estoque === 0}
        >
          {importing ? "Importando..." : "Importar produto"}
        </Button>
      </div>
    </div>
  );
}

export default function CatalogoProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nicho, setNicho] = useState("todos");
  const [busca, setBusca] = useState("");
  const [ordem] = useState("Mais recentes");

  const buscarProdutos = useCallback(async () => {
    setCarregando(true);
    const params = new URLSearchParams();
    if (nicho !== "todos") params.set("nicho", nicho);
    if (busca) params.set("q", busca);
    const res = await fetch(`/api/produtos?${params}`);
    const data = await res.json();
    setProdutos(data.produtos || []);
    setCarregando(false);
  }, [nicho, busca]);

  useEffect(() => {
    const timer = setTimeout(buscarProdutos, 300);
    return () => clearTimeout(timer);
  }, [buscarProdutos]);

  async function handleImportar(produtoId: string) {
    await fetch("/api/produtos/importar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produtoId, canal: "MERCADO_LIVRE", precoVenda: null }),
    });
  }

  const total = produtos.length;
  const anunciados = produtos.filter((p) => p.estoque > 0).length;
  const baixoEstoque = produtos.filter((p) => p.estoque > 0 && p.estoque <= 5).length;
  const categorias = new Set(produtos.map((p) => p.nicho)).size;

  return (
    <div className="p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total de produtos", value: total, icon: Package, color: "text-purple-400 bg-purple-400/10" },
          { label: "Anunciados", value: anunciados, icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/10" },
          { label: "Baixo estoque", value: baixoEstoque, icon: AlertTriangle, color: "text-yellow-400 bg-yellow-400/10" },
          { label: "Categorias", value: categorias, icon: Grid3X3, color: "text-blue-400 bg-blue-400/10" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.color.split(" ")[1]}`}>
                <Icon className={`h-4 w-4 ${s.color.split(" ")[0]}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-9 bg-white/[0.04] border-white/[0.06] text-white placeholder:text-white/30"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 text-sm text-white/60 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-2.5 hover:bg-white/[0.07] transition-colors">
          {ordem}
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Nicho filters */}
      <div className="flex gap-2 flex-wrap">
        {NICHOS.map((n) => {
          const value = n === "Todos" ? "todos" : n;
          return (
            <button
              key={n}
              onClick={() => setNicho(value)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all border",
                nicho === value
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "text-white/50 border-white/[0.06] hover:border-white/10 hover:text-white/70"
              )}
            >
              {nicho === value ? `${n} ${total}` : n}
            </button>
          );
        })}
      </div>

      {carregando ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : produtos.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
          <Package className="h-10 w-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/50">Nenhum produto encontrado</p>
          <p className="text-white/30 text-sm mt-1">Tente outro nicho ou busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onImportar={handleImportar} />
          ))}
        </div>
      )}
    </div>
  );
}
