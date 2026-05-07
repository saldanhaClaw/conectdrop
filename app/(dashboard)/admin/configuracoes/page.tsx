import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";

export default async function AdminConfiguracoesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard/vendedor");

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-white">Configurações Admin</h1>
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <p className="text-white/40 text-sm">Configurações administrativas em breve.</p>
      </div>
    </div>
  );
}
