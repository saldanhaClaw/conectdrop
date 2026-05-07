"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Link2,
  LogOut,
  Boxes,
  CheckSquare,
  Users,
  CreditCard,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Role = "VENDEDOR" | "FORNECEDOR" | "ADMIN";

const navItems: Record<Role, { href: string; label: string; icon: React.ElementType }[]> = {
  VENDEDOR: [
    { href: "/dashboard/vendedor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/vendedor/produtos", label: "Catálogo", icon: Package },
    { href: "/dashboard/vendedor/meus-produtos", label: "Meus Produtos", icon: ShoppingBag },
    { href: "/dashboard/vendedor/canais", label: "Marketplaces", icon: Link2 },
  ],
  FORNECEDOR: [
    { href: "/dashboard/fornecedor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/fornecedor/produtos", label: "Meus Produtos", icon: Boxes },
    { href: "/dashboard/fornecedor/qualificacao", label: "Qualificação", icon: CheckSquare },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/fornecedores", label: "Fornecedores", icon: Users },
    { href: "/dashboard/admin/assinantes", label: "Assinantes", icon: CreditCard },
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
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface/50 backdrop-blur-sm">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">
            <span className="text-primary">DROP</span>
            <span className="text-foreground">CONNECT</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-border/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <div className="px-2 py-1">
          <p className="text-xs text-muted-foreground">Logado como</p>
          <p className="text-sm font-medium text-foreground truncate">{userName}</p>
          <span className="text-xs text-primary capitalize">{role.toLowerCase()}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
