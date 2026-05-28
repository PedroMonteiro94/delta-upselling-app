import { ChevronRight } from "lucide-react";
import type { MenuItem } from "@/data/menu";

export function MenuItemCard({
  item,
  accentVar,
  onTap,
}: {
  item: MenuItem;
  accentVar: string;
  onTap: () => void;
}) {
  return (
    <button
      onClick={onTap}
      className="group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.99] transition-transform"
    >
      <span
        className="absolute left-0 top-0 h-full w-1"
        style={{ backgroundColor: `var(--${accentVar})` }}
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold leading-tight text-foreground">
            {item.nome}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {item.descricao}
          </p>
          <p className="mt-2 text-sm font-bold text-foreground">
            {item.preco.toFixed(2)} €
          </p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground group-active:translate-x-0.5 transition-transform" />
      </div>
    </button>
  );
}
