"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sparkles,
  Store,
  Megaphone,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Boxes,
  CheckSquare,
  CreditCard,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Role = "VENDEDOR" | "FORNECEDOR" | "ADMIN";

const navItems: Record<Role, { href: string; label: string; icon: React.ElementType }[]> = {
  VENDEDOR: [
    { href: "/dashboard/vendedor", label: "Início", icon: LayoutDashboard },
    { href: "/dashboard/vendedor/pedidos", label: "Pedidos", icon: ShoppingCart },
    { href: "/dashboard/vendedor/produtos", label: "Produtos", icon: Package },
    { href: "/dashboard/vendedor/ia", label: "IA", icon: Sparkles },
    { href: "/dashboard/vendedor/lojas", label: "Lojas", icon: Store },
    { href: "/dashboard/vendedor/anuncios", label: "Anúncios", icon: Megaphone },
    { href: "/dashboard/vendedor/fornecedores", label: "Fornecedores", icon: Users },
    { href: "/dashboard/vendedor/tutorial", label: "Tutorial", icon: BookOpen },
    { href: "/dashboard/vendedor/configuracoes", label: "Configurações", icon: Settings },
  ],
  FORNECEDOR: [
    { href: "/dashboard/fornecedor", label: "Início", icon: LayoutDashboard },
    { href: "/dashboard/fornecedor/produtos", label: "Produtos", icon: Boxes },
    { href: "/dashboard/fornecedor/qualificacao", label: "Qualificação", icon: CheckSquare },
    { href: "/dashboard/fornecedor/configuracoes", label: "Configurações", icon: Settings },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Início", icon: LayoutDashboard },
    { href: "/dashboard/admin/fornecedores", label: "Fornecedores", icon: Users },
    { href: "/dashboard/admin/assinantes", label: "Assinantes", icon: CreditCard },
    { href: "/dashboard/admin/configuracoes", label: "Configurações", icon: Settings },
  ],
};

interface SidebarProps {
  role: Role;
  userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const items = navItems[role] || navItems.VENDEDOR;

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-white/[0.06] bg-[oklch(0.13_0.01_260)] sticky top-0">
      <div className="flex h-16 items-center px-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="font-bold text-base tracking-tight">
            <span className="text-primary">DROP</span>
            <span className="text-white">CONNECT</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== `/dashboard/${role.toLowerCase()}` &&
              pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-white/50 hover:bg-white/[0.05] hover:text-white/80"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "")} />
              {item.label}
              {item.label === "IA" && (
                <span className="ml-auto text-[10px] font-semibold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  PRO
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3 space-y-1">
        <div className="px-3 py-1.5">
          <p className="text-xs text-white/30 mb-0.5">Conta</p>
          <p className="text-sm font-medium text-white/80 truncate">{userName}</p>
          <span className="text-xs text-primary/70 capitalize">{role.toLowerCase()}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white/40 hover:text-red-400 hover:bg-red-400/10 gap-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
