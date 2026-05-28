import { Coffee, ShoppingBag, Sparkles, Flame, Users, BarChart3 } from "lucide-react";

export type Tab = "menu" | "order" | "kitchen" | "staff" | "metrics" | "tips";

export function BottomNav({
  active,
  onChange,
  orderCount,
  isLeader,
  hotAlert,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  orderCount: number;
  isLeader: boolean;
  hotAlert?: boolean;
}) {
  const items: { id: Tab; label: string; Icon: typeof Coffee; gated?: boolean; badge?: boolean }[] = [
    { id: "menu", label: "Menu", Icon: Coffee },
    { id: "order", label: "Pedidos", Icon: ShoppingBag },
    { id: "kitchen", label: "Cozinha", Icon: Flame, badge: hotAlert },
    { id: "staff", label: "Staff", Icon: Users, gated: true },
    { id: "metrics", label: "Métricas", Icon: BarChart3 },
    { id: "tips", label: "Prémios", Icon: Sparkles },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {items.map(({ id, label, Icon, gated, badge }) => {
          if (gated && !isLeader) return null;
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors"
            >
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {id === "order" && orderCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                    {orderCount}
                  </span>
                )}
                {id === "kitchen" && badge && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
