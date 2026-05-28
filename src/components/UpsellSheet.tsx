import { Sparkles, Plus, X, Target, Heart, Coffee } from "lucide-react";
import { useEffect } from "react";
import type { MenuItem } from "@/data/menu";

export interface UpsellSuggestion {
  kind: "goal" | "pairing" | "experience";
  id: string;
  nome: string;
  preco: number;
  categoria: MenuItem["categoria"];
  subcategoria: MenuItem["subcategoria"];
  frase_venda: string;
  badgeLabel?: string;
  ctaLabel?: string;
}


interface Props {
  item: MenuItem | null;
  suggestions: UpsellSuggestion[];
  onAdd: (s: UpsellSuggestion) => void;
  onDismiss: () => void;
  /** Quando definido, o sheet é renderizado como bloco de Experiência (sem preços, sem +€, cabeçalho dedicado). */
  experienceTitle?: string;
}

export function UpsellSheet({ item, suggestions, onAdd, onDismiss, experienceTitle }: Props) {
  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [item]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-md bg-card text-card-foreground rounded-t-3xl p-6 pb-8 shadow-[var(--shadow-upsell)] animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            {experienceTitle ? <Coffee className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              {experienceTitle ?? "Sugestões Delta"}
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            aria-label="Dispensar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {experienceTitle ? "A acompanhar" : "Pedido"}:{" "}
          <span className="font-medium text-foreground">{item.nome}</span>
        </p>

        <div className="mt-4 space-y-3">
          {suggestions.map((s) => {
            const isExperience = s.kind === "experience";
            const isGoal = s.kind === "goal";
            return (
              <div
                key={`${s.kind}-${s.id}`}
                className={`relative rounded-2xl border-2 p-4 ${
                  isExperience
                    ? "border-accent/60 bg-accent/5"
                    : isGoal
                    ? "border-accent bg-accent/10"
                    : "border-border bg-secondary/60"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {isExperience ? (
                    <Coffee className="h-3.5 w-3.5 text-accent" />
                  ) : isGoal ? (
                    <Target className="h-3.5 w-3.5 text-accent" />
                  ) : (
                    <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isExperience || isGoal ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {s.badgeLabel ?? (isGoal ? "Objetivo do mês · +€ prémio" : "Combina perfeitamente")}
                  </span>
                </div>

                <h3 className="mt-1 font-display text-xl leading-tight text-foreground">
                  {s.nome}
                </h3>
                {!isExperience && (
                  <p className="mt-0.5 text-sm font-semibold text-accent">
                    +{s.preco.toFixed(2)} €
                  </p>
                )}

                <p className="mt-2 text-[12px] leading-snug text-foreground/80 italic">
                  "{s.frase_venda}"
                </p>

                <button
                  onClick={() => onAdd(s)}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold active:scale-[0.98] transition-transform ${
                    isExperience
                      ? "bg-foreground text-background"
                      : isGoal
                      ? "bg-accent text-accent-foreground"
                      : "bg-success text-success-foreground"
                  }`}
                >
                  {isExperience ? <Coffee className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {s.ctaLabel ?? "Adicionar"}
                </button>
              </div>
            );
          })}

          {suggestions.length === 0 && (
            <p className="rounded-2xl bg-muted/40 p-4 text-center text-xs text-muted-foreground">
              Sem sugestões adicionais para este pedido.
            </p>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="mt-5 w-full rounded-xl bg-muted px-4 py-3 text-sm font-medium text-muted-foreground active:scale-[0.98] transition-transform"
        >
          Continuar sem sugerir
        </button>
      </div>
    </div>
  );
}
