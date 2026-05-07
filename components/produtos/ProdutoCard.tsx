"use client";
import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Star } from "lucide-react";

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

interface ProdutoCardProps {
  produto: Produto;
  onImportar?: (id: string) => void;
}

export function ProdutoCard({ produto, onImportar }: ProdutoCardProps) {
  const [carregando, setCarregando] = useState(false);

  async function handleImportar() {
    setCarregando(true);
    onImportar?.(produto.id);
    setTimeout(() => setCarregando(false), 1500);
  }

  const margem = produto.precoSugerido
    ? (((produto.precoSugerido - produto.preco) / produto.precoSugerido) * 100).toFixed(0)
    : null;

  return (
    <Card className="group flex flex-col overflow-hidden hover:border-primary/50 transition-all duration-200">
      <div className="relative h-48 bg-surface overflow-hidden">
        {produto.imagens[0] ? (
          <Image
            src={produto.imagens[0]}
            alt={produto.nome}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant="secondary" className="text-xs">
            {produto.nicho}
          </Badge>
          {margem && (
            <Badge variant="success" className="text-xs">
              {margem}% margem
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="flex-1 p-4">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">{produto.nome}</h3>
        <p className="text-xs text-muted-foreground mb-3">{produto.fornecedor.razaoSocial}</p>

        {produto.fornecedor.avaliacaoMedia && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{produto.fornecedor.avaliacaoMedia.toFixed(1)}</span>
          </div>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{formatCurrency(produto.preco)}</span>
          {produto.precoSugerido && (
            <span className="text-xs text-muted-foreground">
              Sugerido: {formatCurrency(produto.precoSugerido)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{produto.estoque} em estoque</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          onClick={handleImportar}
          disabled={carregando || produto.estoque === 0}
        >
          <ShoppingCart className="h-4 w-4" />
          {carregando ? "Importando..." : produto.estoque === 0 ? "Esgotado" : "Importar Produto"}
        </Button>
      </CardFooter>
    </Card>
  );
}
