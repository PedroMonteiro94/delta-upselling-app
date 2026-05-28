import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { isSacoCafe } from "@/lib/classify";

const USERS_KEY = "delta_users_v3";
const SESSION_KEY = "delta_session_v3";
const STATS_KEY = "delta_goals_stats_v2";
const STATS_HISTORY_KEY = "delta_goals_stats_history_v1";
const FUND_KEY = "delta_fundo_natal_v1";

export const FOCACCIA_TARGET = 5;
export const BLUE_LATTE_TARGET = 10;
export const SACO_TARGET = 5;

// Prémios financeiros (€)
export const REWARD_FOCACCIA = 1.0;
export const REWARD_BLUE = 0.5;
export const REWARD_SACO = 1.5;
export const INDIV_CAP_MONTH = 50; // foco mensal (focaccia / blue)
export const SACO_CAP_MONTH = 100; // saco individual / mês

export type Role = "gerente" | "responsavel" | "colaborador";

export interface UserRecord {
  name: string;
  password: string;
  role: Role;
  archived: boolean;
  createdAt: string;
  postoId?: string; // posto atribuído pela liderança
}

interface Stats {
  focacciasSold: number;
  blueLattesSold: number;
  sacosSold: number;
  totalAdded: number;
  extraRevenue: number;
  // prémios acumulados no mês (€)
  rewardFocaccia: number;
  rewardBlue: number;
  rewardSaco: number;
  month: string; // YYYY-MM
}

interface FundoNatal {
  total: number;
  year: number;
  perUserMonth: Record<string, Record<string, number>>; // user -> YYYY-MM -> €
}

const today = () => new Date().toISOString().slice(0, 10);
const monthKey = (d = new Date()) => d.toISOString().slice(0, 7);

const emptyStats = (): Stats => ({
  focacciasSold: 0,
  blueLattesSold: 0,
  sacosSold: 0,
  totalAdded: 0,
  extraRevenue: 0,
  rewardFocaccia: 0,
  rewardBlue: 0,
  rewardSaco: 0,
  month: monthKey(),
});

