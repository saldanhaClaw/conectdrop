import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Package } from "lucide-react";

export default async function FornecedorConfiguracoesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
        <div className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
            {session.user.name?.[0]?.toUpperCase() || "F"}
          </div>
          <div>
            <p className="font-semibold text-white">{session.user.name}</p>
            <p className="text-sm text-white/40">{session.user.email}</p>
            <span className="text-xs text-primary/70">Fornecedor</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: User, title: "Dados da empresa", desc: "Razão social, CNPJ e informações do negócio", href: "#" },
          { icon: Package, title: "Preferências de catálogo", desc: "Nichos, categorias e visibilidade dos produtos", href: "#" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="p-2 rounded-lg bg-white/[0.05]">
                <Icon className="h-5 w-5 text-white/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-xs text-white/40">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
