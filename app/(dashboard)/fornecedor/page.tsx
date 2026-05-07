import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Boxes, CheckSquare, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  APROVADO: { label: "Aprovado", variant: "success" },
  PENDENTE: { label: "Em análise", variant: "warning" },
  REPROVADO: { label: "Reprovado", variant: "destructive" },
  SUSPENSO: { label: "Suspenso", variant: "destructive" },
};

export default async function FornecedorDashboard() {
  const session = await auth();
  if (!session || session.user.role === "VENDEDOR") redirect("/dashboard/vendedor");

  const fornecedor = await prisma.fornecedor.findUnique({
    where: { userId: session.user.id },
    include: {
      qualificacao: true,
      _count: { select: { produtos: true } },
    },
  });

  if (!fornecedor) redirect("/login");

  const criteriosOk = fornecedor.qualificacao
    ? [
        fornecedor.qualificacao.minProdutos,
        fornecedor.qualificacao.tempoEntregaOk,
        fornecedor.qualificacao.avaliacaoOk,
        fornecedor.qualificacao.imagensOk,
        fornecedor.qualificacao.descricaoOk,
        fornecedor.qualificacao.feedEstoqueOk,
      ].filter(Boolean).length
    : 0;

  const statusInfo = statusLabels[fornecedor.status] || statusLabels.PENDENTE;

  return (
    <div>
      <TopBar
        title={`Olá, ${session.user.name.split(" ")[0]}!`}
        subtitle={fornecedor.razaoSocial}
      />
      <div className="p-6 space-y-6">
        {/* STATUS BADGE */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface/50 p-4">
          <div>
            <p className="text-sm text-muted-foreground">Status da conta</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              {fornecedor.status === "PENDENTE" && (
                <span className="text-xs text-muted-foreground">Aguardando revisão do admin</span>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/fornecedor/qualificacao">
              Ver qualificação <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total de Produtos"
            value={fornecedor._count.produtos}
            description="Produtos cadastrados"
            icon={Boxes}
          />
          <StatsCard
            title="Critérios Aprovados"
            value={`${criteriosOk}/6`}
            description="Qualificação completa"
            icon={CheckSquare}
          />
          <StatsCard
            title="Avaliação Média"
            value={fornecedor.avaliacaoMedia ? `${fornecedor.avaliacaoMedia.toFixed(1)}⭐` : "N/A"}
            description="Score da plataforma"
            icon={TrendingUp}
          />
        </div>

        {/* QUALIFICAÇÃO PROGRESS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              Qualificação de Fornecedor
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/fornecedor/qualificacao">
                  Completar <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium text-foreground">{criteriosOk}/6 critérios</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${(criteriosOk / 6) * 100}%` }}
                />
              </div>
            </div>
            {criteriosOk < 6 && (
              <p className="text-xs text-muted-foreground">
                Complete todos os critérios para ter sua conta aprovada e aparecer no catálogo de vendedores.
              </p>
            )}
          </CardContent>
        </Card>

        {/* AÇÕES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/fornecedor/produtos">
                <Boxes className="h-4 w-4" /> Gerenciar produtos
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/fornecedor/qualificacao">
                <CheckSquare className="h-4 w-4" /> Completar qualificação
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
