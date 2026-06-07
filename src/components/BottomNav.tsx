import { Coffee, ShoppingBag, Sparkles, Flame, Users, BarChart3, GlassWater, Wrench, Lock } from "lucide-react";
import { toast } from "sonner";

export type Tab = "menu" | "order" | "kitchen" | "staff" | "metrics" | "tips" | "bar" | "maintenance";

export function BottomNav({
  active,
  onChange,
  orderCount,
  isLeader,
  isGerente,
  hotAlert,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  orderCount: number;
  isLeader: boolean;
  isGerente: boolean;
  hotAlert?: boolean;
}) {
  const items: { 
    id: Tab; 
    label: string; 
    Icon: typeof Coffee; 
    gated?: boolean; 
    gerenteOnly?: boolean;
    badge?: boolean 
  }[] = [
    { id: "menu", label: "Menu", Icon: Coffee },
    { id: "bar", label: "Bar", Icon: GlassWater },
    { id: "order", label: "Pedidos", Icon: ShoppingBag },
    { id: "kitchen", label: "Cozinha", Icon: Flame, badge: hotAlert },
    { id: "staff", label: "Staff", Icon: Users, gated: true },
    { id: "metrics", label: "Métricas", Icon: BarChart3 },
    { id: "tips", label: "Prémios", Icon: Sparkles },
    { id: "maintenance", label: "Manutenção", Icon: Wrench, gerenteOnly: true },
  ];

  const handleTabClick = (id: Tab, gerenteOnly?: boolean, gated?: boolean) => {
    if (gerenteOnly && !isGerente) {
      toast.error("🔒 Acesso bloqueado · Menu Manutenção exclusivo para a Gerência.");
      return;
    }
    if (gated && !isLeader) {
      toast.error("🔒 Acesso restrito · Apenas para Responsáveis ou Gerentes.");
      return;
    }
    onChange(id);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 overflow-x-auto scrollbar-none">
        {items.map(({ id, label, Icon, gated, gerenteOnly, badge }) => {
          const isActive = active === id;
          const locked = (gerenteOnly && !isGerente) || (gated && !isLeader);
          
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id, gerenteOnly, gated)}
              className="relative flex flex-1 min-w-[56px] flex-col items-center gap-1 rounded-xl px-1.5 py-2 transition-colors active:scale-95"
            >
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {locked && (
                  <Lock className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-destructive bg-card rounded-full p-0.5 border border-border" />
                )}
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
                className={`text-[9px] font-medium leading-none text-center ${
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground"
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
