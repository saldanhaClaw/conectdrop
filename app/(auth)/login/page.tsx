import { Suspense } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata = { title: "Login — DropConnect" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="h-7 w-7 text-primary" />
            <span className="font-bold text-2xl">
              <span className="text-primary">DROP</span>
              <span className="text-foreground">CONNECT</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
          <p className="text-muted-foreground mt-1">Entre na sua conta</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
