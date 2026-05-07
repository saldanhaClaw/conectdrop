import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package } from "lucide-react";

const canalLabels: Record<string, string> = {
  MERCADO_LIVRE: "Mercado Livre",
  SHOPEE: "Shopee",
  MAGALU: "Magalu",
};

export default async function MeusProdutos() {
  const session = await auth();
  const importados = await prisma.produtoImportado.findMany({
    where: { userId: session!.user.id },
    include: {
      produto: { include: { fornecedor: { select: { razaoSocial: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <TopBar
        title="Meus Produtos"
        subtitle={`${importados.length} produto${importados.length !== 1 ? "s" : ""} importado${importados.length !== 1 ? "s" : ""}`}
      />
      <div className="p-6">
        {importados.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">Você ainda não importou produtos</p>
            <p className="text-sm mt-1">
              Explore o catálogo e importe produtos com 1 clique
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {importados.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.produto.nome}</p>
                    <p className="text-xs text-muted-foreground">{item.produto.fornecedor.razaoSocial}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatCurrency(Number(item.precoVenda))}</p>
                    <p className="text-xs text-muted-foreground">Custo: {formatCurrency(Number(item.produto.preco))}</p>
                  </div>
                  <Badge variant="secondary">{canalLabels[item.canal] || item.canal}</Badge>
                  <Badge variant={item.produto.estoque > 5 ? "success" : item.produto.estoque === 0 ? "destructive" : "warning"}>
                    {item.produto.estoque === 0 ? "Esgotado" : `${item.produto.estoque} em estoque`}
                  </Badge>
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {item.ultimoSync ? `Sync: ${formatDate(item.ultimoSync)}` : "Não sincronizado"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
