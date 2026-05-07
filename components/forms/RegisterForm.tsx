"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["VENDEDOR", "FORNECEDOR"]),
  razaoSocial: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function RegisterForm() {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "VENDEDOR" },
  });

  const role = watch("role");

  async function onSubmit(data: FormData) {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        setErro(json.error || "Erro ao criar conta");
        return;
      }

      const login = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (login?.error) {
        setErro("Conta criada! Faça login.");
        router.push("/login");
        return;
      }

      const destino = data.role === "VENDEDOR" ? "/dashboard/vendedor" : "/dashboard/fornecedor";
      router.push(destino);
    } catch {
      setErro("Erro inesperado. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" placeholder="Seu nome" {...register("name")} />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" placeholder="Mínimo 6 caracteres" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <Label>Tipo de conta</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <label className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-all ${role === "VENDEDOR" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
            <input type="radio" value="VENDEDOR" {...register("role")} className="sr-only" />
            <span className="text-2xl mb-1">🛒</span>
            <span className="text-sm font-medium">Vendedor</span>
            <span className="text-xs opacity-70">Vendo online</span>
          </label>
          <label className={`flex cursor-pointer flex-col items-center rounded-lg border p-4 transition-all ${role === "FORNECEDOR" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
            <input type="radio" value="FORNECEDOR" {...register("role")} className="sr-only" />
            <span className="text-2xl mb-1">🏭</span>
            <span className="text-sm font-medium">Fornecedor</span>
            <span className="text-xs opacity-70">Tenho produtos</span>
          </label>
        </div>
      </div>

      {role === "FORNECEDOR" && (
        <div>
          <Label htmlFor="razaoSocial">Razão Social (opcional)</Label>
          <Input id="razaoSocial" placeholder="Nome da empresa" {...register("razaoSocial")} />
        </div>
      )}

      {erro && <p className="text-sm text-destructive text-center">{erro}</p>}

      <Button type="submit" className="w-full" disabled={carregando}>
        {carregando ? "Criando conta..." : "Criar conta grátis"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Fazer login
        </Link>
      </p>
    </form>
  );
}
