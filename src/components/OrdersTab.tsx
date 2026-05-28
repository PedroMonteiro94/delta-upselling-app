import { ClipboardList, UtensilsCrossed, CreditCard, Check, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useOrders, type LineStatus, type OpenOrder } from "@/lib/orders";
import { useGoals, isGoalItem } from "@/lib/goals";

const META: Record<LineStatus, { label: string; Icon: typeof ClipboardList; color: string; next?: LineStatus; nextLabel?: string }> = {
  registado: { label: "Registado", Icon: ClipboardList, color: "var(--muted-foreground)", next: "entregue", nextLabel: "Entregar" },
  entregue:  { label: "Entregue",  Icon: UtensilsCrossed, color: "var(--accent)", next: "pago", nextLabel: "Confirmar Pagamento" },
  pago:      { label: "Pago",      Icon: CreditCard, color: "var(--success)" },
};

export function OrdersTab({ onOpenTables }: { onOpenTables: () => void }) {
  const { orders, activeOrderId, setActiveOrderId, advanceLine, closeOrder, removeOrder } = useOrders();
  const { registerPaidGoalItems } = useGoals();

  const open = orders.filter((o) => !o.closedAt);
  const active = open.find((o) => o.id === activeOrderId) ?? open[0] ?? null;

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Pedidos abertos</h2>
        <button
          onClick={onOpenTables}
          className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground active:scale-[0.97]"
        >
          + Nova mesa
        </button>
      </div>

      {open.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Sem comandas abertas. Toque em "+ Nova mesa".</p>
        </div>
      ) : (
        <>
          <div className="mt-4 -mx-5 overflow-x-auto px-5 pb-2 scrollbar-none">
            <div className="flex gap-2">
              {open.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setActiveOrderId(o.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    active?.id === o.id ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  Mesa {o.mesa} · {o.lines.length}
                </button>
              ))}
            </div>
          </div>

          {active && (
            <OrderDetail
              order={active}
              onAdvance={(lineId) => {
                const r = advanceLine(active.id, lineId);
                if (!r) return;
                if (r.nextStatus === "pago") {
                  toast.success(`${r.line.nome} · pagamento confirmado`);
                  if (isGoalItem(r.line.itemId, r.line.nome)) {
                    registerPaidGoalItems(
                      [{
                        itemId: r.line.itemId,
                        itemName: r.line.nome,
                        price: r.line.preco,
                        isUpsell: r.line.isUpsell,
                        qty: r.line.qty,
                      }],
                      r.line.ownerUser
                    );
                  }
                } else if (r.nextStatus === "entregue") {
                  toast(`${r.line.nome} entregue`);
                }
              }}
              onClose={() => { closeOrder(active.id); toast.success(`Mesa ${active.mesa} fechada`); }}
              onRemove={() => { removeOrder(active.id); toast(`Mesa ${active.mesa} removida`); }}
            />
          )}
        </>
      )}
    </section>
  );
}

function OrderDetail({
  order, onAdvance, onClose, onRemove,
}: {
  order: OpenOrder;
  onAdvance: (lineId: string) => void;
  onClose: () => void;
  onRemove: () => void;
}) {
  const total = order.lines.reduce((s, l) => s + l.preco * l.qty, 0);
  const paid = order.lines.filter((l) => l.status === "pago").reduce((s, l) => s + l.preco * l.qty, 0);
  const allPago = order.lines.length > 0 && order.lines.every((l) => l.status === "pago");

  return (
    <>
      <p className="mt-3 text-xs text-muted-foreground">
        {order.lines.length} itens · Pago{" "}
        <span className="text-success font-semibold">{paid.toFixed(2)} €</span> de {total.toFixed(2)} €
      </p>

      <ul className="mt-4 space-y-3">
        {order.lines.map((l) => {
          const meta = META[l.status];
          const Icon = meta.Icon;
          const goal = isGoalItem(l.itemId, l.nome);
          return (
            <li key={l.id} className="rounded-2xl border border-border bg-card p-4" style={{ borderLeft: `4px solid ${meta.color}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{l.nome}</p>
                    {goal && (
                      <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                        Foco
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {l.qty} × {l.preco.toFixed(2)} €
                    {l.isUpsell && " · upsell"} · {l.praca}
                  </p>
                </div>
                <p className="font-semibold">{(l.qty * l.preco).toFixed(2)} €</p>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                {(["registado", "entregue", "pago"] as LineStatus[]).map((s, idx) => {
                  const reached = ["registado", "entregue", "pago"].indexOf(l.status) >= idx;
                  const SIcon = META[s].Icon;
                  return (
                    <div key={s} className="flex flex-1 items-center gap-1.5">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          reached ? "text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                        style={reached ? { backgroundColor: META[s].color } : undefined}
                      >
                        {reached && s === l.status ? <SIcon className="h-3.5 w-3.5" /> : reached ? <Check className="h-3.5 w-3.5" /> : <SIcon className="h-3.5 w-3.5" />}
                      </div>
                      {idx < 2 && (
                        <div className="h-0.5 flex-1 rounded-full"
                          style={{
                            background:
                              ["registado", "entregue", "pago"].indexOf(l.status) > idx ? META[s].color : "var(--muted)",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {meta.next && (
                <button
                  onClick={() => onAdvance(l.id)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
                  style={{ background: meta.next === "pago" ? "var(--success)" : "var(--primary)" }}
                >
                  <Icon className="h-4 w-4" />
                  {meta.nextLabel}
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-primary p-5 text-primary-foreground">
        <span className="font-display text-lg">Total Mesa {order.mesa}</span>
        <span className="font-display text-2xl text-accent">{total.toFixed(2)} €</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onClose}
          disabled={!allPago}
          className="flex items-center justify-center gap-2 rounded-2xl bg-success px-4 py-3 text-sm font-semibold text-success-foreground active:scale-[0.99] disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> Fechar comanda
        </button>
        <button
          onClick={onRemove}
          className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground active:scale-[0.99]"
        >
          <Trash2 className="h-4 w-4" /> Anular
        </button>
      </div>
    </>
  );
}
