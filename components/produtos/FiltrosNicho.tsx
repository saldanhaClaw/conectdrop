"use client";
import { NICHOS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FiltrosNichoProps {
  nichoAtivo: string;
  onChange: (nicho: string) => void;
}

const nichoEmojis: Record<string, string> = {
  Pet: "🐾",
  Casa: "🏠",
  Limpeza: "🧹",
  Baby: "👶",
  "Saúde": "💊",
  "Eletrônicos": "📱",
  "Relógios": "⌚",
};

export function FiltrosNicho({ nichoAtivo, onChange }: FiltrosNichoProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("todos")}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-all border",
          nichoAtivo === "todos"
            ? "bg-primary text-white border-primary"
            : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
        )}
      >
        Todos
      </button>
      {NICHOS.map((nicho) => (
        <button
          key={nicho}
          onClick={() => onChange(nicho)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all border",
            nichoAtivo === nicho
              ? "bg-primary text-white border-primary"
              : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
          )}
        >
          {nichoEmojis[nicho]} {nicho}
        </button>
      ))}
    </div>
  );
}
