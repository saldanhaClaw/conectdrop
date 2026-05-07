import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard } from "lucide-react";

const statusLabels: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary" }> = {
  ATIVA: { label: "Ativa", variant: "success" },
  INADIMPLENTE: { label: "Inadimplente", variant: "destructive" },
  CANCELADA: { label: "Cancelada", variant: "secondary" },
  TRIAL: { label: "Trial", variant: "warning" },
};

export default async function AdminAssinantes() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/dashboard/vendedor");

  const assinaturas = await prisma.assinatura.findMany({
    include: {
      plano: true,
      user: { select: { name: true, email: true } },
    },
    orderBy: { id: "desc" },
  });

  const ativas = assinaturas.filter((a) => a.status === "ATIVA").length;
  const inadimplentes = assinaturas.filter((a) => a.status === "INADIMPLENTE").length;
  const canceladas = assinaturas.filter((a) => a.status === "CANCELADA").length;
  const mrr = assinaturas
    .filter((a) => a.status === "ATIVA")
    .reduce((acc, a) => acc + Number(a.plano.preco), 0);

  return (
    <div>
      <TopBar title="Assinantes" subtitle="Gestão de planos e assinaturas" />
      <div className="p-6 space-y-6">
        {/* RESUMO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Ativas", value: ativas, color: "text-accent" },
            { label: "Inadimplentes", value: inadimplentes, color: "text-destructive" },
            { label: "Canceladas", value: canceladas, color: "text-muted-foreground" },
            { label: "MRR", value: formatCurrency(mrr), color: "text-primary" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* LISTA */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Todas as Assinaturas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {assinaturas.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhuma assinatura encontrada</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {assinaturas.map((a) => {
                  const st = statusLabels[a.status] || statusLabels.CANCELADA;
                  return (
                    <div key={a.id} className="flex items-center justify-between p-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{a.user.name}</p>
                        <p className="text-xs text-muted-foreground">{a.user.email}</p>
                      </div>
                      <div className="text-center shrink-0">
                        <p className="text-sm font-medium text-foreground">{a.plano.nome}</p>
                        <p className="text-xs text-muted-foreground">{formatCurrency(Number(a.plano.preco))}/mês</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant={st.variant}>{st.label}</Badge>
                        {a.suportePremium && (
                          <Badge variant="secondary" className="ml-1 text-xs">Suporte+</Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {a.inicioEm ? formatDate(a.inicioEm) : "—"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
