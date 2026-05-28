import { useEffect, useState } from "react";
import { Flame, Snowflake, AlertTriangle, Clock } from "lucide-react";
import { useOrders } from "@/lib/orders";

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

export function KitchenMonitor() {
  const { orders, hotQueueAvgMs, hotContingency } = useOrders();
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const pending = orders
    .filter((o) => !o.closedAt)
    .flatMap((o) =>
      o.lines
        .filter((l) => l.status === "registado" && l.praca !== "bebida")
        .map((l) => ({ ...l, mesa: o.mesa }))
    );

  const quentes = pending.filter((l) => l.praca === "quente");
  const frias = pending.filter((l) => l.praca === "fria");

  return (
    <section>
      <h2 className="font-display text-2xl">Monitor da Cozinha</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Pedidos por preparar agrupados por praça. SLA quente &lt; 10m · fria &lt; 6m.
      </p>

      {hotContingency && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border-2 border-warning bg-warning/10 p-3 text-warning-foreground"
             style={{ borderColor: "oklch(0.78 0.16 80)", background: "oklch(0.96 0.08 80)" }}>
          <AlertTriangle className="h-5 w-5 mt-0.5 text-[oklch(0.55_0.16_60)] shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[oklch(0.30_0.12_60)]">
              Espera elevada para Ovos/Panquecas ({fmt(hotQueueAvgMs)})
            </p>
            <p className="text-[oklch(0.40_0.10_60)]">
              Foco em vender Focaccias ou Iogurtes na sala.
            </p>
          </div>
        </div>
      )}

      <PracaBlock title="Praça Quente / Chapa" Icon={Flame} color="oklch(0.55 0.18 25)" items={quentes} sla={600} />
      <PracaBlock title="Praça Fria / Montagem" Icon={Snowflake} color="oklch(0.55 0.13 220)" items={frias} sla={360} />
    </section>
  );
}

function PracaBlock({
  title, Icon, color, items, sla,
}: {
  title: string;
  Icon: typeof Flame;
  color: string;
  items: { id: string; nome: string; qty: number; mesa: number; registadoAt: number }[];
  sla: number; // seconds
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 text-foreground">
        <Icon className="h-4 w-4" style={{ color }} />
        <h3 className="font-display text-lg">{title}</h3>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="mt-2 rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
          Sem pedidos pendentes.
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {items.map((l) => {
            const elapsed = Date.now() - l.registadoAt;
            const over = elapsed > sla * 1000;
            return (
              <li
                key={l.id}
                className="flex items-center justify-between rounded-2xl border bg-card p-3"
                style={{ borderLeft: `4px solid ${over ? "oklch(0.55 0.18 25)" : color}` }}
              >
                <div>
                  <p className="text-sm font-semibold">
                    {l.qty}× {l.nome}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Mesa {l.mesa}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-mono ${over ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                  <Clock className="h-3 w-3" />
                  {fmt(elapsed)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
