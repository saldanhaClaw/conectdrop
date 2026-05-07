"use client";
import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { ProdutoCard } from "@/components/produtos/ProdutoCard";
import { FiltrosNicho } from "@/components/produtos/FiltrosNicho";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

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

export default function CatalogoProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nicho, setNicho] = useState("todos");
  const [busca, setBusca] = useState("");

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

  return (
    <div>
      <TopBar title="Catálogo de Produtos" subtitle="Explore e importe produtos dos melhores fornecedores" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <FiltrosNicho nichoAtivo={nicho} onChange={setNicho} />

        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Nenhum produto encontrado</p>
            <p className="text-sm mt-1">Tente outro nicho ou busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {produtos.map((produto) => (
              <ProdutoCard key={produto.id} produto={produto} onImportar={handleImportar} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
