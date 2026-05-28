import type { MenuItem, Subcategory } from "@/data/menu";

export type Praca = "quente" | "fria" | "bebida";

// Praça quente: cozinha que envolve chapa/forno (ovos, hamburguers, prego)
const QUENTE_SUBS: Subcategory[] = ["Ovos", "Hamburguers"];
// Praça fria: montagem (focaccias, sandes, tostas, saladas, iogurte)
const FRIA_SUBS: Subcategory[] = ["Sandes e Foccacias", "Saladas"];

// IDs específicos que pertencem à praça quente mesmo em sub "Sandes e Foccacias"
const QUENTE_IDS = new Set(["prego", "club-sandwich"]);
// IDs que são iogurte / sobremesa de praça fria
const FRIA_IDS = new Set(["iogurte-granola"]);

export function pracaOf(item: { id: string; subcategoria: Subcategory; categoria: string }): Praca {
  if (QUENTE_IDS.has(item.id)) return "quente";
  if (FRIA_IDS.has(item.id)) return "fria";
  if (QUENTE_SUBS.includes(item.subcategoria)) return "quente";
  if (FRIA_SUBS.includes(item.subcategoria)) return "fria";
  // Pastelaria, cafetaria, campanhas → bebida (sem bloqueio cozinha)
  return "bebida";
}

export function isKitchenItem(item: MenuItem): boolean {
  return pracaOf(item) !== "bebida";
}

// Itens objectivo cooperativo (saco de café)
export function isSacoCafe(id: string, nome: string): boolean {
  return id.startsWith("saco-cafe") || /saco de caf/i.test(nome);
}
