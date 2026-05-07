"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setCarregando(true);
    setErro("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setErro("E-mail ou senha incorretos");
      setCarregando(false);
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/vendedor";
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="seu@email.com" {...register("email")} />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <Label htmlFor="password">Senha</Label>
        </div>
        <Input id="password" type="password" placeholder="••••••" {...register("password")} />
        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
      </div>

      {erro && <p className="text-sm text-destructive text-center">{erro}</p>}

      <Button type="submit" className="w-full" disabled={carregando}>
        {carregando ? "Entrando..." : "Entrar"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Criar conta grátis
        </Link>
      </p>
    </form>
  );
}
