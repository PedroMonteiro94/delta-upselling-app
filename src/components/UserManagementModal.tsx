import { useState } from "react";
import { X, UserPlus, Trash2, Archive, ArchiveRestore, Shield, User as UserIcon } from "lucide-react";
import { useGoals, type Role } from "@/lib/goals";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function UserManagementModal({ open, onClose }: Props) {
  const { users, createUser, deleteUser, archiveUser, unarchiveUser, isGerente, isLeader } = useGoals();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("colaborador");
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  if (!open) return null;
  if (!isLeader) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createUser(name, password, role);
    if (!res.ok) toast.error(res.error || "Erro");
    else {
      toast.success(`Conta de ${name} criada`);
      setName("");
      setPassword("");
      setRole("colaborador");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card text-card-foreground rounded-t-3xl sm:rounded-3xl p-6 pb-8 shadow-[var(--shadow-upsell)] animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <Shield className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Gestão de Contas
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-3 font-display text-2xl">Equipa</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Cria, arquiva ou elimina perfis. Eliminar remove permanentemente todos os dados (cascade).
        </p>

        {/* Create */}
        <form
          onSubmit={handleCreate}
          className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4 space-y-3"
        >
          <div className="flex items-center gap-2 text-foreground">
            <UserPlus className="h-4 w-4" />
            <span className="text-sm font-semibold">Criar nova conta</span>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do colaborador"
            className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password / PIN"
            className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="flex gap-2">
            {(["colaborador", "responsavel", "gerente"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 rounded-xl px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  role === r
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-success px-4 py-3 text-sm font-semibold text-success-foreground active:scale-[0.98] transition-transform"
          >
            Criar conta
          </button>
        </form>

        {/* List */}
        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Contas existentes ({users.length})
          </p>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.name}
                className={`rounded-2xl border border-border p-3 ${
                  u.archived ? "bg-muted/40 opacity-70" : "bg-card"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {u.role === "gerente" ? (
                      <Shield className="h-4 w-4 text-accent shrink-0" />
                    ) : (
                      <UserIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{u.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {u.role}
                        {u.archived && " · arquivada"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {isGerente && (u.archived ? (
                      <button
                        onClick={() => {
                          unarchiveUser(u.name);
                          toast.success(`${u.name} reativada`);
                        }}
                        className="rounded-lg p-2 text-success hover:bg-success/10"
                        aria-label="Reativar"
                      >
                        <ArchiveRestore className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          archiveUser(u.name);
                          toast(`${u.name} arquivada`);
                        }}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
                        aria-label="Arquivar"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    ))}
                    {isGerente && (
                      <button
                        onClick={() => setConfirmDel(u.name)}
                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {confirmDel === u.name && (
                  <div className="mt-3 rounded-xl bg-destructive/10 p-3 text-xs">
                    <p className="text-destructive font-semibold">
                      Eliminar {u.name} permanentemente? Todos os dados e estatísticas serão removidos.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => {
                          deleteUser(u.name);
                          toast.success("Conta eliminada");
                          setConfirmDel(null);
                        }}
                        className="flex-1 rounded-lg bg-destructive py-2 text-xs font-semibold text-destructive-foreground"
                      >
                        Eliminar (cascade)
                      </button>
                      <button
                        onClick={() => setConfirmDel(null)}
                        className="flex-1 rounded-lg bg-muted py-2 text-xs font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
