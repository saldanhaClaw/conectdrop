import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncStockMercadoLivre } from "@/lib/mercadolivre";
import { decrypt } from "@/lib/utils";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const importados = await prisma.produtoImportado.findMany({
    where: { ativo: true },
    include: {
      produto: true,
      user: {
        include: {
          canais: { where: { ativo: true } },
        },
      },
    },
  });

  const resultados = [];

  for (const importado of importados) {
    try {
      const canalConfig = importado.user.canais.find((c) => c.canal === importado.canal);
      if (!canalConfig || !importado.externalId) continue;

      if (importado.canal === "MERCADO_LIVRE") {
        const accessToken = decrypt(canalConfig.accessToken);
        await syncStockMercadoLivre(
          accessToken,
          importado.externalId,
          importado.produto.estoque,
          Number(importado.precoVenda)
        );

        await prisma.produtoImportado.update({
          where: { id: importado.id },
          data: { ultimoSync: new Date() },
        });

        await prisma.syncLog.create({
          data: {
            produtoImportadoId: importado.id,
            tipo: "estoque",
            valorNovo: String(importado.produto.estoque),
            sucesso: true,
          },
        });

        resultados.push({ id: importado.id, sucesso: true });
      }
    } catch (err) {
      await prisma.syncLog.create({
        data: {
          produtoImportadoId: importado.id,
          tipo: "estoque",
          sucesso: false,
          erro: err instanceof Error ? err.message : "Erro desconhecido",
        },
      });
      resultados.push({ id: importado.id, sucesso: false });
    }
  }

  return NextResponse.json({ sincronizados: resultados.length, resultados });
}
