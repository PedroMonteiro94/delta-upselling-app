import { useMemo, useState } from "react";
import { BarChart3, Trophy, Coffee, Flame, Droplet, TrendingUp } from "lucide-react";
import { useGoals, REWARD_FOCACCIA, REWARD_BLUE, REWARD_SACO } from "@/lib/goals";

const monthKey = (d: Date) => d.toISOString().slice(0, 7);
const monthLabel = (m: string) =>
  new Date(m + "-01").toLocaleDateString("pt-PT", { month: "short", year: "numeric" });

export function MetricsPanel() {
  const { statsHistory, users, fundoNatal } = useGoals();

  // Coletar todos os meses disponíveis no histórico + mês atual
  const allMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(monthKey(new Date()));
    for (const perMonth of Object.values(statsHistory)) {
      for (const m of Object.keys(perMonth)) set.add(m);
    }
    // também meses do fundo
    for (const perMonth of Object.values(fundoNatal.perUserMonth)) {
      for (const m of Object.keys(perMonth)) set.add(m);
    }
    return Array.from(set).sort().reverse();
  }, [statsHistory, fundoNatal]);

  const [selected, setSelected] = useState<string>(monthKey(new Date()));

  // Dados por utilizador no mês selecionado
  const rows = useMemo(() => {
    return users
      .map((u) => {
        const s = statsHistory[u.name]?.[selected];
        return {
          name: u.name,
          role: u.role,
          archived: u.archived,
          focaccias: s?.focacciasSold ?? 0,
          blues: s?.blueLattesSold ?? 0,
          sacos: s?.sacosSold ?? 0,
          rewardFoc: s?.rewardFocaccia ?? 0,
          rewardBlue: s?.rewardBlue ?? 0,
          rewardSaco: s?.rewardSaco ?? 0,
          totalReward:
            (s?.rewardFocaccia ?? 0) + (s?.rewardBlue ?? 0) + (s?.rewardSaco ?? 0),
        };
      })
      .filter((r) => r.focaccias + r.blues + r.sacos > 0 || !r.archived);
  }, [users, statsHistory, selected]);

  const top = (key: "focaccias" | "blues" | "sacos") =>
    [...rows].filter((r) => r[key] > 0).sort((a, b) => b[key] - a[key]).slice(0, 3);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          focaccias: acc.focaccias + r.focaccias,
          blues: acc.blues + r.blues,
          sacos: acc.sacos + r.sacos,
          reward: acc.reward + r.totalReward,
        }),
        { focaccias: 0, blues: 0, sacos: 0, reward: 0 }
      ),
    [rows]
  );

  // Evolução do Fundo Natal por mês do ano corrente
  const year = new Date().getFullYear();
  const fundoSeries = useMemo(() => {
    const perMonth: Record<string, number> = {};
    for (const userMonths of Object.values(fundoNatal.perUserMonth)) {
      for (const [m, v] of Object.entries(userMonths)) {
        if (m.startsWith(String(year))) {
          perMonth[m] = (perMonth[m] ?? 0) + v;
        }
      }
    }
    const months = Array.from({ length: 12 }, (_, i) =>
      `${year}-${String(i + 1).padStart(2, "0")}`
    );
    let acc = 0;
    return months.map((m) => {
      const inc = perMonth[m] ?? 0;
      acc += inc;
      return { month: m, increment: inc, cumulative: acc };
    });
  }, [fundoNatal, year]);

  const maxCumulative = Math.max(1, ...fundoSeries.map((p) => p.cumulative));

  return (
    <section className="space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-accent" />
          <h2 className="font-display text-2xl">Métricas mensais</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Vendas pagas, prémios por colaborador e evolução do Fundo Natal.
        </p>
      </div>

      {/* Seletor de mês */}
      <div className="-mx-5 overflow-x-auto px-5 scrollbar-none">
        <div className="flex gap-2">
          {allMonths.map((m) => {
            const active = m === selected;
            return (
              <button
                key={m}
                onClick={() => setSelected(m)}
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider ${
                  active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                }`}
              >
                {monthLabel(m)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Totais agregados */}
      <div className="grid grid-cols-2 gap-2">
        <StatTile icon={<Flame className="h-4 w-4" />} label="Focaccias" value={totals.focaccias} />
        <StatTile icon={<Droplet className="h-4 w-4" />} label="Blue Lattes" value={totals.blues} />
        <StatTile icon={<Coffee className="h-4 w-4" />} label="Sacos café" value={totals.sacos} />
        <StatTile
          icon={<TrendingUp className="h-4 w-4" />}
          label="Prémios totais"
          value={`${totals.reward.toFixed(2)} €`}
        />
      </div>

      {/* Top 3 por produto */}
      <div className="space-y-3">
        <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Top 3 vendedores
        </h3>
        <TopList
          title="Focaccias"
          unit={`+${REWARD_FOCACCIA.toFixed(2)}€/un`}
          rows={top("focaccias").map((r) => ({ name: r.name, value: r.focaccias }))}
        />
        <TopList
          title="Blue Lattes"
          unit={`+${REWARD_BLUE.toFixed(2)}€/un`}
          rows={top("blues").map((r) => ({ name: r.name, value: r.blues }))}
        />
        <TopList
          title="Sacos de café"
          unit={`+${REWARD_SACO.toFixed(2)}€/un`}
          rows={top("sacos").map((r) => ({ name: r.name, value: r.sacos }))}
        />
      </div>

      {/* Tabela por utilizador */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-4 py-2.5">
          <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Por colaborador · {monthLabel(selected)}
          </h3>
        </div>
        {rows.length === 0 ? (
          <p className="p-4 text-center text-xs text-muted-foreground">
            Sem dados para este mês.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-secondary/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold uppercase tracking-wider">Nome</th>
                  <th className="px-2 py-2 text-right font-semibold">Foc</th>
                  <th className="px-2 py-2 text-right font-semibold">Blue</th>
                  <th className="px-2 py-2 text-right font-semibold">Saco</th>
                  <th className="px-3 py-2 text-right font-semibold">Prémio</th>
                </tr>
              </thead>
              <tbody>
                {rows
                  .slice()
                  .sort((a, b) => b.totalReward - a.totalReward)
                  .map((r) => (
                    <tr key={r.name} className="border-t border-border">
                      <td className="px-3 py-2">
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                          {r.role}
                          {r.archived && " · arquivado"}
                        </p>
                      </td>
                      <td className="px-2 py-2 text-right tabular-nums">{r.focaccias}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{r.blues}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{r.sacos}</td>
                      <td className="px-3 py-2 text-right font-display text-success">
                        {r.totalReward.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Evolução Fundo Natal */}
      <div className="rounded-3xl border-2 p-5"
           style={{ borderColor: "oklch(0.55 0.18 25)",
                    background: "linear-gradient(135deg, oklch(0.97 0.04 25), oklch(0.94 0.06 145))" }}>
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4" style={{ color: "oklch(0.45 0.18 25)" }} />
          <h3 className="font-display text-lg" style={{ color: "oklch(0.30 0.12 25)" }}>
            🎄 Evolução do Fundo Natal · {year}
          </h3>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-wider" style={{ color: "oklch(0.40 0.10 25)" }}>
          Acumulado: {fundoNatal.total.toFixed(2)} €
        </p>
        <div className="mt-4 space-y-2">
          {fundoSeries.map((p) => {
            const pct = (p.cumulative / maxCumulative) * 100;
            const m = new Date(p.month + "-01").toLocaleDateString("pt-PT", { month: "short" });
            return (
              <div key={p.month} className="flex items-center gap-2">
                <span className="w-10 text-[10px] uppercase tracking-wider" style={{ color: "oklch(0.35 0.10 25)" }}>
                  {m}
                </span>
                <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-white/60 ring-1 ring-foreground/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background:
                        "repeating-linear-gradient(45deg, oklch(0.55 0.18 25) 0 10px, oklch(0.45 0.18 145) 10px 20px)",
                    }}
                  />
                </div>
                <span className="w-20 text-right text-[10px] font-semibold tabular-nums" style={{ color: "oklch(0.30 0.16 145)" }}>
                  {p.cumulative.toFixed(2)} €
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}

function TopList({
  title, unit, rows,
}: { title: string; unit: string; rows: { name: string; value: number }[] }) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">{title}</p>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
      {rows.length === 0 ? (
        <p className="mt-2 text-[11px] text-muted-foreground">Sem vendas este mês.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {rows.map((r, i) => (
            <li key={r.name} className="flex items-center justify-between text-[12px]">
              <span className="flex items-center gap-2">
                <span className="text-base">{medals[i]}</span>
                <span className="font-medium">{r.name}</span>
              </span>
              <span className="font-display text-base tabular-nums">{r.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
