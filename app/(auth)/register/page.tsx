import Link from "next/link";
import { Zap } from "lucide-react";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata = { title: "Cadastro — DropConnect" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="h-7 w-7 text-primary" />
            <span className="font-bold text-2xl">
              <span className="text-primary">DROP</span>
              <span className="text-foreground">CONNECT</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Crie sua conta</h1>
          <p className="text-muted-foreground mt-1">Comece a vender hoje mesmo</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
