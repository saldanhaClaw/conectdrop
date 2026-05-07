"use client";
import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Clock, Users } from "lucide-react";

interface Fornecedor {
  id: string;
  razaoSocial: string;
  cnpj: string;
  status: string;
  nichos: string[];
  createdAt: string;
  user: { name: string; email: string };
  qualificacao: {
    minProdutos: boolean;
    tempoEntregaOk: boolean;
    avaliacaoOk: boolean;
    imagensOk: boolean;
    descricaoOk: boolean;
    feedEstoqueOk: boolean;
  } | null;
}

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  APROVADO: { label: "Aprovado", variant: "success" },
  PENDENTE: { label: "Em análise", variant: "warning" },
  REPROVADO: { label: "Reprovado", variant: "destructive" },
  SUSPENSO: { label: "Suspenso", variant: "destructive" },
};

export default function AdminFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("PENDENTE");

  const buscar = useCallback(async () => {
    setCarregando(true);
    const res = await fetch(`/api/admin/fornecedores?status=${filtro}`);
    const data = await res.json();
    setFornecedores(data.fornecedores || []);
    setCarregando(false);
  }, [filtro]);

  useEffect(() => { buscar(); }, [buscar]);

  async function atualizarStatus(id: string, status: string) {
    setAtualizando(id);
    await fetch(`/api/admin/fornecedores`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fornecedorId: id, status }),
    });
    buscar();
    setAtualizando(null);
  }

  const filtros = ["PENDENTE", "APROVADO", "REPROVADO", "SUSPENSO"];

  return (
    <div>
      <TopBar title="Fornecedores" subtitle="Gerencie e aprove fornecedores da plataforma" />
      <div className="p-6 space-y-4">
        {/* FILTROS */}
        <div className="flex gap-2 flex-wrap">
          {filtros.map((f) => (
            <Button
              key={f}
              variant={filtro === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltro(f)}
            >
              {statusLabels[f]?.label}
            </Button>
          ))}
        </div>

        {carregando ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : fornecedores.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Nenhum fornecedor com este status</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fornecedores.map((f) => {
              const st = statusLabels[f.status] || statusLabels.PENDENTE;
              const criteriosOk = f.qualificacao
                ? Object.values(f.qualificacao).filter(Boolean).length
                : 0;

              return (
                <Card key={f.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{f.razaoSocial}</p>
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{f.user.name} · {f.user.email}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">CNPJ: {f.cnpj || "—"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-foreground">{criteriosOk}/6 critérios</p>
                        <p className="text-xs text-muted-foreground">
                          {f.nichos?.slice(0, 2).join(", ") || "Sem nichos"}
                        </p>
                      </div>
                    </div>

                    {/* CRITÉRIOS */}
                    {f.qualificacao && (
                      <div className="flex gap-1 flex-wrap">
                        {[
                          { k: "minProdutos", l: "Produtos" },
                          { k: "imagensOk", l: "Imagens" },
                          { k: "descricaoOk", l: "Descrições" },
                          { k: "tempoEntregaOk", l: "Entrega" },
                          { k: "avaliacaoOk", l: "Avaliação" },
                          { k: "feedEstoqueOk", l: "Estoque" },
                        ].map(({ k, l }) => (
                          <Badge
                            key={k}
                            variant={f.qualificacao![k as keyof typeof f.qualificacao] ? "success" : "secondary"}
                            className="text-xs"
                          >
                            {l}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* AÇÕES */}
                    {f.status === "PENDENTE" && (
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => atualizarStatus(f.id, "APROVADO")}
                          disabled={atualizando === f.id}
                          className="gap-1"
                        >
                          <CheckCircle className="h-4 w-4" /> Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => atualizarStatus(f.id, "REPROVADO")}
                          disabled={atualizando === f.id}
                          className="gap-1"
                        >
                          <XCircle className="h-4 w-4" /> Reprovar
                        </Button>
                      </div>
                    )}
                    {f.status === "APROVADO" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => atualizarStatus(f.id, "SUSPENSO")}
                        disabled={atualizando === f.id}
                        className="gap-1"
                      >
                        <Clock className="h-4 w-4" /> Suspender
                      </Button>
                    )}
                    {(f.status === "REPROVADO" || f.status === "SUSPENSO") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => atualizarStatus(f.id, "PENDENTE")}
                        disabled={atualizando === f.id}
                        className="gap-1"
                      >
                        <Clock className="h-4 w-4" /> Recolocar em análise
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
