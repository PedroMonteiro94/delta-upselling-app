import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MenuItem } from "@/data/menu";
import { pracaOf, type Praca } from "@/lib/classify";

const KEY = "delta_orders_v1";

export type LineStatus = "registado" | "entregue" | "pago";

export interface OrderLine {
  id: string;
  itemId: string;
  nome: string;
  preco: number;
  qty: number;
  isUpsell: boolean;
  praca: Praca;
  status: LineStatus;
  registadoAt: number;
  entregueAt?: number;
  pagoAt?: number;
  ownerUser?: string; // colaborador que registou (para crédito de objetivos)
}

export interface OpenOrder {
  id: string;
  mesa: number;
  createdAt: number;
  closedAt?: number;
  lines: OrderLine[];
}

interface OrdersContext {
  orders: OpenOrder[];
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  activeOrder: OpenOrder | null;
  openOrder: (mesa: number) => string;
  addLine: (
    orderId: string,
    item: MenuItem | { id: string; nome: string; preco: number; subcategoria: any; categoria: any },
    opts?: { isUpsell?: boolean; ownerUser?: string }
  ) => void;
  advanceLine: (
    orderId: string,
    lineId: string
  ) => { line: OrderLine; nextStatus: LineStatus } | null;
  swapLineItem: (
    orderId: string,
    lineId: string,
    item: { id: string; nome: string; preco: number; subcategoria: any; categoria: any }
  ) => void;

  closeOrder: (orderId: string) => void;
  removeOrder: (orderId: string) => void;
  hotQueueAvgMs: number;
  hotContingency: boolean;
}

const Ctx = createContext<OrdersContext | null>(null);

function read(): OpenOrder[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OpenOrder[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => setOrders(read()), []);

  const persist = useCallback((list: OpenOrder[]) => {
    setOrders(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  }, []);

  const openOrder = useCallback(
    (mesa: number) => {
      const existing = orders.find((o) => o.mesa === mesa && !o.closedAt);
      if (existing) {
        setActiveOrderId(existing.id);
        return existing.id;
      }
      const id = `o-${Date.now()}-${mesa}`;
      const next: OpenOrder = { id, mesa, createdAt: Date.now(), lines: [] };
      persist([...orders, next]);
      setActiveOrderId(id);
      return id;
    },
    [orders, persist]
  );

  const addLine = useCallback<OrdersContext["addLine"]>(
    (orderId, item, opts) => {
      const isUpsell = !!opts?.isUpsell;
      const praca = pracaOf(item as any);
      const next = orders.map((o) => {
        if (o.id !== orderId) return o;
        const existing = o.lines.find(
          (l) => l.itemId === item.id && l.status === "registado" && l.isUpsell === isUpsell
        );
        if (existing) {
          return {
            ...o,
            lines: o.lines.map((l) =>
              l.id === existing.id ? { ...l, qty: l.qty + 1 } : l
            ),
          };
        }
        const line: OrderLine = {
          id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          itemId: item.id,
          nome: item.nome,
          preco: item.preco,
          qty: 1,
          isUpsell,
          praca,
          status: "registado",
          registadoAt: Date.now(),
          ownerUser: opts?.ownerUser,
        };
        return { ...o, lines: [...o.lines, line] };
      });
      persist(next);
    },
    [orders, persist]
  );

  const advanceLine = useCallback<OrdersContext["advanceLine"]>(
    (orderId, lineId) => {
      let result: { line: OrderLine; nextStatus: LineStatus } | null = null;
      const next = orders.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          lines: o.lines.map((l) => {
            if (l.id !== lineId) return l;
            const nextStatus: LineStatus | null =
              l.status === "registado" ? "entregue" : l.status === "entregue" ? "pago" : null;
            if (!nextStatus) return l;
            const updated: OrderLine = {
              ...l,
              status: nextStatus,
              entregueAt: nextStatus === "entregue" ? Date.now() : l.entregueAt,
              pagoAt: nextStatus === "pago" ? Date.now() : l.pagoAt,
            };
            result = { line: updated, nextStatus };
            return updated;
          }),
        };
      });
      persist(next);
      return result;
    },
    [orders, persist]
  );

  const swapLineItem = useCallback<OrdersContext["swapLineItem"]>(
    (orderId, lineId, item) => {
      const praca = pracaOf(item as any);
      const next = orders.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          lines: o.lines.map((l) =>
            l.id === lineId
              ? { ...l, itemId: item.id, nome: item.nome, preco: item.preco, praca }
              : l
          ),
        };
      });
      persist(next);
    },
    [orders, persist]
  );

  const closeOrder = useCallback(
    (orderId: string) => {
      persist(orders.map((o) => (o.id === orderId ? { ...o, closedAt: Date.now() } : o)));
      if (activeOrderId === orderId) setActiveOrderId(null);
    },
    [orders, persist, activeOrderId]
  );

  const removeOrder = useCallback(
    (orderId: string) => {
      persist(orders.filter((o) => o.id !== orderId));
      if (activeOrderId === orderId) setActiveOrderId(null);
    },
    [orders, persist, activeOrderId]
  );

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeOrderId) ?? null,
    [orders, activeOrderId]
  );

  // Contingência praça quente
  const { hotQueueAvgMs, hotContingency } = useMemo(() => {
    const pending = orders
      .filter((o) => !o.closedAt)
      .flatMap((o) => o.lines)
      .filter((l) => l.praca === "quente" && l.status === "registado");
    if (!pending.length) return { hotQueueAvgMs: 0, hotContingency: false };
    const now = Date.now();
    const avg = pending.reduce((s, l) => s + (now - l.registadoAt), 0) / pending.length;
    return { hotQueueAvgMs: avg, hotContingency: avg > 10 * 60 * 1000 };
  }, [orders]);

  const value: OrdersContext = {
    orders,
    activeOrderId,
    setActiveOrderId,
    activeOrder,
    openOrder,
    addLine,
    advanceLine,
    swapLineItem,

    closeOrder,
    removeOrder,
    hotQueueAvgMs,
    hotContingency,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrders() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrders must be inside OrdersProvider");
  return c;
}
