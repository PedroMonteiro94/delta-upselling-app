import { useEffect, useState } from "react";
import { X, UserCog, Save } from "lucide-react";
import { useGoals } from "@/lib/goals";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MyAccountModal({ open, onClose }: Props) {
  const { user, updateOwnProfile } = useGoals();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open, user]);

  if (!open || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As passwords novas não coincidem.");
      return;
    }
    const finalPassword = newPassword || currentPassword;
    const res = updateOwnProfile(currentPassword, name, finalPassword);
    if (!res.ok) {
      toast.error(res.error || "Erro ao atualizar.");
      return;
    }
    toast.success("Perfil atualizado com sucesso");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card text-card-foreground rounded-t-3xl sm:rounded-3xl p-6 pb-8 shadow-[var(--shadow-upsell)] animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent">
            <UserCog className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              Minha Conta
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-3 font-display text-2xl">{user.name}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Atualiza o teu nome e password. Só consegues editar a tua própria conta.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Password atual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Confirma a tua password"
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Nova password (opcional)
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova password"
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar nova password"
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-[10px] text-muted-foreground">
              Deixa em branco se só queres mudar o nome.
            </p>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-success px-4 py-3.5 text-sm font-semibold text-success-foreground active:scale-[0.98] transition-transform"
          >
            <Save className="h-4 w-4" />
            Guardar alterações
          </button>
        </form>
      </div>
    </div>
  );
}
