import { useState } from "react";
import { Trophy, X, LogOut, Flame, TrendingUp, Sparkles, Shield, Users } from "lucide-react";
import {
  useGoals,
  FOCACCIA_TARGET,
  BLUE_LATTE_TARGET,
} from "@/lib/goals";

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenManagement: () => void;
  onOpenQuickSwitch: () => void;
}

export function GoalsModal({ open, onClose, onOpenManagement, onOpenQuickSwitch }: Props) {
  const { user, signIn, signUp, signOut, currentStats, isGerente, isLeader } = useGoals();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = mode === "signup" ? signUp(name, password) : signIn(name, password);
    if (!res.ok) setError(res.error || "Erro");
    else {
      setName("");
      setPassword("");
    }
  };

  const focPct = Math.min(100, (currentStats.focacciasSold / FOCACCIA_TARGET) * 100);
  const bluePct = Math.min(100, (currentStats.blueLattesSold / BLUE_LATTE_TARGET) * 100);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card text-card-foreground rounded-t-3xl sm:rounded-3xl p-6 pb-8 shadow-[var(--shadow-upsell)] animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <Trophy className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Os meus objetivos
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!user ? (
          <>
            <h2 className="mt-3 font-display text-2xl text-foreground">
              {mode === "signup" ? "Criar Perfil" : "Entrar"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signup"
                ? "O primeiro perfil criado é Gerente. Os seguintes são Colaboradores e devem ser criados pelo Gerente."
                : "Acede aos teus números e ao foco do mês."}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Nome
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="O teu nome"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="••••••"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
              {error && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-2xl bg-primary px-5 py-4 text-base font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
              >
                {mode === "signup" ? "Criar perfil" : "Entrar"}
              </button>
            </form>

            <button
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setError(null);
              }}
              className="mt-3 w-full text-center text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
            >
              {mode === "signup"
                ? "Já tens perfil? Entrar"
                : "Sem perfis? Criar o primeiro (Gerente)"}
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenQuickSwitch();
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-semibold text-muted-foreground active:scale-[0.99]"
            >
              <Users className="h-4 w-4" /> Troca rápida de utilizador
            </button>
          </>
        ) : (
          <>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-foreground">
                  Olá, {user.name}! 👋
                </h2>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {isGerente ? <Shield className="h-3 w-3 text-accent" /> : null}
                  {user.role}
                </p>
              </div>
            </div>

            {/* Foco do Mês */}
            <section
              className="mt-5 rounded-3xl border-2 p-5"
              style={{
                borderColor: "var(--gold)",
                background:
                  "linear-gradient(135deg, oklch(0.98 0.03 80), oklch(0.94 0.05 80))",
              }}
            >
              <div className="flex items-center gap-2 text-foreground">
                <Flame className="h-4 w-4 text-accent" />
                <h3 className="font-display text-lg">Foco do Mês</h3>
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                Só conta após pagamento confirmado
              </p>

              <div className="mt-4 space-y-4">
                <ProgressRow
                  label="Focaccias Pagas"
                  current={currentStats.focacciasSold}
                  target={FOCACCIA_TARGET}
                  pct={focPct}
                />
                <ProgressRow
                  label="Blue Lattes Pagos"
                  current={currentStats.blueLattesSold}
                  target={BLUE_LATTE_TARGET}
                  pct={bluePct}
                />
              </div>
            </section>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">
                    Totais pagos
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl">
                  {currentStats.totalAdded}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">
                    Valor extra
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl text-success">
                  {currentStats.extraRevenue.toFixed(2)} €
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenQuickSwitch();
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-semibold active:scale-[0.99]"
              >
                <Users className="h-4 w-4" /> Troca rápida
              </button>
              {isLeader && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenManagement();
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-xs font-semibold text-accent-foreground active:scale-[0.99]"
                >
                  <Shield className="h-4 w-4" /> Gerir equipa
                </button>
              )}
            </div>

            <button
              onClick={signOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-medium text-muted-foreground active:scale-[0.99] transition-transform"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  current,
  target,
  pct,
}: {
  label: string;
  current: number;
  target: number;
  pct: number;
}) {
  const done = current >= target;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs font-medium text-muted-foreground">
          {current} / {target} {done && "✓"}
        </span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: done
              ? "var(--success)"
              : "linear-gradient(90deg, var(--accent), var(--gold))",
          }}
        />
      </div>
    </div>
  );
}
