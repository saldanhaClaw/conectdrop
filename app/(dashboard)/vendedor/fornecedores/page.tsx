import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Star, Package, CheckCircle2, Users } from "lucide-react";

export default async function FornecedoresPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const fornecedores = await prisma.fornecedor.findMany({
    where: { status: "APROVADO" },
    include: {
      qualificacao: true,
      _count: { select: { produtos: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fornecedores</h1>
        <p className="text-white/40 text-sm mt-1">
          Todos os fornecedores verificados e aprovados na plataforma
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Fornecedores aprovados", value: fornecedores.length },
          { label: "Produtos disponíveis", value: fornecedores.reduce((s, f) => s + f._count.produtos, 0) },
          { label: "Com qualificação", value: fornecedores.filter((f) => f.qualificacao).length },
          { label: "Nichos cobertos", value: new Set(fornecedores.flatMap((f) => f.nichos)).size },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {fornecedores.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
          <Users className="h-10 w-10 text-white/10 mx-auto mb-3" />
          <p className="text-white/50">Nenhum fornecedor aprovado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fornecedores.map((f) => {
            const criterios = f.qualificacao
              ? [
                  f.qualificacao.minProdutos,
                  f.qualificacao.tempoEntregaOk,
                  f.qualificacao.avaliacaoOk,
                  f.qualificacao.imagensOk,
                  f.qualificacao.descricaoOk,
                  f.qualificacao.feedEstoqueOk,
                ].filter(Boolean).length
              : 0;

            return (
              <div
                key={f.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {f.razaoSocial[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{f.razaoSocial}</p>
                      <p className="text-xs text-white/40">
                        {f.tempoDeMercado > 0 ? `${f.tempoDeMercado} anos no mercado` : "Novo"}
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                </div>

                {f.nichos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {f.nichos.slice(0, 4).map((n) => (
                      <span
                        key={n}
                        className="text-xs text-white/60 bg-white/[0.05] px-2 py-0.5 rounded-full"
                      >
                        {n}
                      </span>
                    ))}
                    {f.nichos.length > 4 && (
                      <span className="text-xs text-white/30">+{f.nichos.length - 4}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-white/50">
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5" />
                    {f._count.produtos} produtos
                  </div>
                  {f.avaliacaoMedia && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      {f.avaliacaoMedia.toFixed(1)}
                    </div>
                  )}
                  {f.qualificacao && (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {criterios}/6 critérios
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
