import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

const marketplaces = [
  {
    id: "MERCADO_LIVRE",
    nome: "Mercado Livre",
    emoji: "🟡",
    desc: "O maior marketplace do Brasil",
    authUrl: "/api/marketplaces/mercadolivre/auth",
  },
  {
    id: "SHOPEE",
    nome: "Shopee",
    emoji: "🟠",
    desc: "Crescimento acelerado no Brasil",
    authUrl: "/api/marketplaces/shopee/auth",
  },
  {
    id: "MAGALU",
    nome: "Magazine Luiza",
    emoji: "🔵",
    desc: "Marketplace com forte presença nacional",
    authUrl: "/api/marketplaces/magalu/auth",
  },
];

export default async function CanaisPage() {
  const session = await auth();
  const canaisConectados = await prisma.canal_Config.findMany({
    where: { userId: session!.user.id },
  });

  const conectadosSet = new Set(canaisConectados.filter((c) => c.ativo).map((c) => c.canal));

  return (
    <div>
      <TopBar title="Marketplaces" subtitle="Conecte suas contas e comece a publicar" />
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {marketplaces.map((mp) => {
            const conectado = conectadosSet.has(mp.id as never);
            return (
              <Card key={mp.id} className={conectado ? "border-accent" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-3xl">{mp.emoji}</span>
                      <CardTitle className="text-base mt-2">{mp.nome}</CardTitle>
                    </div>
                    {conectado ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Conectado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Desconectado
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{mp.desc}</p>
                  {conectado ? (
                    <div className="space-y-2">
                      <p className="text-xs text-accent">Conta conectada com sucesso!</p>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={mp.authUrl}>Reconectar</Link>
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full" size="sm" asChild>
                      <Link href={mp.authUrl}>
                        <Link2 className="h-4 w-4" /> Conectar conta
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-surface/50 p-6">
          <h3 className="font-semibold text-foreground mb-2">Como funciona a conexão?</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. Clique em &ldquo;Conectar conta&rdquo; no marketplace desejado</li>
            <li>2. Você será redirecionado para autorizar o acesso à sua conta</li>
            <li>3. Após autorizar, volte ao DropConnect e comece a publicar produtos</li>
            <li>4. O estoque e preços sincronizarão automaticamente a cada 15 minutos</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
