import { BookOpen, Play, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Crie sua conta e acesse o painel",
    desc: "Após o cadastro você já tem acesso ao catálogo completo de produtos para vender.",
    done: true,
  },
  {
    step: "02",
    title: "Conecte seus marketplaces",
    desc: "Acesse Lojas e conecte seu Mercado Livre, Shopee ou TikTok Shop.",
    done: false,
  },
  {
    step: "03",
    title: "Escolha produtos do catálogo",
    desc: "Navegue pelos produtos aprovados, veja margens sugeridas e importe com 1 clique.",
    done: false,
  },
  {
    step: "04",
    title: "Publique nos marketplaces",
    desc: "Seus produtos ficam disponíveis nos canais conectados com estoque sincronizado.",
    done: false,
  },
  {
    step: "05",
    title: "Gerencie pedidos e receba",
    desc: "Quando vender, o fornecedor envia direto para o cliente. Você só gerencia os lucros.",
    done: false,
  },
];

export default function TutorialPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold text-white">Tutorial</h1>
      </div>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex gap-4 items-center">
        <div className="p-3 rounded-xl bg-primary/20 shrink-0">
          <Play className="h-6 w-6 text-primary fill-primary" />
        </div>
        <div>
          <p className="font-semibold text-white">Comece por aqui</p>
          <p className="text-sm text-white/50 mt-0.5">
            Siga o passo a passo abaixo para começar a vender em menos de 30 minutos.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((s, i) => (
          <div
            key={s.step}
            className={`rounded-xl border p-5 flex gap-4 transition-all ${
              s.done
                ? "border-emerald-400/20 bg-emerald-400/5"
                : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {s.done ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <div className="h-6 w-6 rounded-full border-2 border-white/20 flex items-center justify-center">
                  <span className="text-xs text-white/40 font-bold">{i + 1}</span>
                </div>
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${s.done ? "text-emerald-400" : "text-white"}`}>
                {s.title}
              </p>
              <p className="text-xs text-white/40 mt-1">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
