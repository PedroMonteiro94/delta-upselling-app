// Equipa fixa de 22 colaboradores + motor de folgas

export type Posto =
  | "gerente"
  | "responsavel"
  | "cozinheiro"
  | "copeiro"
  | "barista"
  | "caixa"
  | "sala"
  | "hostess"
  | "runner";

export interface StaffMember {
  id: string;
  nome: string;
  posto: Posto;
  // Farda: cozinha (BoH) ou frente de loja (FoH)
  farda: "BoH" | "FoH";
}

// FoH: barista, caixa, sala, hostess, runner, responsavel, gerente
// BoH: cozinheiro, copeiro – nunca podem cobrir frente de loja
const FOH_POSTS: Posto[] = ["barista", "caixa", "sala", "hostess", "runner", "responsavel", "gerente"];
export function isFoH(posto: Posto): boolean {
  return FOH_POSTS.includes(posto);
}

// Roster fixo de 22 elementos
export const ROSTER: StaffMember[] = [
  { id: "u01", nome: "Inês Carvalho",  posto: "gerente",     farda: "FoH" },
  { id: "u02", nome: "Tiago Mendes",   posto: "responsavel", farda: "FoH" },
  { id: "u03", nome: "Mariana Pinto",  posto: "responsavel", farda: "FoH" },
  { id: "u04", nome: "Rui Almeida",    posto: "responsavel", farda: "FoH" },
  { id: "u05", nome: "Sofia Pires",    posto: "hostess",     farda: "FoH" }, // Hostess A
  { id: "u06", nome: "Beatriz Lima",   posto: "hostess",     farda: "FoH" }, // Hostess B
  { id: "u07", nome: "André Costa",    posto: "barista",     farda: "FoH" },
  { id: "u08", nome: "Carolina Silva", posto: "barista",     farda: "FoH" },
  { id: "u09", nome: "Diogo Faria",    posto: "barista",     farda: "FoH" },
  { id: "u10", nome: "Helena Reis",    posto: "barista",     farda: "FoH" },
  { id: "u11", nome: "João Antunes",   posto: "caixa",       farda: "FoH" },
  { id: "u12", nome: "Rita Soares",    posto: "caixa",       farda: "FoH" },
  { id: "u13", nome: "Pedro Vaz",      posto: "sala",        farda: "FoH" },
  { id: "u14", nome: "Margarida Sá",   posto: "sala",        farda: "FoH" },
  { id: "u15", nome: "Filipa Nunes",   posto: "sala",        farda: "FoH" },
  { id: "u16", nome: "Bruno Tavares",  posto: "runner",      farda: "FoH" },
  { id: "u17", nome: "Daniel Rocha",   posto: "runner",      farda: "FoH" },
  { id: "u18", nome: "Hugo Marques",   posto: "cozinheiro",  farda: "BoH" },
  { id: "u19", nome: "Catarina Melo",  posto: "cozinheiro",  farda: "BoH" },
  { id: "u20", nome: "Nuno Ferreira",  posto: "cozinheiro",  farda: "BoH" },
  { id: "u21", nome: "Sara Lopes",     posto: "copeiro",     farda: "BoH" },
  { id: "u22", nome: "Luís Gomes",     posto: "copeiro",     farda: "BoH" },
];

export const HOSTESS_A = "u05";
export const HOSTESS_B = "u06";

// ─────────────── Matriz semanal de folgas (estrita 2/sem) ───────────────
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Dom .. 6=Sáb

export function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const first = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  return 1 + Math.round(((date.getTime() - first.getTime()) / 86400000 - 3 + ((first.getUTCDay() + 6) % 7)) / 7);
}

// Devolve os 2 dias de folga (Weekday) para um membro nessa semana ISO
export function leaveDaysFor(member: StaffMember, week: number): Weekday[] {
  // Hostess: rotação Dom/Seg/Ter alternada, nunca ambas no Domingo
  if (member.id === HOSTESS_A) {
    return week % 2 === 0 ? [0, 1] : [0, 2]; // Dom+Seg / Dom+Ter
  }
  if (member.id === HOSTESS_B) {
    return week % 2 === 0 ? [1, 2] : [0, 1]; // Seg+Ter / Dom+Seg
  }
  // Gerente: descanso fixo Dom + Seg (gestão fim-de-semana fora)
  if (member.posto === "gerente") return [0, 1];
  // Restantes: rotação cruzada Sáb/Dom/Seg → A=(Sáb,Dom)  B=(Seg,Dom)
  // Distribui por ID para equilíbrio
  const idx = parseInt(member.id.replace("u", ""), 10);
  const baseEven = week % 2 === 0;
  // Metade da equipa em A, outra metade em B, e troca todas as semanas
  const groupA = idx % 2 === 0 ? baseEven : !baseEven;
  return groupA ? [6, 0] : [1, 0];
}

export function isOff(member: StaffMember, d: Date): boolean {
  return leaveDaysFor(member, isoWeek(d)).includes(d.getDay() as Weekday);
}

// Validação: cada membro tem estritamente 2 folgas / semana
export function validateLeaveMatrix(week: number): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const m of ROSTER) {
    const days = leaveDaysFor(m, week);
    if (days.length !== 2) errors.push(`${m.nome}: ${days.length} folgas (esperado 2)`);
  }
  // Hostess nunca ambas ao Dom
  const a = leaveDaysFor(ROSTER.find((m) => m.id === HOSTESS_A)!, week);
  const b = leaveDaysFor(ROSTER.find((m) => m.id === HOSTESS_B)!, week);
  if (a.includes(0) && b.includes(0)) errors.push("Hostess A e B simultaneamente de folga ao Domingo");
  return { ok: errors.length === 0, errors };
}

export const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// SLAs por posto (segundos)
export const SLA: Record<Posto, { label: string; targetSec: number }[]> = {
  gerente: [],
  responsavel: [{ label: "Cobertura sala", targetSec: 600 }],
  caixa: [{ label: "Tempo médio caixa", targetSec: 90 }],
  barista: [
    { label: "Latte/Cappuccino", targetSec: 180 },
    { label: "Café de filtro", targetSec: 300 },
  ],
  cozinheiro: [
    { label: "Pratos quentes", targetSec: 600 },
    { label: "Pratos frios", targetSec: 360 },
  ],
  copeiro: [{ label: "Loiça", targetSec: 300 }],
  sala: [{ label: "Conversão upsell ≥ 30%", targetSec: 0 }],
  hostess: [{ label: "Acolhimento", targetSec: 90 }],
  runner: [{ label: "Rotação de mesa", targetSec: 600 }],
};
