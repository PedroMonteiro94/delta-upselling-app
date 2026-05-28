export type ZoneId = "esplanada" | "area2" | "area1";

export interface Zone {
  id: ZoneId;
  label: string;
  tables: number[];
}

const range = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const ZONES: Zone[] = [
  { id: "esplanada", label: "Esplanada", tables: range(501, 505) },
  { id: "area2", label: "Área 2", tables: range(301, 307) },
  { id: "area1", label: "Área 1", tables: range(201, 224) },
];

export const ALL_TABLES = ZONES.flatMap((z) => z.tables);
export const SEAT_CAPACITY = 68;

export function zoneOfTable(t: number): ZoneId | null {
  return ZONES.find((z) => z.tables.includes(t))?.id ?? null;
}
