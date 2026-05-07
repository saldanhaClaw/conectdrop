import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Link2,
  TrendingUp,
  Shield,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">
              <span className="text-primary">DROP</span>
              <span className="text-foreground">CONNECT</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</Link>
            <Link href="#planos" className="hover:text-foreground transition-colors">Planos</Link>
            <Link href="#nichos" className="hover:text-foreground transition-colors">Nichos</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
        <Badge variant="secondary" className="mb-6">
          🚀 Plataforma SaaS de Dropshipping Multi-Marketplace
        </Badge>
        <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
          Venda online sem estoque.<br />
          <span className="text-primary">Automático.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Conectamos fornecedores qualificados com vendedores que querem vender no Mercado Livre, Shopee e Magalu — com sincronização automática de estoque e preços.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-base">
            <Link href="/register">
              Começar agora — grátis
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base">
            <Link href="/planos">Ver planos</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Sem período trial · Acesso imediato · Cancele quando quiser
        </p>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-surface/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Como funciona</h2>
            <p className="text-muted-foreground text-lg">Três passos. Zero complicação.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Shield,
                title: "Escolha o produto",
                desc: "Navegue no catálogo de fornecedores qualificados. Todos passaram por critérios rigorosos de qualidade.",
              },
              {
                step: "02",
                icon: Link2,
                title: "Importe com 1 clique",
                desc: "Conecte sua conta do Mercado Livre, Shopee ou Magalu e publique instantaneamente.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Venda e fature",
                desc: "Estoque e preços sincronizam automaticamente. Você só cuida das vendas.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-primary font-mono text-sm mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NICHOS */}
      <section id="nichos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Nichos validados</h2>
            <p className="text-muted-foreground">Mercado testado e aprovado por quem já vende.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🐾", nome: "Pet Shop", estrelas: 5, desc: "Alta recorrência" },
              { emoji: "🏠", nome: "Casa & Decoração", estrelas: 5, desc: "Volume alto" },
              { emoji: "👶", nome: "Baby", estrelas: 5, desc: "Ticket elevado" },
              { emoji: "🧹", nome: "Limpeza", estrelas: 4, desc: "Consumo contínuo" },
              { emoji: "💊", nome: "Saúde", estrelas: 4, desc: "Alta conversão" },
              { emoji: "⌚", nome: "Relógios", estrelas: 4, desc: "Boa margem" },
              { emoji: "📱", nome: "Eletrônicos", estrelas: 3, desc: "Alto volume" },
              { emoji: "✨", nome: "Mais em breve", estrelas: 0, desc: "Novos nichos" },
            ].map((nicho) => (
              <Card key={nicho.nome} className="hover:border-primary/50 transition-all">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{nicho.emoji}</div>
                  <div className="font-semibold text-sm text-foreground">{nicho.nome}</div>
                  <div className="flex justify-center gap-0.5 my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < nicho.estrelas ? "fill-yellow-400 text-yellow-400" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">{nicho.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="bg-surface/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Planos simples</h2>
            <p className="text-muted-foreground">Sem enrolação. Comece hoje.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="text-sm font-medium text-muted-foreground mb-2">MENSAL</div>
                <div className="text-4xl font-black text-foreground mb-1">R$ 169,90</div>
                <div className="text-sm text-muted-foreground mb-6">/mês</div>
                <ul className="space-y-3 mb-8">
                  {["Catálogo completo", "Importação 1 clique", "Sync automático", "Suporte por e-mail"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">Assinar mensal</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge>Mais popular</Badge>
              </div>
              <CardContent className="p-8">
                <div className="text-sm font-medium text-primary mb-2">ANUAL ⭐</div>
                <div className="text-4xl font-black text-foreground mb-1">R$ 97</div>
                <div className="text-sm text-muted-foreground mb-1">/mês · cobrado anualmente</div>
                <div className="text-xs text-accent mb-6">Economia de R$874/ano — 43% OFF</div>
                <ul className="space-y-3 mb-8">
                  {["Tudo do mensal", "43% de desconto", "Prioridade em novos nichos", "Relatórios avançados"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/register">Assinar anual</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              + Suporte Premium disponível por <span className="text-foreground font-medium">R$ 27/mês</span> no checkout
            </p>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Por que DropConnect?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🏆", title: "Fornecedores Qualificados", desc: "Todos passam por checklist rigoroso. Imagem, prazo, estoque e avaliação verificados." },
              { icon: "⚡", title: "Sync em Tempo Real", desc: "Estoque e preço sincronizados automaticamente a cada 15 minutos. Zero divergência." },
              { icon: "📱", title: "Mobile-First", desc: "Gerencie tudo pelo celular. Interface responsiva pensada para o vendedor em movimento." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border hover:border-primary/50 transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-primary/5 border-y border-primary/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Pronto para vender mais?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Crie sua conta agora e comece a importar produtos dos melhores fornecedores do Brasil.
          </p>
          <Button size="lg" asChild className="text-base">
            <Link href="/register">
              Criar conta grátis
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold">
              <span className="text-primary">DROP</span>
              <span className="text-foreground">CONNECT</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DropConnect. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Login</Link>
            <Link href="/register" className="hover:text-foreground">Cadastro</Link>
            <Link href="/planos" className="hover:text-foreground">Planos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
