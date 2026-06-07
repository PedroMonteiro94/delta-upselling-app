import { useEffect, useState, useMemo } from "react";
import { Flame, Snowflake, AlertTriangle, Clock, RefreshCw, CheckSquare, Sparkles, Shield, WashingMachine, Utensils } from "lucide-react";
import { useOrders, type CopaTask, type ProducaoTask } from "@/lib/orders";
import { useGoals } from "@/lib/goals";
import { toast } from "sonner";

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

export function KitchenMonitor() {
  const { 
    orders, 
    hotQueueAvgMs, 
    hotContingency, 
    copaTasks, 
    producaoTasks, 
    completeCopaTask, 
    completeProducaoTask,
    advanceLine
  } = useOrders();
  
  const { users, assignPosto, isLeader } = useGoals();
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Kitchen pending order lines (non-beverage)
  const pendingLines = useMemo(() => {
    return orders
      .filter((o) => !o.closedAt)
      .flatMap((o) =>
        o.lines
          .filter((l) => l.status === "registado" && l.praca !== "bebida")
          .map((l) => ({ ...l, mesa: o.mesa, orderId: o.id }))
      );
  }, [orders]);

  const quentes = useMemo(() => pendingLines.filter((l) => l.praca === "quente"), [pendingLines]);
  const frias = useMemo(() => pendingLines.filter((l) => l.praca === "fria"), [pendingLines]);
  const producaoLines = useMemo(() => pendingLines.filter((l) => l.praca === "producao"), [pendingLines]);

  const activeCopa = useMemo(() => copaTasks.filter((t) => t.status === "registado"), [copaTasks]);
  const activeProducaoTasks = useMemo(() => producaoTasks.filter((t) => t.status === "registado"), [producaoTasks]);

  // SLAs (seconds)
  const SLA_QUENTE = 600; // 10m
  const SLA_FRIA = 360;   // 6m
  const SLA_COPA = 300;   // 5m
  const SLA_PROD = 900;   // 15m

  // Kitchen Staff assignments
  const kitchenStaff = useMemo(() => {
    const positions = {
      quentes: users.filter((u) => u.postoId === "cozinha-quentes" && !u.archived),
      frios: users.filter((u) => u.postoId === "cozinha-frios" && !u.archived),
      producao: users.filter((u) => u.postoId === "cozinha-producao" && !u.archived),
      copa: users.filter((u) => u.postoId === "cozinha-copa" && !u.archived),
    };
    return positions;
  }, [users]);

  // Rotate kitchen staff (Quentes -> Frios -> Produção -> Copa -> Quentes)
  const handleRotation = () => {
    if (!isLeader) return;
    
    // Find all users who are currently assigned to any kitchen post
    const kitchenUsers = users.filter(
      (u) => ["cozinha-quentes", "cozinha-frios", "cozinha-producao", "cozinha-copa"].includes(u.postoId || "") && !u.archived
    );

    if (kitchenUsers.length === 0) {
      toast.error("Nenhum colaborador alocado aos postos da cozinha para rodar.");
      return;
    }

    const nextPostMap: Record<string, string> = {
      "cozinha-quentes": "cozinha-frios",
      "cozinha-frios": "cozinha-producao",
      "cozinha-producao": "cozinha-copa",
      "cozinha-copa": "cozinha-quentes",
    };

    kitchenUsers.forEach((u) => {
      const nextPost = nextPostMap[u.postoId || ""];
      if (nextPost) {
        assignPosto(u.name, nextPost);
      }
    });

    toast.success("🔄 Rotação pós-pausa realizada com sucesso na cozinha!");
  };

  // Priority Funnel logic: sorts active tasks by urgency and groups duplicate items
  const priorityFunnel = useMemo(() => {
    const items: {
      type: "order" | "copa" | "producao";
      id: string;
      title: string;
      registadoAt: number;
      sla: number;
      mesa?: number;
      qty: number;
      itemId?: string;
      orderId?: string;
    }[] = [];

    // Add order lines
    pendingLines.forEach((l) => {
      let sla = SLA_FRIA;
      if (l.praca === "quente") sla = SLA_QUENTE;
      else if (l.praca === "producao") sla = SLA_PROD;
      
      items.push({
        type: "order",
        id: l.id,
        title: l.nome,
        registadoAt: l.registadoAt,
        sla,
        mesa: l.mesa,
        qty: l.qty,
        itemId: l.itemId,
        orderId: l.orderId,
      });
    });

    // Add Copa tasks
    activeCopa.forEach((t) => {
      items.push({
        type: "copa",
        id: t.id,
        title: t.desc,
        registadoAt: t.registadoAt,
        sla: SLA_COPA,
        qty: 1,
      });
    });

    // Add Produção tasks
    activeProducaoTasks.forEach((t) => {
      items.push({
        type: "producao",
        id: t.id,
        title: t.desc,
        registadoAt: t.registadoAt,
        sla: SLA_PROD,
        qty: 1,
      });
    });

    // Sort by elapsed time exceeding SLA (highest percentage of SLA exceeded first)
    // and then by oldest registration
    const sorted = [...items].sort((a, b) => {
      const elapsedA = Date.now() - a.registadoAt;
      const elapsedB = Date.now() - b.registadoAt;
      const ratioA = elapsedA / (a.sla * 1000);
      const ratioB = elapsedB / (b.sla * 1000);
      
      const overA = ratioA > 1;
      const overB = ratioB > 1;

      if (overA && !overB) return -1;
      if (!overA && overB) return 1;
      return elapsedB - elapsedA; // older first
    });

    // Grouping identical items to optimize preparation volume
    const grouped: Record<string, { title: string; totalQty: number; ids: string[] }> = {};
    pendingLines.forEach((l) => {
      if (grouped[l.itemId]) {
        grouped[l.itemId].totalQty += l.qty;
        grouped[l.itemId].ids.push(l.id);
      } else {
        grouped[l.itemId] = {
          title: l.nome,
          totalQty: l.qty,
          ids: [l.id],
        };
      }
    });

    return { sorted, grouped: Object.values(grouped) };
  }, [pendingLines, activeCopa, activeProducaoTasks]);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl flex items-center gap-2">
            <Utensils className="h-6 w-6 text-accent" />
            Ecrã da Cozinha (KDS)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            4 postos de trabalho ativos · Fluxo de preparação integrado
          </p>
        </div>
        {isLeader && (
          <button
            onClick={handleRotation}
            className="flex items-center gap-1.5 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-accent active:scale-[0.97] transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Rotação Pós-Pausa
          </button>
        )}
      </div>

      {hotContingency && (
        <div className="flex items-start gap-2 rounded-2xl border-2 border-warning bg-warning/10 p-3 text-warning-foreground"
             style={{ borderColor: "oklch(0.78 0.16 80)", background: "oklch(0.96 0.08 80)" }}>
          <AlertTriangle className="h-5 w-5 mt-0.5 text-[oklch(0.55_0.16_60)] shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-[oklch(0.30_0.12_60)]">
              Espera elevada para Ovos/Panquecas ({fmt(hotQueueAvgMs)})
            </p>
            <p className="text-[oklch(0.40_0.10_60)]">
              Sugira saladas, iogurtes ou focaccias na sala para aliviar a chapa.
            </p>
          </div>
        </div>
      )}

      {/* DASHBOARD: Kitchen Staff Posts */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-accent" />
          Postos da Cozinha & Alocação
        </h3>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
          <div className="rounded-xl bg-secondary/35 p-2">
            <p className="font-semibold text-foreground text-[10px] uppercase">🔥 Quentes</p>
            <p className="mt-1 font-medium text-muted-foreground truncate">
              {kitchenStaff.quentes.map(u => u.name).join(", ") || "—"}
            </p>
          </div>
          <div className="rounded-xl bg-secondary/35 p-2">
            <p className="font-semibold text-foreground text-[10px] uppercase">❄️ Frios</p>
            <p className="mt-1 font-medium text-muted-foreground truncate">
              {kitchenStaff.frios.map(u => u.name).join(", ") || "—"}
            </p>
          </div>
          <div className="rounded-xl bg-secondary/35 p-2">
            <p className="font-semibold text-foreground text-[10px] uppercase">🥗 Produção</p>
            <p className="mt-1 font-medium text-muted-foreground truncate">
              {kitchenStaff.producao.map(u => u.name).join(", ") || "—"}
            </p>
          </div>
          <div className="rounded-xl bg-secondary/35 p-2">
            <p className="font-semibold text-foreground text-[10px] uppercase">🧼 Copa</p>
            <p className="mt-1 font-medium text-muted-foreground truncate">
              {kitchenStaff.copa.map(u => u.name).join(", ") || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* PRIORITY FUNNEL */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Funil de Prioridades & Consolidado
        </h3>
        
        {priorityFunnel.sorted.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground mt-3 italic py-2">
            Cozinha vazia de pedidos pendentes. Bom trabalho!
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {/* Consolidated metrics */}
            {priorityFunnel.grouped.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Volume Consolidado (Lotes de preparação):
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {priorityFunnel.grouped.map((g) => (
                    <span
                      key={g.title}
                      className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent"
                    >
                      <span className="font-bold">{g.totalQty}×</span> {g.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sorted priority list */}
            <div>
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">
                Fila Crítica (Urgência Decrescente):
              </p>
              <div className="mt-1.5 space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {priorityFunnel.sorted.map((item) => {
                  const elapsed = Date.now() - item.registadoAt;
                  const isOver = elapsed > item.sla * 1000;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs border ${
                        isOver
                          ? "border-destructive bg-destructive/15 text-destructive-foreground"
                          : "border-border bg-secondary/25"
                      }`}
                    >
                      <span className="truncate max-w-[240px]">
                        {item.type === "order" && <span className="font-semibold text-accent mr-1">Mesa {item.mesa}</span>}
                        {item.qty > 1 ? `${item.qty}× ` : ""}{item.title}
                      </span>
                      <span className={`font-mono text-[10px] flex items-center gap-1 font-semibold ${isOver ? "text-destructive" : "text-muted-foreground"}`}>
                        <Clock className="h-3 w-3" />
                        {fmt(elapsed)} {isOver && "⚠️ SLA!"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* THE 4 KITCHEN STATIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STATION 1: QUENTES */}
        <PracaBlock 
          title="🔥 Praça Quente / Chapa" 
          color="oklch(0.55 0.18 25)" 
          items={quentes.map(l => ({ id: l.id, nome: l.nome, qty: l.qty, mesa: l.mesa, registadoAt: l.registadoAt, orderId: l.orderId }))} 
          sla={SLA_QUENTE} 
          onComplete={(id, oId) => advanceLine(oId!, id)}
        />

        {/* STATION 2: FRIOS */}
        <PracaBlock 
          title="❄️ Praça Fria / Montagem" 
          color="oklch(0.55 0.13 220)" 
          items={frias.map(l => ({ id: l.id, nome: l.nome, qty: l.qty, mesa: l.mesa, registadoAt: l.registadoAt, orderId: l.orderId }))} 
          sla={SLA_FRIA} 
          onComplete={(id, oId) => advanceLine(oId!, id)}
        />

        {/* STATION 3: PRODUÇÃO */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-display text-base flex items-center gap-1.5" style={{ color: "oklch(0.65 0.14 130)" }}>
              <Utensils className="h-4 w-4" />
              🥗 Produção / Empratamento
            </h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {producaoLines.length + activeProducaoTasks.length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {/* Active order lines in Produção */}
            {producaoLines.map((l) => {
              const elapsed = Date.now() - l.registadoAt;
              const over = elapsed > SLA_PROD * 1000;
              return (
                <div key={l.id} className="flex items-center justify-between rounded-xl bg-secondary/35 p-2.5 border-l-4" style={{ borderLeftColor: "oklch(0.65 0.14 130)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{l.qty}× {l.nome}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Mesa {l.mesa} · Pedido</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] ${over ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                      {fmt(elapsed)}
                    </span>
                    <button
                      onClick={() => advanceLine(l.orderId, l.id)}
                      className="rounded bg-success px-2 py-1 text-[9px] font-semibold uppercase text-success-foreground"
                    >
                      Feito
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Active prep tasks in Produção */}
            {activeProducaoTasks.map((t) => {
              const elapsed = Date.now() - t.registadoAt;
              const over = elapsed > SLA_PROD * 1000;
              return (
                <div key={t.id} className="flex items-center justify-between rounded-xl bg-secondary/20 p-2.5 border-l-4 border-dashed border-l-muted-foreground">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{t.desc}</p>
                    <p className="text-[9px] text-muted-foreground uppercase">Tarefa Interna</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{fmt(elapsed)}</span>
                    <button
                      onClick={() => {
                        completeProducaoTask(t.id);
                        toast.success("Tarefa de Produção completada");
                      }}
                      className="rounded bg-success/80 px-2 py-1 text-[9px] font-semibold uppercase text-success-foreground"
                    >
                      Ok
                    </button>
                  </div>
                </div>
              );
            })}

            {producaoLines.length === 0 && activeProducaoTasks.length === 0 && (
              <p className="text-center text-[11px] text-muted-foreground py-4 italic">Sem tarefas pendentes.</p>
            )}
          </div>
        </div>

        {/* STATION 4: COPA */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-display text-base flex items-center gap-1.5" style={{ color: "oklch(0.60 0.12 170)" }}>
              <WashingMachine className="h-4 w-4" />
              🧼 Copa / Lavagem
            </h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {activeCopa.length}
            </span>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {activeCopa.map((t) => {
              const elapsed = Date.now() - t.registadoAt;
              const over = elapsed > SLA_COPA * 1000;
              return (
                <div key={t.id} className="flex items-center justify-between rounded-xl bg-secondary/35 p-2.5 border-l-4" style={{ borderLeftColor: over ? "oklch(0.55 0.18 25)" : "oklch(0.60 0.12 170)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{t.desc}</p>
                    <p className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                      SLA: 5m ·
                      <span className={over ? "text-destructive font-bold" : "text-muted-foreground"}>
                        {fmt(elapsed)}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      completeCopaTask(t.id);
                      toast.success("Loiça lavada e reposta!");
                    }}
                    className="rounded bg-success px-2 py-1.5 text-[9px] font-bold uppercase text-success-foreground shrink-0"
                  >
                    Lavar
                  </button>
                </div>
              );
            })}

            {activeCopa.length === 0 && (
              <p className="text-center text-[11px] text-muted-foreground py-4 italic">Copa limpa, sem loiça pendente.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PracaBlock({
  title, color, items, sla, onComplete
}: {
  title: string;
  color: string;
  items: { id: string; nome: string; qty: number; mesa: number; registadoAt: number; orderId?: string }[];
  sla: number;
  onComplete: (id: string, orderId?: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h3 className="font-display text-base flex items-center gap-1.5" style={{ color }}>
          <Flame className="h-4 w-4" />
          {title}
        </h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
          {items.length}
        </span>
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        {items.map((l) => {
          const elapsed = Date.now() - l.registadoAt;
          const over = elapsed > sla * 1000;
          return (
            <div
              key={l.id}
              className="flex items-center justify-between rounded-xl bg-secondary/35 p-2.5 border-l-4"
              style={{ borderLeftColor: over ? "oklch(0.55 0.18 25)" : color }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate">
                  {l.qty}× {l.nome}
                </p>
                <p className="text-[9px] text-muted-foreground uppercase">
                  Mesa {l.mesa}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[10px] ${over ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                  {fmt(elapsed)}
                </span>
                <button
                  onClick={() => onComplete(l.id, l.orderId)}
                  className="rounded bg-success px-2 py-1 text-[9px] font-semibold uppercase text-success-foreground"
                >
                  Feito
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="text-center text-[11px] text-muted-foreground py-4 italic">Sem pedidos pendentes.</p>
        )}
      </div>
    </div>
  );
}
