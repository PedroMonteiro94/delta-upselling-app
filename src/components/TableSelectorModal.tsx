import { useState } from "react";
import { X, MapPin, Users } from "lucide-react";
import { ZONES, SEAT_CAPACITY } from "@/lib/tables";
import { useOrders } from "@/lib/orders";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function TableSelectorModal({ open, onClose }: Props) {
  const { orders, openOrder, setActiveOrderId, activeOrderId } = useOrders();
  const [zone, setZone] = useState(ZONES[0].id);
  if (!open) return null;
  const z = ZONES.find((x) => x.id === zone)!;
  const openByMesa = new Map<number, string>();
  orders.filter((o) => !o.closedAt).forEach((o) => openByMesa.set(o.mesa, o.id));

  const pick = (mesa: number) => {
    openOrder(mesa);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 pb-8 shadow-[var(--shadow-upsell)] max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <MapPin className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Selecionar Mesa
            </span>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Users className="h-3 w-3" /> Capacidade total: {SEAT_CAPACITY} lugares
        </p>

        <div className="mt-4 flex gap-2">
          {ZONES.map((zz) => (
            <button
              key={zz.id}
              onClick={() => setZone(zz.id)}
              className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                zone === zz.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {zz.label}
              <span className="ml-1 text-[10px] opacity-70">({zz.tables.length})</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {z.tables.map((t) => {
            const isOpen = openByMesa.has(t);
            const isActive = openByMesa.get(t) === activeOrderId;
            return (
              <button
                key={t}
                onClick={() => pick(t)}
                className={`aspect-square rounded-2xl border-2 font-display text-xl font-semibold transition-all active:scale-[0.96] ${
                  isActive
                    ? "border-accent bg-accent text-accent-foreground"
                    : isOpen
                    ? "border-success bg-success/10 text-success"
                    : "border-border bg-card text-foreground hover:border-primary"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        {orders.filter((o) => !o.closedAt).length > 0 && (
          <>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground">
              Comandas abertas ({orders.filter((o) => !o.closedAt).length})
            </p>
            <ul className="mt-2 space-y-2">
              {orders
                .filter((o) => !o.closedAt)
                .map((o) => (
                  <li key={o.id}>
                    <button
                      onClick={() => {
                        setActiveOrderId(o.id);
                        onClose();
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm ${
                        o.id === activeOrderId ? "bg-accent/10 border-accent" : "bg-card"
                      }`}
                    >
                      <span className="font-semibold">Mesa {o.mesa}</span>
                      <span className="text-xs text-muted-foreground">
                        {o.lines.length} itens
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
