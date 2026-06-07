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
const COPA_KEY = "delta_copa_tasks_v1";
const PRODUCAO_KEY = "delta_producao_tasks_v1";

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

export interface CopaTask {
  id: string;
  desc: string;
  status: "registado" | "completo";
  registadoAt: number;
}

export interface ProducaoTask {
  id: string;
  desc: string;
  status: "registado" | "completo";
  registadoAt: number;
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
  copaTasks: CopaTask[];
  producaoTasks: ProducaoTask[];
  completeCopaTask: (id: string) => void;
  completeProducaoTask: (id: string) => void;
  addCopaTask: (desc: string) => void;
  addProducaoTask: (desc: string) => void;
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
  const [copaTasks, setCopaTasks] = useState<CopaTask[]>([]);
  const [producaoTasks, setProducaoTasks] = useState<ProducaoTask[]>([]);

  const persist = useCallback((list: OpenOrder[]) => {
    setOrders(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  }, []);

  const persistCopa = useCallback((list: CopaTask[]) => {
    setCopaTasks(list);
    localStorage.setItem(COPA_KEY, JSON.stringify(list));
  }, []);

  const persistProducao = useCallback((list: ProducaoTask[]) => {
    setProducaoTasks(list);
    localStorage.setItem(PRODUCAO_KEY, JSON.stringify(list));
  }, []);

  useEffect(() => {
    setOrders(read());

    // Load Copa tasks
    const cachedCopa = localStorage.getItem(COPA_KEY);
    if (cachedCopa) {
      setCopaTasks(JSON.parse(cachedCopa));
    } else {
      const initialCopa: CopaTask[] = [
        { id: "c-1", desc: "Limpeza: Lavar copos e pratos da Mesa 1", status: "registado", registadoAt: Date.now() - 300000 },
        { id: "c-2", desc: "Limpeza: Lavar talheres e jarra da Mesa 3", status: "registado", registadoAt: Date.now() - 120000 },
      ];
      setCopaTasks(initialCopa);
      localStorage.setItem(COPA_KEY, JSON.stringify(initialCopa));
    }

    // Load Produção tasks
    const cachedProd = localStorage.getItem(PRODUCAO_KEY);
    if (cachedProd) {
      setProducaoTasks(JSON.parse(cachedProd));
    } else {
      const initialProd: ProducaoTask[] = [
        { id: "p-1", desc: "Prep: Preparar Mistura para Panquecas (5L)", status: "registado", registadoAt: Date.now() - 600000 },
        { id: "p-2", desc: "Prep: Cortar fatias de Bacon para grelha (2kg)", status: "registado", registadoAt: Date.now() - 400000 },
        { id: "p-3", desc: "Prep: Guacamole fresco (1kg)", status: "registado", registadoAt: Date.now() - 200000 },
        { id: "p-4", desc: "Prep: Moer grãos de café de Especialidade", status: "registado", registadoAt: Date.now() - 50000 },
      ];
      setProducaoTasks(initialProd);
      localStorage.setItem(PRODUCAO_KEY, JSON.stringify(initialProd));
    }
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

  const addCopaTask = useCallback((desc: string) => {
    const task: CopaTask = {
      id: `c-${Date.now()}`,
      desc,
      status: "registado",
      registadoAt: Date.now()
    };
    persistCopa([...copaTasks, task]);
  }, [copaTasks, persistCopa]);

  const addProducaoTask = useCallback((desc: string) => {
    const task: ProducaoTask = {
      id: `p-${Date.now()}`,
      desc,
      status: "registado",
      registadoAt: Date.now()
    };
    persistProducao([...producaoTasks, task]);
  }, [producaoTasks, persistProducao]);

  const closeOrder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      persist(orders.map((o) => (o.id === orderId ? { ...o, closedAt: Date.now() } : o)));
      if (activeOrderId === orderId) setActiveOrderId(null);

      // Auto queue Copa task for tables (mesa > 0)
      if (order && order.mesa > 0) {
        // We defer it slightly to access correct updated state or append to list
        const task: CopaTask = {
          id: `c-${Date.now()}`,
          desc: `Limpeza: Lavar loiça da Mesa ${order.mesa}`,
          status: "registado",
          registadoAt: Date.now()
        };
        // Read directly from storage to prevent stale closure state
        try {
          const currentCopa: CopaTask[] = JSON.parse(localStorage.getItem(COPA_KEY) || "[]");
          const nextCopa = [...currentCopa, task];
          setCopaTasks(nextCopa);
          localStorage.setItem(COPA_KEY, JSON.stringify(nextCopa));
        } catch {
          setCopaTasks(prev => [...prev, task]);
        }
      }
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

  const completeCopaTask = useCallback((id: string) => {
    const next = copaTasks.map(t => t.id === id ? { ...t, status: "completo" as const } : t);
    persistCopa(next);
  }, [copaTasks, persistCopa]);

  const completeProducaoTask = useCallback((id: string) => {
    const next = producaoTasks.map(t => t.id === id ? { ...t, status: "completo" as const } : t);
    persistProducao(next);
  }, [producaoTasks, persistProducao]);

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
    copaTasks,
    producaoTasks,
    completeCopaTask,
    completeProducaoTask,
    addCopaTask,
    addProducaoTask
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOrders() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOrders must be inside OrdersProvider");
  return c;
}
