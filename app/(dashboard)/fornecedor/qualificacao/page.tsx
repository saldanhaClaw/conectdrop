"use client";
import { useState, useEffect } from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, AlertCircle, Loader2 } from "lucide-react";

interface Qualificacao {
  minProdutos: boolean;
  tempoEntregaOk: boolean;
  avaliacaoOk: boolean;
  imagensOk: boolean;
  descricaoOk: boolean;
  feedEstoqueOk: boolean;
}

interface FornecedorStatus {
  status: string;
  qualificacao: Qualificacao | null;
  _count: { produtos: number };
  avaliacaoMedia: number | null;
}

const CRITERIOS = [
  {
    key: "minProdutos" as keyof Qualificacao,
    titulo: "Mínimo de produtos",
    descricao: "Cadastre pelo menos 5 produtos ativos no catálogo",
    dica: "Vá para Meus Produtos e adicione mais itens",
  },
  {
    key: "imagensOk" as keyof Qualificacao,
    titulo: "Imagens de qualidade",
    descricao: "Todos os produtos devem ter ao menos 1 imagem",
    dica: "Adicione fotos claras e em alta resolução",
  },
  {
    key: "descricaoOk" as keyof Qualificacao,
    titulo: "Descrições completas",
    descricao: "Todos os produtos devem ter descrições detalhadas",
    dica: "Descreva materiais, dimensões e uso do produto",
  },
  {
    key: "tempoEntregaOk" as keyof Qualificacao,
    titulo: "Prazo de entrega adequado",
    descricao: "Tempo de despacho máximo de 3 dias úteis",
    dica: "Declare seu prazo real no perfil de fornecedor",
  },
  {
    key: "avaliacaoOk" as keyof Qualificacao,
    titulo: "Avaliação mínima",
    descricao: "Manter avaliação acima de 4.0 estrelas",
    dica: "Novos fornecedores passam automaticamente neste critério",
  },
  {
    key: "feedEstoqueOk" as keyof Qualificacao,
    titulo: "Feed de estoque ativo",
    descricao: "Manter estoque atualizado para evitar rupturas",
    dica: "Atualize o estoque regularmente ou ative a integração automática",
  },
];

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "secondary"; icon: React.ElementType }> = {
  APROVADO: { label: "Aprovado", variant: "success", icon: CheckCircle2 },
  PENDENTE: { label: "Em análise", variant: "warning", icon: Clock },
  REPROVADO: { label: "Reprovado", variant: "destructive", icon: AlertCircle },
  SUSPENSO: { label: "Suspenso", variant: "destructive", icon: AlertCircle },
};

export default function QualificacaoPage() {
  const [dados, setDados] = useState<FornecedorStatus | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch("/api/fornecedor/qualificacao")
      .then((r) => r.json())
      .then((d) => {
        setDados(d);
        setCarregando(false);
      });
  }, []);

  async function solicitarRevisao() {
    setEnviando(true);
    const res = await fetch("/api/fornecedor/qualificacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (res.ok) {
      setMensagem("Solicitação enviada! O admin analisará sua conta em breve.");
      fetch("/api/fornecedor/qualificacao")
        .then((r) => r.json())
        .then(setDados);
    } else {
      setMensagem(data.error || "Erro ao enviar solicitação");
    }
    setEnviando(false);
  }

  if (carregando) {
    return (
      <div>
        <TopBar title="Qualificação" subtitle="Critérios para aprovação na plataforma" />
        <div className="p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-surface animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!dados) return null;

  const qualificacao = dados.qualificacao;
  const criteriosOk = qualificacao
    ? Object.values(qualificacao).filter(Boolean).length
    : 0;
  const pct = Math.round((criteriosOk / 6) * 100);
  const st = statusConfig[dados.status] || statusConfig.PENDENTE;
  const StatusIcon = st.icon;

  return (
    <div>
      <TopBar title="Qualificação de Fornecedor" subtitle="Complete todos os critérios para ser aprovado" />
      <div className="p-6 space-y-6">
        {/* STATUS ATUAL */}
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon className="h-5 w-5" />
              <div>
                <p className="text-sm text-muted-foreground">Status atual</p>
                <Badge variant={st.variant} className="mt-1">{st.label}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{criteriosOk}/6</p>
              <p className="text-xs text-muted-foreground">critérios completos</p>
            </div>
          </CardContent>
        </Card>

        {/* BARRA DE PROGRESSO */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso de qualificação</span>
            <span className="font-medium text-foreground">{pct}%</span>
          </div>
          <Progress value={pct} className="h-3" />
        </div>

        {/* LISTA DE CRITÉRIOS */}
        <div className="space-y-3">
          {CRITERIOS.map((c) => {
            const ok = qualificacao ? qualificacao[c.key] : false;
            return (
              <Card key={c.key} className={ok ? "border-accent/50" : "border-border"}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="mt-0.5 shrink-0">
                    {ok ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${ok ? "text-accent" : "text-foreground"}`}>{c.titulo}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{c.descricao}</p>
                    {!ok && (
                      <p className="text-xs text-primary mt-1">
                        💡 {c.dica}
                      </p>
                    )}
                  </div>
                  <Badge variant={ok ? "success" : "secondary"}>
                    {ok ? "Concluído" : "Pendente"}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AÇÃO */}
        {dados.status === "PENDENTE" && (
          <div className="rounded-lg border border-border bg-surface/50 p-5 space-y-3">
            <h3 className="font-semibold text-foreground">Solicitar revisão</h3>
            <p className="text-sm text-muted-foreground">
              Após completar os critérios, solicite a revisão da sua conta. O time analisará em até 48h.
            </p>
            {mensagem && (
              <p className={`text-sm ${mensagem.includes("Erro") ? "text-destructive" : "text-accent"}`}>
                {mensagem}
              </p>
            )}
            <Button onClick={solicitarRevisao} disabled={enviando || criteriosOk < 5}>
              {enviando ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
              ) : (
                "Solicitar aprovação"
              )}
            </Button>
            {criteriosOk < 5 && (
              <p className="text-xs text-muted-foreground">Complete pelo menos 5 critérios para solicitar revisão</p>
            )}
          </div>
        )}

        {dados.status === "APROVADO" && (
          <div className="rounded-lg border border-accent/50 bg-accent/5 p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <p className="font-semibold text-accent">Conta aprovada!</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Seus produtos aparecem no catálogo para todos os vendedores da plataforma.
            </p>
          </div>
        )}

        {dados.status === "REPROVADO" && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="font-semibold text-destructive">Conta reprovada</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Corrija os critérios pendentes e solicite nova revisão.
            </p>
            <Button variant="outline" onClick={solicitarRevisao} disabled={enviando || criteriosOk < 5}>
              Solicitar nova revisão
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
