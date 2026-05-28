import { useMemo, useState } from "react";
import { Shield, AlertTriangle, CheckCircle2, Users, Calendar, Sparkles, ChefHat, Coffee } from "lucide-react";
import { toast } from "sonner";
import {
  ROSTER, type Posto, type StaffMember, isOff, leaveDaysFor, isoWeek,
  validateLeaveMatrix, WEEKDAY_LABELS, SLA, isFoH,
} from "@/lib/roster";
import { useGoals } from "@/lib/goals";

const POSTO_LABEL: Record<Posto, string> = {
  gerente: "Gerente",
  responsavel: "Responsável de Turno",
  cozinheiro: "Cozinheiro",
  copeiro: "Copeiro",
  barista: "Barista",
  caixa: "Caixa",
  sala: "Sala",
  hostess: "Hostess",
  runner: "Runner",
};

const POSTO_ICON: Record<Posto, typeof ChefHat> = {
  gerente: Shield,
  responsavel: Shield,
  cozinheiro: ChefHat,
  copeiro: ChefHat,
  barista: Coffee,
  caixa: Coffee,
  sala: Users,
  hostess: Users,
  runner: Users,
};

export function StaffTab() {
  const { isLeader, users } = useGoals();
  const [tab, setTab] = useState<"alloc" | "schedule" | "sla">("alloc");

  if (!isLeader) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Acesso restrito à liderança.
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-accent" />
        <h2 className="font-display text-2xl">Staff & Operação</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Equipa de 22 elementos · Capacidade 68 lugares
      </p>

      <div className="mt-4 flex gap-2">
        {([
          ["alloc", "Alocação"],
          ["schedule", "Horários"],
          ["sla", "SLAs"],
        ] as [typeof tab, string][]).map(([k, lbl]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-wider ${
              tab === k ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>

      {tab === "alloc" && <AllocationPanel registeredUsers={users.map((u) => u.name)} />}
      {tab === "schedule" && <SchedulePanel />}
      {tab === "sla" && <SlaPanel />}
    </section>
  );
}

// ─────────── Alocação ───────────
function AllocationPanel({ registeredUsers }: { registeredUsers: string[] }) {
  const today = new Date();
  const onShift = ROSTER.filter((m) => !isOff(m, today));
  const off = ROSTER.filter((m) => isOff(m, today));

  // Quem está em sala hoje (posto frente loja)
  const salaCount = onShift.filter((m) => m.posto === "sala").length;
  const baristaCount = onShift.filter((m) => m.posto === "barista").length;

  // Motor de sugestões: regras simples
  const suggestions: { member: StaffMember; suggest: string; reason: string }[] = onShift.map((m) => {
    let suggest = POSTO_LABEL[m.posto];
    let reason = `Posto habitual: ${POSTO_LABEL[m.posto]}.`;

    // Reforço de sala: se < 3 elementos em sala, sugere desviar barista extra OU caixa
    if (salaCount < 3 && (m.posto === "barista" && baristaCount > 2)) {
      suggest = "Sala (reforço)";
      reason = `Sala com apenas ${salaCount} elemento(s). Farda FoH compatível — pode reforçar a frente.`;
    } else if (salaCount < 3 && m.posto === "responsavel") {
      suggest = "Sala (cobertura)";
      reason = `Responsável cobre lacuna em sala (${salaCount} disponíveis). Farda FoH OK.`;
    }

    // Bloqueio estrito de farda BoH
    if (!isFoH(m.posto)) {
      suggest = POSTO_LABEL[m.posto];
      reason = `Farda institucional ${m.posto === "cozinheiro" ? "de Cozinheiro" : "de Copeiro"} — bloqueio higiénico/imagem: NUNCA fora da cozinha.`;
    }

    return { member: m, suggest, reason };
  });

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Stat icon={CheckCircle2} label="Em turno" value={onShift.length} tone="ok" />
        <Stat icon={AlertTriangle} label="De folga" value={off.length} tone="warn" />
      </div>

      <h3 className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground">
        Sugestões de alocação · {today.toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "short" })}
      </h3>
      <ul className="mt-2 space-y-2">
        {suggestions.map(({ member, suggest, reason }) => {
          const Icon = POSTO_ICON[member.posto];
          const isAssigned = registeredUsers.includes(member.nome);
          return (
            <li key={member.id} className="rounded-2xl border border-border bg-card p-3">
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  member.farda === "BoH" ? "bg-destructive/10 text-destructive" : "bg-accent/15 text-accent"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">
                    {member.nome}
                    {!isAssigned && (
                      <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        sem conta
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {POSTO_LABEL[member.posto]} · farda {member.farda}
                  </p>
                  <p className="mt-1.5 text-xs">
                    <span className="font-semibold text-foreground">→ {suggest}</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground italic">{reason}</p>
                </div>
                <button
                  onClick={() => toast.success(`${member.nome} alocado a ${suggest}`)}
                  className="rounded-lg bg-success px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-success-foreground"
                >
                  Alocar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

// ─────────── Horários ───────────
function SchedulePanel() {
  const today = new Date();
  const week = isoWeek(today);
  const validation = useMemo(() => validateLeaveMatrix(week), [week]);

  return (
    <>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary/40 p-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold">Semana {week}</span>
        </div>
        <span className={`text-[10px] uppercase font-bold ${validation.ok ? "text-success" : "text-destructive"}`}>
          {validation.ok ? "✓ matriz válida" : "✗ irregular"}
        </span>
      </div>

      <div className="mt-4 -mx-5 overflow-x-auto px-5">
        <table className="min-w-full border-separate border-spacing-0 text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background py-2 pr-2 text-left font-semibold">Colaborador</th>
              {WEEKDAY_LABELS.map((d) => (
                <th key={d} className="px-1.5 py-2 text-center font-semibold text-muted-foreground">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROSTER.map((m) => {
              const offDays = leaveDaysFor(m, week);
              return (
                <tr key={m.id} className="border-t border-border">
                  <td className="sticky left-0 z-10 bg-background py-2 pr-2">
                    <p className="text-[11px] font-semibold truncate max-w-[110px]">{m.nome}</p>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{POSTO_LABEL[m.posto]}</p>
                  </td>
                  {WEEKDAY_LABELS.map((_, idx) => {
                    const off = offDays.includes(idx as 0 | 1 | 2 | 3 | 4 | 5 | 6);
                    return (
                      <td key={idx} className="px-0.5 py-1.5 text-center">
                        <span className={`inline-block w-6 rounded text-[10px] font-bold ${
                          off ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                        }`}>
                          {off ? "F" : "✓"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!validation.ok && (
        <ul className="mt-3 space-y-1 rounded-xl bg-destructive/10 p-3 text-[11px] text-destructive">
          {validation.errors.map((e) => <li key={e}>· {e}</li>)}
        </ul>
      )}
      <p className="mt-3 text-[10px] text-muted-foreground italic">
        Cada colaborador tem estritamente 2 folgas/semana. Hostess Sofia e Beatriz alternam rotação Dom/Seg/Ter para garantir cobertura ao Domingo.
      </p>
    </>
  );
}

// ─────────── SLAs ───────────
function SlaPanel() {
  return (
    <div className="mt-4 space-y-3">
      {(Object.entries(SLA) as [Posto, { label: string; targetSec: number }[]][])
        .filter(([, arr]) => arr.length > 0)
        .map(([posto, arr]) => {
          const Icon = POSTO_ICON[posto];
          return (
            <div key={posto} className="rounded-2xl border border-border bg-card p-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent" />
                <p className="text-sm font-semibold">{POSTO_LABEL[posto]}</p>
              </div>
              <ul className="mt-2 space-y-1.5">
                {arr.map((s) => (
                  <li key={s.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-mono font-semibold text-success">
                      {s.targetSec === 0 ? "—" : `< ${Math.floor(s.targetSec / 60)}m${s.targetSec % 60 ? `${s.targetSec % 60}s` : ""}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
        <Sparkles className="h-4 w-4 text-accent" />
        <p className="mt-2 text-xs leading-snug">
          Os tempos médios são calculados a partir dos timestamps "Registado → Entregue → Pago". Eficiência só conta com a 3ª etapa confirmada.
        </p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof ChefHat; label: string; value: number; tone: "ok" | "warn" }) {
  return (
    <div className={`rounded-2xl border p-3 ${tone === "ok" ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
      <div className={`flex items-center gap-1.5 ${tone === "ok" ? "text-success" : "text-destructive"}`}>
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}
