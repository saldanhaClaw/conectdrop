import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, TrendingUp, ShoppingCart, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard/vendedor");

  const [
    totalVendedores,
    totalFornecedores,
    fornecedoresPendentes,
    assinaturasAtivas,
    totalProdutos,
    assinaturas,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "VENDEDOR" } }),
    prisma.user.count({ where: { role: "FORNECEDOR" } }),
    prisma.fornecedor.count({ where: { status: "PENDENTE" } }),
    prisma.assinatura.count({ where: { status: "ATIVA" } }),
    prisma.produto.count({ where: { status: "ATIVO" } }),
    prisma.assinatura.findMany({
      where: { status: "ATIVA" },
      include: { plano: true },
    }),
  ]);

  const mrr = assinaturas.reduce((acc, a) => {
    const preco = Number(a.plano.preco);
    const mensal = a.plano.tipo === "ANUAL" ? preco : preco;
    return acc + mensal;
  }, 0);

  const inadimplentes = await prisma.assinatura.count({ where: { status: "INADIMPLENTE" } });

  const ultimosFornecedores = await prisma.fornecedor.findMany({
    where: { status: "PENDENTE" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <TopBar title="Painel Admin" subtitle="Visão geral da plataforma DropConnect" />
      <div className="p-6 space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="MRR Estimado"
            value={formatCurrency(mrr)}
            description="Receita mensal recorrente"
            icon={TrendingUp}
          />
          <StatsCard
            title="Assinaturas Ativas"
            value={assinaturasAtivas}
            description={`${inadimplentes} inadimplentes`}
            icon={ShoppingCart}
          />
          <StatsCard
            title="Usuários"
            value={totalVendedores + totalFornecedores}
            description={`${totalVendedores} vendedores · ${totalFornecedores} fornecedores`}
            icon={Users}
          />
          <StatsCard
            title="Produtos Ativos"
            value={totalProdutos}
            description="No catálogo da plataforma"
            icon={Package}
          />
        </div>

        {/* ALERTAS */}
        {(fornecedoresPendentes > 0 || inadimplentes > 0) && (
          <div className="space-y-2">
            {fornecedoresPendentes > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{fornecedoresPendentes} fornecedor{fornecedoresPendentes > 1 ? "es" : ""}</span>{" "}
                  aguardando aprovação
                </p>
                <a href="/dashboard/admin/fornecedores" className="ml-auto text-sm text-primary underline">
                  Revisar
                </a>
              </div>
            )}
            {inadimplentes > 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{inadimplentes} assinatura{inadimplentes > 1 ? "s" : ""}</span>{" "}
                  em inadimplência
                </p>
                <a href="/dashboard/admin/assinantes" className="ml-auto text-sm text-primary underline">
                  Ver
                </a>
              </div>
            )}
          </div>
        )}

        {/* FILA DE APROVAÇÃO */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              Fornecedores Aguardando Aprovação
              <a href="/dashboard/admin/fornecedores" className="text-sm text-primary font-normal">
                Ver todos →
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ultimosFornecedores.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum fornecedor pendente</p>
            ) : (
              <ul className="divide-y divide-border">
                {ultimosFornecedores.map((f) => (
                  <li key={f.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{f.razaoSocial}</p>
                      <p className="text-xs text-muted-foreground">{f.user.email}</p>
                    </div>
                    <Badge variant="warning">Pendente</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* BREAKDOWN PLANOS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Breakdown de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            {assinaturas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma assinatura ativa</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(
                  assinaturas.reduce(
                    (acc, a) => {
                      const nome = a.plano.nome;
                      acc[nome] = (acc[nome] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>
                  )
                ).map(([nome, count]) => (
                  <div key={nome} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{nome}</span>
                    <span className="font-semibold text-foreground">{count} assinante{count > 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
