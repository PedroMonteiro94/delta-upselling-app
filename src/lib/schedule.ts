// Horários Delta Coffee House – Avenida da Liberdade

export type DayKind = "weekday" | "sunday";

export interface DaySchedule {
  storeOpen: string;   // HH:MM
  storeClose: string;
  staffOpen: string;
  staffClose: string;
  kitchenCloseEarly: string; // bloqueio cozinha (só bebidas e sacos)
}

export const SCHEDULE: Record<DayKind, DaySchedule> = {
  weekday: {
    storeOpen: "08:00",
    storeClose: "22:30",
    staffOpen: "07:00",
    staffClose: "23:30",
    kitchenCloseEarly: "22:00",
  },
  sunday: {
    storeOpen: "09:00",
    storeClose: "20:00",
    staffOpen: "08:00",
    staffClose: "21:00",
    kitchenCloseEarly: "19:30",
  },
};

export function dayKind(d = new Date()): DayKind {
  return d.getDay() === 0 ? "sunday" : "weekday";
}

const hm = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
const nowMin = (d = new Date()) => d.getHours() * 60 + d.getMinutes();

export function isStoreOpen(d = new Date()) {
  const sc = SCHEDULE[dayKind(d)];
  const n = nowMin(d);
  return n >= hm(sc.storeOpen) && n < hm(sc.storeClose);
}

export function isKitchenOpen(d = new Date()) {
  const sc = SCHEDULE[dayKind(d)];
  const n = nowMin(d);
  return isStoreOpen(d) && n < hm(sc.kitchenCloseEarly);
}

export function isPreOpening(d = new Date()) {
  const sc = SCHEDULE[dayKind(d)];
  const n = nowMin(d);
  return n >= hm(sc.staffOpen) && n < hm(sc.storeOpen);
}

export function isPostClosing(d = new Date()) {
  const sc = SCHEDULE[dayKind(d)];
  const n = nowMin(d);
  return n >= hm(sc.storeClose) && n <= hm(sc.staffClose);
}

export function operationalLabel(d = new Date()): {
  label: string;
  tone: "ok" | "warn" | "off";
} {
  if (isStoreOpen(d) && !isKitchenOpen(d))
    return { label: "Cozinha encerrada · só bebidas e sacos de café", tone: "warn" };
  if (isStoreOpen(d)) return { label: "Loja aberta · serviço normal", tone: "ok" };
  if (isPreOpening(d)) return { label: "Abertura · preparar stock e ponto", tone: "warn" };
  if (isPostClosing(d)) return { label: "Fecho · métricas de sala congeladas", tone: "warn" };
  return { label: "Fora do horário de staff", tone: "off" };
}