interface GoalsContextValue {
  user: UserRecord | null;
  isGerente: boolean;
  isLeader: boolean; // gerente OU responsavel
  users: UserRecord[];
  activeUsers: UserRecord[];
  signUp: (name: string, password: string, role?: Role) => { ok: boolean; error?: string };
  signIn: (name: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  quickSwitch: (name: string, pin: string) => { ok: boolean; error?: string };
  createUser: (name: string, password: string, role: Role) => { ok: boolean; error?: string };
  updateOwnProfile: (currentPassword: string, newName: string, newPassword: string) => { ok: boolean; error?: string };
  deleteUser: (name: string) => { ok: boolean; error?: string };
  archiveUser: (name: string) => { ok: boolean; error?: string };
  unarchiveUser: (name: string) => { ok: boolean; error?: string };
  assignPosto: (name: string, postoId: string | undefined) => void;
  stats: Record<string, Stats>;
  statsHistory: Record<string, Record<string, Stats>>;
  currentStats: Stats;
  fundoNatal: FundoNatal;
  registerPaidGoalItems: (
    items: { itemName: string; itemId: string; price: number; isUpsell: boolean; qty: number }[],
    targetUser?: string
  ) => void;
}

const GoalsContext = createContext<GoalsContextValue | null>(null);

function readUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
    // migração das versões anteriores
    for (const old of ["delta_users_v2", "delta_users_v1", "delta_goals_users_v1"]) {
      const r = localStorage.getItem(old);
      if (!r) continue;
      try {
        const parsed = JSON.parse(r);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
  } catch {}
  return [];
}

function writeUsers(list: UserRecord[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}
function readStats(): Record<string, Stats> {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || "{}"); } catch { return {}; }
}
function readHistory(): Record<string, Record<string, Stats>> {
  try { return JSON.parse(localStorage.getItem(STATS_HISTORY_KEY) || "{}"); } catch { return {}; }
}
function readFund(): FundoNatal {
  try {
    const r = localStorage.getItem(FUND_KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return { total: 0, year: new Date().getFullYear(), perUserMonth: {} };
}

const isFocaccia = (id: string, name: string) =>
  id.startsWith("focaccia-") || /focaccia/i.test(name);
const isBlueLatte = (id: string, name: string) =>
  id === "blue-latte" || /blue\s*latte/i.test(name);

export const isGoalItem = (id: string, name: string) =>
  isFocaccia(id, name) || isBlueLatte(id, name) || isSacoCafe(id, name);

function fireConfetti(festive = false) {
  const opts = { spread: 70, startVelocity: 45, particleCount: 90, origin: { y: 0.3 } };
  confetti({
    ...opts,
    colors: festive
      ? ["#c41e3a", "#0a6b2a", "#f5deb3", "#d4a017"]
      : ["#d4a017", "#1A1A1A", "#f5deb3", "#3aa76d"],
  });
}

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [statsHistory, setStatsHistory] = useState<Record<string, Record<string, Stats>>>({});
  const [fundoNatal, setFundoNatal] = useState<FundoNatal>({ total: 0, year: new Date().getFullYear(), perUserMonth: {} });

  useEffect(() => {
    const loaded = readUsers();
    // Recuperação automática: garante que o perfil de Gerente "Pedro" existe
    // (foi eliminado por acidente — repõe com permissões de gerente padrão).
    const hasPedro = loaded.some(
      (u) => u.name.toLowerCase() === "pedro" && !u.archived
    );
    let next = loaded;
    if (!hasPedro) {
      next = [
        ...loaded.filter((u) => u.name.toLowerCase() !== "pedro"),
        {
          name: "Pedro",
          password: "1234",
          role: "gerente",
          archived: false,
          createdAt: new Date().toISOString(),
        },
      ];
      writeUsers(next);
    }
    setUsers(next);
    setUserName(localStorage.getItem(SESSION_KEY));
    const s = readStats();
    setStats(s);
    const h = readHistory();
    // seed history with current month stats if missing
    for (const [name, st] of Object.entries(s)) {
      h[name] = h[name] ?? {};
      if (!h[name][st.month]) h[name][st.month] = st;
    }
    setStatsHistory(h);
    localStorage.setItem(STATS_HISTORY_KEY, JSON.stringify(h));
    setFundoNatal(readFund());
  }, []);

  const persistUsers = useCallback((list: UserRecord[]) => {
    setUsers(list); writeUsers(list);
  }, []);
  const persistStats = useCallback((next: Record<string, Stats>) => {
    setStats(next); localStorage.setItem(STATS_KEY, JSON.stringify(next));
  }, []);
  const persistHistory = useCallback((next: Record<string, Record<string, Stats>>) => {
    setStatsHistory(next); localStorage.setItem(STATS_HISTORY_KEY, JSON.stringify(next));
  }, []);
  const persistFund = useCallback((next: FundoNatal) => {
    setFundoNatal(next); localStorage.setItem(FUND_KEY, JSON.stringify(next));
  }, []);

  const user = useMemo(
    () => (userName ? users.find((u) => u.name === userName && !u.archived) ?? null : null),
    [userName, users]
  );
  const isGerente = user?.role === "gerente";
  const isLeader = user?.role === "gerente" || user?.role === "responsavel";

  const setSession = (name: string | null) => {
    if (name) localStorage.setItem(SESSION_KEY, name);
    else localStorage.removeItem(SESSION_KEY);
    setUserName(name);
  };

  const signUp = useCallback(
    (name: string, password: string, role?: Role) => {
      const trimmed = name.trim();
      if (!trimmed || !password) return { ok: false, error: "Preencha nome e password." };
      const current = readUsers();
      if (current.find((u) => u.name === trimmed))
        return { ok: false, error: "Este perfil já existe. Entre." };
      const finalRole: Role = current.length === 0 ? "gerente" : role ?? "colaborador";
      const rec: UserRecord = {
        name: trimmed, password, role: finalRole,
        archived: false, createdAt: new Date().toISOString(),
      };
      persistUsers([...current, rec]);
      setSession(trimmed);
      return { ok: true };
    },
    [persistUsers]
  );

  const signIn = useCallback((name: string, password: string) => {
    const trimmed = name.trim();
    const u = readUsers().find((x) => x.name === trimmed);
    if (!u) return { ok: false, error: "Perfil não encontrado." };
    if (u.archived) return { ok: false, error: "Conta arquivada." };
    if (u.password !== password) return { ok: false, error: "Password incorreta." };
    setSession(trimmed);
    return { ok: true };
  }, []);

  const quickSwitch = useCallback((name: string, pin: string) => {
    const u = readUsers().find((x) => x.name === name && !x.archived);
    if (!u) return { ok: false, error: "Perfil indisponível." };
    if (u.password !== pin) return { ok: false, error: "PIN incorreto." };
    setSession(name);
    toast.success(`Sessão trocada para ${name}`);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => setSession(null), []);

  const requireGerente = () => {
    const session = localStorage.getItem(SESSION_KEY);
    const u = readUsers().find((x) => x.name === session);
    return !!u && u.role === "gerente";
  };

  const requireLeader = () => {
    const session = localStorage.getItem(SESSION_KEY);
    const u = readUsers().find((x) => x.name === session);
    return !!u && (u.role === "gerente" || u.role === "responsavel");
  };

  const createUser = useCallback(
    (name: string, password: string, role: Role) => {
      // Responsáveis de turno podem criar contas (incluindo perfis de gerente,
      // mantendo as permissões padrão de gerente). Gerentes mantêm acesso total.
      if (!requireLeader()) return { ok: false, error: "Apenas liderança." };
      const trimmed = name.trim();
      if (!trimmed || !password) return { ok: false, error: "Preencha nome e password." };
      const current = readUsers();
      if (current.find((u) => u.name === trimmed))
        return { ok: false, error: "Já existe um perfil com esse nome." };
      persistUsers([...current, {
        name: trimmed, password, role, archived: false, createdAt: new Date().toISOString(),
      }]);
      return { ok: true };
    },
    [persistUsers]
  );

  const updateOwnProfile = useCallback(
    (currentPassword: string, newName: string, newPassword: string) => {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return { ok: false, error: "Sem sessão ativa." };
      const list = readUsers();
      const me = list.find((u) => u.name === session);
      if (!me) return { ok: false, error: "Conta não encontrada." };
      if (me.password !== currentPassword) return { ok: false, error: "Password atual incorreta." };
      const trimmed = newName.trim();
      if (!trimmed) return { ok: false, error: "Nome não pode ficar vazio." };
      if (!newPassword) return { ok: false, error: "Password não pode ficar vazia." };
      if (trimmed !== me.name && list.some((u) => u.name === trimmed)) {
        return { ok: false, error: "Já existe um perfil com esse nome." };
      }
      const updated: UserRecord = { ...me, name: trimmed, password: newPassword };
      const next = list.map((u) => (u.name === me.name ? updated : u));
      persistUsers(next);

      // Migrate keyed data if name changed
      if (trimmed !== me.name) {
        const s = readStats();
        if (s[me.name]) { s[trimmed] = s[me.name]; delete s[me.name]; persistStats(s); }
        const h = readHistory();
        if (h[me.name]) { h[trimmed] = h[me.name]; delete h[me.name]; persistHistory(h); }
        const f = readFund();
        if (f.perUserMonth[me.name]) {
          f.perUserMonth[trimmed] = f.perUserMonth[me.name];
          delete f.perUserMonth[me.name];
          persistFund(f);
        }
        setSession(trimmed);
      }
      return { ok: true };
    },
    [persistUsers, persistStats, persistHistory, persistFund]
  );

  const deleteUser = useCallback(
    (name: string) => {
      if (!requireGerente()) return { ok: false, error: "Apenas gerentes." };
      persistUsers(readUsers().filter((u) => u.name !== name));
      const nextStats = { ...readStats() }; delete nextStats[name];
      persistStats(nextStats);
      const f = readFund();
      delete f.perUserMonth[name];
      persistFund(f);
      if (userName === name) setSession(null);
      return { ok: true };
    },
    [persistUsers, persistStats, persistFund, userName]
  );

  const setArchived = useCallback((name: string, archived: boolean) => {
    if (!requireGerente()) return { ok: false, error: "Apenas gerentes." };
    persistUsers(readUsers().map((u) => (u.name === name ? { ...u, archived } : u)));
    if (archived && userName === name) setSession(null);
    return { ok: true };
  }, [persistUsers, userName]);

  const archiveUser = useCallback((n: string) => setArchived(n, true), [setArchived]);
  const unarchiveUser = useCallback((n: string) => setArchived(n, false), [setArchived]);

  const assignPosto = useCallback(
    (name: string, postoId: string | undefined) => {
      persistUsers(readUsers().map((u) => (u.name === name ? { ...u, postoId } : u)));
    },
    [persistUsers]
  );

  const currentStats = useMemo<Stats>(() => {
    if (!user) return emptyStats();
    const s = stats[user.name];
    if (!s || s.month !== monthKey()) return emptyStats();
    return s;
  }, [user, stats]);

  const registerPaidGoalItems = useCallback<GoalsContextValue["registerPaidGoalItems"]>(
    (items, targetUser) => {
      const ownerName = targetUser ?? user?.name;
      if (!ownerName) return;
      const allStats = readStats();
      const prev =
        allStats[ownerName] && allStats[ownerName].month === monthKey()
          ? allStats[ownerName]
          : emptyStats();
      const next: Stats = { ...prev };
      let triggered: "focaccia" | "blue" | "saco" | null = null;

      const fund = { ...readFund() };
      if (fund.year !== new Date().getFullYear()) {
        // novo ano: reset do fundo (ano civil)
        fund.year = new Date().getFullYear(); fund.total = 0; fund.perUserMonth = {};
      }
      fund.perUserMonth[ownerName] = fund.perUserMonth[ownerName] ?? {};
      const userMonthSaco = fund.perUserMonth[ownerName][monthKey()] ?? 0;
      let monthSacoAccum = userMonthSaco;

      let fundoIncrement = 0;

      for (const it of items) {
        const foc = isFocaccia(it.itemId, it.itemName);
        const blue = isBlueLatte(it.itemId, it.itemName);
        const saco = isSacoCafe(it.itemId, it.itemName);
        next.totalAdded += it.qty;
        if (it.isUpsell) next.extraRevenue += it.price * it.qty;

        if (foc) {
          next.focacciasSold += it.qty;
          const room = Math.max(0, INDIV_CAP_MONTH - next.rewardFocaccia);
          const add = Math.min(room, REWARD_FOCACCIA * it.qty);
          next.rewardFocaccia += add;
          triggered = "focaccia";
        }
        if (blue) {
          next.blueLattesSold += it.qty;
          const room = Math.max(0, INDIV_CAP_MONTH - next.rewardBlue);
          const add = Math.min(room, REWARD_BLUE * it.qty);
          next.rewardBlue += add;
          triggered = triggered ?? "blue";
        }
        if (saco) {
          next.sacosSold += it.qty;
          const room = Math.max(0, SACO_CAP_MONTH - monthSacoAccum);
          const add = Math.min(room, REWARD_SACO * it.qty);
          monthSacoAccum += add;
          next.rewardSaco += add;
          fundoIncrement += add;
          triggered = "saco";
        }
      }

      persistStats({ ...allStats, [ownerName]: next });
      // History mirror — keyed by user + month
      const hist = readHistory();
      hist[ownerName] = hist[ownerName] ?? {};
      hist[ownerName][monthKey()] = next;
      persistHistory(hist);

      if (fundoIncrement > 0) {
        fund.perUserMonth[ownerName][monthKey()] = monthSacoAccum;
        fund.total = +(fund.total + fundoIncrement).toFixed(2);
        persistFund(fund);
        fireConfetti(true);
        toast.success(
          `🎄 +${fundoIncrement.toFixed(2)}€ ao Jantar de Natal! Total da equipa: ${fund.total.toFixed(2)}€`
        );
      } else if (triggered) {
        fireConfetti();
        toast.success(
          triggered === "focaccia"
            ? "🔥 Focaccia somada ao foco do mês!"
            : "🔥 Blue Latte somado ao foco!"
        );
      }
    },
    [user, persistStats, persistFund]
  );

  const activeUsers = useMemo(() => users.filter((u) => !u.archived), [users]);

  const value = useMemo<GoalsContextValue>(
    () => ({
      user, isGerente: !!isGerente, isLeader: !!isLeader,
      users, activeUsers,
      signUp, signIn, signOut, quickSwitch,
      createUser, updateOwnProfile, deleteUser, archiveUser, unarchiveUser, assignPosto,
      stats, statsHistory, currentStats, fundoNatal,
      registerPaidGoalItems,
    }),
    [user, isGerente, isLeader, users, activeUsers, signUp, signIn, signOut, quickSwitch, createUser, updateOwnProfile, deleteUser, archiveUser, unarchiveUser, assignPosto, stats, statsHistory, currentStats, fundoNatal, registerPaidGoalItems]
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within GoalsProvider");
  return ctx;
}
