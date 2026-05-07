import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Package, TrendingUp, AlertCircle, CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: React.ElementType; color: string }> = {
    ATIVO: { label: "Ativo", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-400/10" },
    PAUSADO: { label: "Pausado", icon: PauseCircle, color: "text-yellow-400 bg-yellow-400/10" },
    RASCUNHO: { label: "Rascunho", icon: Package, color: "text-blue-400 bg-blue-400/10" },
    ENCERRADO: { label: "Encerrado", icon: XCircle, color: "text-white/30 bg-white/[0.04]" },
    COM_ERRO: { label: "Com erro", icon: AlertCircle, color: "text-red-400 bg-red-400/10" },
  };
  const s = map[status] || map.RASCUNHO;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.color}`}>
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

function CanalBadge({ canal }: { canal: string }) {
  const map: Record<string, string> = {
    MERCADO_LIVRE: "Mercado Livre",
    SHOPEE: "Shopee",
    MAGALU: "Magalu",
  };
  return (
    <span className="text-xs text-white/50 bg-white/[0.05] px-2 py-0.5 rounded">
      {map[canal] || canal}
    </span>
  );
}

export default async function AnunciosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const anuncios = await prisma.produtoImportado.findMany({
    where: { userId: session.user.id },
    include: {
      produto: {
        include: { fornecedor: { select: { razaoSocial: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = anuncios.length;
  const ativos = anuncios.filter((a) => a.statusAnuncio === "ATIVO").length;
  const pausados = anuncios.filter((a) => a.statusAnuncio === "PAUSADO").length;
  const comErro = anuncios.filter((a) => a.statusAnuncio === "COM_ERRO").length;
  const totalVendidos = anuncios.reduce((s, a) => s + a.vendidos, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Anúncios</h1>
        <p className="text-white/40 text-sm mt-1">
          Gerencie todos os seus produtos publicados nos marketplaces
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: total, color: "text-white" },
          { label: "Ativos", value: ativos, color: "text-emerald-400" },
          { label: "Pausados", value: pausados, color: "text-yellow-400" },
          { label: "Com erro", value: comErro, color: "text-red-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
          >
            <p className="text-xs text-white/40">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Vendidos summary */}
      {totalVendidos > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-sm text-white/70">
            <span className="text-emerald-400 font-bold">{totalVendidos}</span> vendas registradas pelos seus anúncios
          </p>
        </div>
      )}

      {/* Table */}
      {anuncios.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <Package className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 text-sm">Nenhum anúncio ainda</p>
          <p className="text-white/30 text-xs mt-1">
            Importe produtos do catálogo para começar a anunciar
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left text-xs font-medium text-white/40 px-4 py-3">Produto</th>
                <th className="text-left text-xs font-medium text-white/40 px-4 py-3 hidden sm:table-cell">Canal</th>
                <th className="text-right text-xs font-medium text-white/40 px-4 py-3">Preço</th>
                <th className="text-right text-xs font-medium text-white/40 px-4 py-3 hidden md:table-cell">Vendidos</th>
                <th className="text-center text-xs font-medium text-white/40 px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-white/40 px-4 py-3 hidden lg:table-cell">Importado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {anuncios.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {a.produto.imagens[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={a.produto.imagens[0]}
                          alt={a.produto.nome}
                          className="h-9 w-9 rounded-lg object-cover bg-white/[0.05]"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-white/[0.05] flex items-center justify-center">
                          <Package className="h-4 w-4 text-white/20" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-white font-medium line-clamp-1">{a.produto.nome}</p>
                        <p className="text-xs text-white/40">{a.produto.fornecedor.razaoSocial}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <CanalBadge canal={a.canal} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-white font-medium">
                      R$ {Number(a.precoVenda).toFixed(2).replace(".", ",")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span className="text-sm text-white/70">{a.vendidos}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={a.statusAnuncio} />
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className="text-xs text-white/30">
                      {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true, locale: ptBR })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
