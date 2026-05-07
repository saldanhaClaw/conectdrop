"use client";
import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Plus, Pencil, Trash2, Package, ImagePlus } from "lucide-react";
import { formatCurrency, NICHOS } from "@/lib/utils";

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoSugerido?: number;
  sku: string;
  nicho: string;
  imagens: string[];
  estoque: number;
  status: string;
}

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  ATIVO: { label: "Ativo", variant: "success" },
  RASCUNHO: { label: "Rascunho", variant: "secondary" },
  INATIVO: { label: "Inativo", variant: "destructive" },
};

const defaultForm = {
  nome: "",
  descricao: "",
  preco: "",
  precoSugerido: "",
  sku: "",
  nicho: "",
  estoque: "",
};

export default function FornecedorProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState<string | null>(null);

  const buscarProdutos = useCallback(async () => {
    setCarregando(true);
    const res = await fetch("/api/produtos?meus=true");
    const data = await res.json();
    setProdutos(data.produtos || []);
    setCarregando(false);
  }, []);

  useEffect(() => {
    buscarProdutos();
  }, [buscarProdutos]);

  function abrirNovo() {
    setEditando(null);
    setForm(defaultForm);
    setDialogAberto(true);
  }

  function abrirEdicao(produto: Produto) {
    setEditando(produto);
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: String(produto.preco),
      precoSugerido: produto.precoSugerido ? String(produto.precoSugerido) : "",
      sku: produto.sku,
      nicho: produto.nicho,
      estoque: String(produto.estoque),
    });
    setDialogAberto(true);
  }

  async function salvar() {
    if (!form.nome || !form.preco || !form.nicho || !form.estoque) return;
    setSalvando(true);
    const body = {
      nome: form.nome,
      descricao: form.descricao,
      preco: parseFloat(form.preco),
      precoSugerido: form.precoSugerido ? parseFloat(form.precoSugerido) : null,
      sku: form.sku,
      nicho: form.nicho,
      estoque: parseInt(form.estoque),
      imagens: [],
    };

    const res = editando
      ? await fetch(`/api/produtos/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    if (res.ok) {
      setDialogAberto(false);
      buscarProdutos();
    }
    setSalvando(false);
  }

  async function deletar(id: string) {
    setDeletando(id);
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    buscarProdutos();
    setDeletando(null);
  }

  return (
    <div>
      <TopBar
        title="Meus Produtos"
        subtitle={`${produtos.length} produto${produtos.length !== 1 ? "s" : ""} cadastrado${produtos.length !== 1 ? "s" : ""}`}
      />
      <div className="p-6 space-y-4">
        <div className="flex justify-end">
          <Button onClick={abrirNovo}>
            <Plus className="h-4 w-4" /> Novo Produto
          </Button>
        </div>

        {carregando ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Nenhum produto cadastrado</p>
            <p className="text-sm mt-1">Crie seu primeiro produto para aparecer no catálogo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {produtos.map((p) => {
              const st = statusLabels[p.status] || statusLabels.RASCUNHO;
              return (
                <Card key={p.id}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-surface flex items-center justify-center shrink-0">
                      {p.imagens?.[0] ? (
                        <Image src={p.imagens[0]} alt={p.nome} width={48} height={48} className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <ImagePlus className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">{p.nicho} · SKU: {p.sku || "—"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-foreground">{formatCurrency(p.preco)}</p>
                      <p className="text-xs text-muted-foreground">{p.estoque} em estoque</p>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => abrirEdicao(p)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletar(p.id)}
                        disabled={deletando === p.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do produto" />
            </div>
            <div className="space-y-1">
              <Label>Descrição</Label>
              <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição curta" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Preço de custo (R$) *</Label>
                <Input type="number" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="0.00" />
              </div>
              <div className="space-y-1">
                <Label>Preço sugerido (R$)</Label>
                <Input type="number" value={form.precoSugerido} onChange={(e) => setForm({ ...form, precoSugerido: e.target.value })} placeholder="0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU-001" />
              </div>
              <div className="space-y-1">
                <Label>Estoque *</Label>
                <Input type="number" value={form.estoque} onChange={(e) => setForm({ ...form, estoque: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Nicho *</Label>
              <Select value={form.nicho} onValueChange={(v) => setForm({ ...form, nicho: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nicho" />
                </SelectTrigger>
                <SelectContent>
                  {NICHOS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>
              {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar produto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
