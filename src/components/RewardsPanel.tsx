import { Gift, TrendingUp, Coffee, Users } from "lucide-react";
import {
  useGoals, REWARD_FOCACCIA, REWARD_BLUE, REWARD_SACO,
  INDIV_CAP_MONTH,
} from "@/lib/goals";

export function RewardsPanel() {
  const { currentStats, fundoNatal, user, stats } = useGoals();

  const focPct = Math.min(100, (currentStats.rewardFocaccia / INDIV_CAP_MONTH) * 100);
  const bluePct = Math.min(100, (currentStats.rewardBlue / INDIV_CAP_MONTH) * 100);

  // Total de sacos vendidos por TODA a equipa (mês corrente)
  const month = new Date().toISOString().slice(0, 7);
  const teamSacos = Object.values(stats).reduce(
    (acc, s) => acc + (s.month === month ? s.sacosSold : 0),
    0
  );

  // Fundo Natal: meta visual = 700€ potencial coletivo
  const FUND_TARGET = 700;
  const fundPct = Math.min(100, (fundoNatal.total / FUND_TARGET) * 100);

  return (
    <section>
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-accent" />
        <h2 className="font-display text-2xl">Prémios</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Venda sugestiva confirmada (etapa "Pago") · mês {new Date().toLocaleDateString("pt-PT", { month: "long", year: "numeric" })}
      </p>

      {user && (
        <>
          <h3 className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">Os teus prémios individuais</h3>
          <div className="mt-2 space-y-3">
            <RewardRow
              label="Focaccias" sub={`+${REWARD_FOCACCIA.toFixed(2)}€ cada · teto ${INDIV_CAP_MONTH}€/mês`}
              euros={currentStats.rewardFocaccia} cap={INDIV_CAP_MONTH} pct={focPct}
            />
            <RewardRow
              label="Blue Lattes" sub={`+${REWARD_BLUE.toFixed(2)}€ cada · teto ${INDIV_CAP_MONTH}€/mês`}
              euros={currentStats.rewardBlue} cap={INDIV_CAP_MONTH} pct={bluePct}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider">Total individual este mês</span>
            </div>
            <p className="mt-1 font-display text-3xl text-success">
              {(currentStats.rewardFocaccia + currentStats.rewardBlue).toFixed(2)} €
            </p>
          </div>
        </>
      )}

      {/* Fundo Natal — coletivo, festivo (alimentado pelos sacos de café 250gr da equipa) */}
      <div className="mt-6 rounded-3xl border-2 p-5"
           style={{ borderColor: "oklch(0.55 0.18 25)",
                    background: "linear-gradient(135deg, oklch(0.97 0.04 25), oklch(0.94 0.06 145))" }}>
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5" style={{ color: "oklch(0.45 0.18 25)" }} />
          <h3 className="font-display text-xl" style={{ color: "oklch(0.30 0.12 25)" }}>
            🎄 Fundo do Jantar de Natal
          </h3>
        </div>
        <p className="mt-1 text-[11px] uppercase tracking-wider" style={{ color: "oklch(0.40 0.10 25)" }}>
          Prémio de equipa · acumulado ininterrupto · {fundoNatal.year}
        </p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-3xl font-bold" style={{ color: "oklch(0.30 0.16 145)" }}>
              {fundoNatal.total.toFixed(2)} €
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              meta {FUND_TARGET}€
            </span>
          </div>
          <div className="relative mt-2 h-5 w-full overflow-hidden rounded-full bg-white/60 ring-1 ring-foreground/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${fundPct}%`,
                background:
                  "repeating-linear-gradient(45deg, oklch(0.55 0.18 25) 0 12px, oklch(0.45 0.18 145) 12px 24px)",
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2.5">
            <Users className="h-4 w-4" style={{ color: "oklch(0.40 0.10 25)" }} />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider" style={{ color: "oklch(0.40 0.10 25)" }}>
                Sacos 250g vendidos pela equipa (este mês)
              </p>
              <p className="font-display text-xl font-bold" style={{ color: "oklch(0.30 0.12 25)" }}>
                {teamSacos}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs italic" style={{ color: "oklch(0.35 0.10 25)" }}>
            Cada saco de café 250g pago pela equipa adiciona +{REWARD_SACO.toFixed(2)}€ ao bolo coletivo do jantar.
          </p>
        </div>
      </div>
    </section>
  );
}

function RewardRow({
  label, sub, euros, cap, pct,
}: { label: string; sub: string; euros: number; cap: number; pct: number }) {
  const done = euros >= cap;
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-[10px] text-muted-foreground">{sub}</p>
        </div>
        <p className="font-display text-lg text-success">
          {euros.toFixed(2)} <span className="text-xs">€</span>
        </p>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: done ? "var(--success)" : "linear-gradient(90deg, var(--accent), var(--gold))",
          }}
        />
      </div>
    </div>
  );
}
