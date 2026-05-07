import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Link2, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function VendedorDashboard() {
  const session = await auth();
  if (!session || session.user.role === "FORNECEDOR") redirect("/dashboard/fornecedor");

  const [importados, canais, assinatura] = await Promise.all([
    prisma.produtoImportado.count({ where: { userId: session.user.id } }),
    prisma.canal_Config.count({ where: { userId: session.user.id, ativo: true } }),
    prisma.assinatura.findUnique({
      where: { userId: session.user.id },
      include: { plano: true },
    }),
  ]);

  const produtosBaixoEstoque = await prisma.produtoImportado.findMany({
    where: { userId: session.user.id, produto: { estoque: { lt: 5 } } },
    include: { produto: { select: { nome: true, estoque: true } } },
    take: 5,
  });

  return (
    <div>
      <TopBar
        title={`Olá, ${session.user.name.split(" ")[0]}!`}
        subtitle="Acompanhe sua performance"
      />
      <div className="p-6 space-y-6">
        {/* ALERTA DE ASSINATURA */}
        {!assinatura && (
          <div className="flex items-center justify-between rounded-lg border border-primary/50 bg-primary/10 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-foreground">
                Você ainda não tem uma assinatura ativa. Assine para importar produtos.
              </p>
            </div>
            <Button size="sm" asChild>
              <Link href="/planos">Assinar agora</Link>
            </Button>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Produtos Importados"
            value={importados}
            description="Total de produtos no catálogo"
            icon={Package}
          />
          <StatsCard
            title="Canais Conectados"
            value={canais}
            description="Marketplaces ativos"
            icon={Link2}
          />
          <StatsCard
            title="Plano Atual"
            value={assinatura?.plano.nome || "Sem plano"}
            description={assinatura ? "Assinatura ativa" : "Sem assinatura"}
            icon={TrendingUp}
          />
        </div>

        {/* RECEITA CHART */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Receita (próximos meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ALERTAS DE ESTOQUE */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                Estoque Baixo
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/vendedor/meus-produtos">
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {produtosBaixoEstoque.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum produto com estoque baixo
                </p>
              ) : (
                <ul className="space-y-3">
                  {produtosBaixoEstoque.map((p) => (
                    <li key={p.id} className="flex items-center justify-between">
                      <span className="text-sm text-foreground truncate flex-1">{p.produto.nome}</span>
                      <Badge variant={p.produto.estoque === 0 ? "destructive" : "warning"}>
                        {p.produto.estoque === 0 ? "Esgotado" : `${p.produto.estoque} restantes`}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* AÇÕES RÁPIDAS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/vendedor/produtos">
                  <Package className="h-4 w-4" /> Explorar catálogo
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/vendedor/canais">
                  <Link2 className="h-4 w-4" /> Conectar marketplace
                </Link>
              </Button>
              {assinatura && (
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" asChild>
                  <Link href="/api/stripe/portal">Gerenciar assinatura</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
