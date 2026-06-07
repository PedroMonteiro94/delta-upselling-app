import type { MenuItem, Subcategory } from "@/data/menu";

export type Praca = "quente" | "fria" | "copa" | "producao" | "bebida";

// Praça quente: cozinha que envolve chapa/forno (ovos, hamburguers, prego)
const QUENTE_SUBS: Subcategory[] = ["Ovos", "Hamburguers"];
// Praça fria: montagem (focaccias, sandes, tostas, saladas)
const FRIA_SUBS: Subcategory[] = ["Sandes e Foccacias", "Saladas"];

// IDs específicos que pertencem à praça quente mesmo em sub "Sandes e Foccacias"
const QUENTE_IDS = new Set(["prego", "club-sandwich"]);
// IDs que são iogurte
const FRIA_IDS = new Set(["iogurte-granola"]);

// IDs que pertencem à praça de produção (sobremesas e pastelaria que precisam de preparação/empratamento rápido)
const PRODUCAO_IDS = new Set([
  "tiramisu",
  "banoffee",
  "fruta-fresca",
  "pastel-nata",
  "cookie",
  "new-york-roll",
  "cinnamon-roll",
  "pain-chocolat",
  "tarte-amendoa"
]);

export function pracaOf(item: { id: string; subcategoria: Subcategory; categoria: string }): Praca {
  if (QUENTE_IDS.has(item.id)) return "quente";
  if (FRIA_IDS.has(item.id)) return "fria";
  if (PRODUCAO_IDS.has(item.id)) return "producao";
  if (QUENTE_SUBS.includes(item.subcategoria)) return "quente";
  if (FRIA_SUBS.includes(item.subcategoria)) return "fria";
  // Bebidas, campanhas (excepto café que pode ter modifiers mas é servido pelo barista no bar)
  return "bebida";
}

export function isKitchenItem(item: MenuItem): boolean {
  const p = pracaOf(item);
  return p !== "bebida";
}

// Itens objectivo cooperativo (saco de café)
export function isSacoCafe(id: string, nome: string): boolean {
  return id.startsWith("saco-cafe") || /saco de caf/i.test(nome);
}
