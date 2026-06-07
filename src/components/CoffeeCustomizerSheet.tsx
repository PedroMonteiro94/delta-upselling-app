import { Coffee, Milk, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { GRAINS, MILK_ALTERNATIVES, MILK_EXTRAS, type GrainOption, type MilkOption, type MenuItem } from "@/data/menu";

interface Props {
  item: MenuItem | null;
  onConfirm: (grain: GrainOption, milk: MilkOption | null) => void;
  onDismiss: () => void;
}

export function CoffeeCustomizerSheet({ item, onConfirm, onDismiss }: Props) {
  const [selectedGrain, setSelectedGrain] = useState<GrainOption>(GRAINS[0]);
  const [selectedMilk, setSelectedMilk] = useState<MilkOption | null>(null);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      // Reset selections to defaults
      setSelectedGrain(GRAINS[0]);
      setSelectedMilk(null);
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [item]);

  if (!item) return null;

  // Verify if it is a coffee item
  const isCoffee = item.categoria === "Cafetaria" && 
    (item.subcategoria === "Café em Espresso" || item.subcategoria === "Café de Filtro" || item.subcategoria === "Campanhas");

  if (!isCoffee) return null;

  // Simple espresso drinks do not get milk modifiers (removal of redundant clicks)
  const isSimpleEspresso = [
    "espresso-our-blend", 
    "espresso-heritage", 
    "espresso-pure-arabica", 
    "espresso-single-origin"
  ].includes(item.id);

  const handleConfirm = () => {
    onConfirm(selectedGrain, isSimpleEspresso ? null : selectedMilk);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onDismiss}
    >
      <div
        className="w-full max-w-md bg-card text-card-foreground rounded-t-3xl p-6 pb-8 shadow-[var(--shadow-upsell)] animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <Coffee className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Personalizar Bebida
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3">
          <h2 className="font-display text-xl font-bold text-foreground">
            {item.nome}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{item.descricao}</p>
        </div>

        <div className="mt-6 space-y-6">
          {/* SECTION 1: GRAINS (11 Grains) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Coffee className="h-3.5 w-3.5 text-accent" />
              Seleção do Grão ({GRAINS.length} opções)
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
              {GRAINS.map((g) => {
                const isSelected = selectedGrain.id === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGrain(g)}
                    className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-[0_0_8px_rgba(var(--accent-rgb),0.15)]"
                        : "border-border bg-secondary/35 hover:bg-secondary/60"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-xs text-foreground">
                        {g.nome}
                      </span>
                      {g.adicional > 0 && (
                        <span className="text-[11px] font-bold text-accent">
                          +{g.adicional.toFixed(2)} €
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {g.descricao}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: MILK (Only for non-espresso/milk-based drinks) */}
          {!isSimpleEspresso && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Milk className="h-3.5 w-3.5 text-accent" />
                Opções de Leite
              </h3>

              {/* Milk Alternatives */}
              <div className="mt-3">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Alternativas Vegetais / Sem Lactose
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {MILK_ALTERNATIVES.map((m) => {
                    const isSelected = selectedMilk?.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMilk(selectedMilk?.id === m.id ? null : m)}
                        className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                          isSelected
                            ? "border-accent bg-accent/10 font-medium"
                            : "border-border bg-secondary/35"
                        }`}
                      >
                        <span className="text-[11px] text-foreground">{m.nome}</span>
                        {m.adicional > 0 && (
                          <span className="text-[10px] text-accent">
                            +{m.adicional.toFixed(2)}€
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Milk Extras / Side serving */}
              <div className="mt-4">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Extras e à Parte
                </h4>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {MILK_EXTRAS.map((m) => {
                    const isSelected = selectedMilk?.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMilk(selectedMilk?.id === m.id ? null : m)}
                        className={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                          isSelected
                            ? "border-accent bg-accent/10 font-medium"
                            : "border-border bg-secondary/35"
                        }`}
                      >
                        <span className="text-[11px] text-foreground">{m.nome}</span>
                        {m.adicional > 0 && (
                          <span className="text-[10px] text-accent">
                            +{m.adicional.toFixed(2)}€
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {isSimpleEspresso && (
            <div className="rounded-xl bg-secondary/40 p-3 text-[11px] text-muted-foreground text-center">
              Opções de leite desativadas para Espresso simples.
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground px-4 py-3 text-sm font-semibold active:scale-[0.98] transition-transform"
        >
          <Sparkles className="h-4 w-4" />
          Confirmar e Adicionar (+{(selectedGrain.adicional + (isSimpleEspresso ? 0 : (selectedMilk?.adicional ?? 0))).toFixed(2)} €)
        </button>
      </div>
    </div>
  );
}
