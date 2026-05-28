import { useState } from "react";
import { X, Users, Shield, User as UserIcon, ArrowLeft } from "lucide-react";
import { useGoals } from "@/lib/goals";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function QuickSwitchModal({ open, onClose }: Props) {
  const { activeUsers, quickSwitch, user } = useGoals();
  const [selected, setSelected] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setSelected(null);
    setPassword("");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const res = quickSwitch(selected, password);
    if (!res.ok) setError(res.error || "Erro");
    else {
      reset();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[65] flex items-end sm:items-center justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        reset();
        onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-card text-card-foreground rounded-t-3xl sm:rounded-3xl p-6 pb-8 shadow-[var(--shadow-upsell)] animate-in slide-in-from-bottom duration-300 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <Users className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Troca rápida
            </span>
          </div>
          <button
            onClick={() => {
              reset();
              onClose();
            }}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!selected ? (
          <>
            <h2 className="mt-3 font-display text-2xl">Quem está em sala?</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Toque no seu perfil para tomar a sessão.
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-3">
              {activeUsers.map((u) => {
                const isCurrent = user?.name === u.name;
                return (
                  <li key={u.name}>
                    <button
                      onClick={() => setSelected(u.name)}
                      className={`w-full rounded-2xl border-2 p-4 text-left active:scale-[0.97] transition-all ${
                        isCurrent
                          ? "border-accent bg-accent/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {u.role === "gerente" ? (
                          <Shield className="h-4 w-4 text-accent" />
                        ) : (
                          <UserIcon className="h-4 w-4" />
                        )}
                        <span className="text-[10px] uppercase tracking-wider">
                          {u.role}
                        </span>
                      </div>
                      <p className="mt-2 font-display text-lg truncate">{u.name}</p>
                      {isCurrent && (
                        <p className="mt-1 text-[10px] font-semibold uppercase text-accent">
                          Sessão ativa
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {activeUsers.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                Sem perfis ativos. Pede a um gerente para criar uma conta.
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Voltar
            </button>
            <h2 className="mt-3 font-display text-2xl">Olá, {selected}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Introduz a tua password / PIN para validar.
            </p>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="mt-5 w-full rounded-2xl border border-border bg-background px-4 py-5 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {error && (
              <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-primary px-5 py-4 text-base font-semibold text-primary-foreground active:scale-[0.98] transition-transform"
            >
              Validar e entrar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
