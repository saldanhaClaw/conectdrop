import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Bell, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function ConfiguracoesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const sections = [
    {
      icon: User,
      title: "Perfil",
      desc: "Nome, e-mail e foto de perfil",
      href: "#",
    },
    {
      icon: Bell,
      title: "Notificações",
      desc: "Configure alertas de estoque e pedidos",
      href: "#",
    },
    {
      icon: CreditCard,
      title: "Assinatura",
      desc: "Gerencie seu plano e pagamentos",
      href: "/api/stripe/portal",
    },
  ];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
        <div className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
            {session.user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-white">{session.user.name}</p>
            <p className="text-sm text-white/40">{session.user.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.title}
              href={s.href}
              className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] p-4 transition-colors group"
            >
              <div className="p-2 rounded-lg bg-white/[0.05] group-hover:bg-primary/10 transition-colors">
                <Icon className="h-5 w-5 text-white/40 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{s.title}</p>
                <p className="text-xs text-white/40">{s.desc}</p>
              </div>
              <span className="text-white/20 text-lg">›</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
