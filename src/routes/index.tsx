import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Trophy, Users, AlertTriangle, Lock, UserCog, GlassWater, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/toaster";
import { categories, menu, type Category, type MenuItem, type Subcategory } from "@/data/menu";
import { MenuItemCard } from "@/components/MenuItemCard";
import { UpsellSheet, type UpsellSuggestion } from "@/components/UpsellSheet";
import { CoffeeCustomizerSheet } from "@/components/CoffeeCustomizerSheet";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { GoalsModal } from "@/components/GoalsModal";
import { UserManagementModal } from "@/components/UserManagementModal";
import { QuickSwitchModal } from "@/components/QuickSwitchModal";
import { MyAccountModal } from "@/components/MyAccountModal";
import { TableSelectorModal } from "@/components/TableSelectorModal";
import { KitchenMonitor } from "@/components/KitchenMonitor";
import { OrdersTab } from "@/components/OrdersTab";
import { StaffTab } from "@/components/StaffTab";
import { RewardsPanel } from "@/components/RewardsPanel";
import { MetricsPanel } from "@/components/MetricsPanel";
import { useGoals } from "@/lib/goals";
import { useOrders } from "@/lib/orders";
import { isKitchenItem } from "@/lib/classify";
import { isKitchenOpen, operationalLabel } from "@/lib/schedule";

// Goal items for upsell rotation (Focaccia + Blue Latte = objetivos do mês)
const GOAL_FOCACCIA_ID = "focaccia-burrata";
const GOAL_BLUE_LATTE_ID = "blue-latte";

function isPratoPesado(item: MenuItem): boolean {
  if (item.subcategoria === "Hamburguers") return true;
  if (item.subcategoria === "Ovos" && item.id !== "iogurte-granola") return true;
  if (["prego", "club-sandwich", "focaccia-mortadela"].includes(item.id)) return true;
  return false;
}

function pickGoalSuggestion(item: MenuItem): UpsellSuggestion | null {
  const isFoc = /^focaccia-/.test(item.id);
  const isBlue = item.id === GOAL_BLUE_LATTE_ID;
  const heavy = isPratoPesado(item);
  
  if (heavy) return null; // Heavy dishes will get fresh juices instead of Blue Latte / Focaccia
  
  let goalId = GOAL_BLUE_LATTE_ID;
  if (isBlue) goalId = GOAL_FOCACCIA_ID;
  
  if (goalId === item.id) return null;
  const g = menu.find((m) => m.id === goalId);
  if (!g) return null;
  const fraseFocaccia = `Aproveite para experimentar a nossa ${g.nome} — focaccia artesanal italiana, é o destaque do mês. Junto?`;
  const fraseBlue = `E que tal o nosso Blue Latte? Espresso, leite vaporizado e spirulina azul — assinatura Delta e estrela do mês. Adiciono?`;
  return {
    kind: "goal",
    id: g.id,
    nome: g.nome,
    preco: g.preco,
    categoria: g.categoria,
    subcategoria: g.subcategoria,
    frase_venda: goalId === GOAL_BLUE_LATTE_ID ? fraseBlue : fraseFocaccia,
  };
}

function pairingSuggestion(item: MenuItem): UpsellSuggestion {
  return {
    kind: "pairing",
    id: `${item.id}__pair`,
    nome: item.pairing.nome,
    preco: item.pairing.preco,
    categoria: item.categoria,
    subcategoria: item.subcategoria,
    frase_venda: item.pairing.frase_venda,
  };
}
// Sugestões de experiência sensorial — apenas troca silenciosa do item no carrinho,
// sem qualquer menção a preço, upgrade ou diferencial.
function espressoExperienceSuggestions(): UpsellSuggestion[] {
  const v60 = menu.find((m) => m.id === "v60-pour-over");
  const chemex = menu.find((m) => m.id === "chemex-partilha");
  const list: UpsellSuggestion[] = [];
  if (v60) {
    list.push({
      kind: "experience",
      id: v60.id,
      nome: v60.nome,
      preco: v60.preco,
      categoria: v60.categoria,
      subcategoria: v60.subcategoria,
      badgeLabel: "Mesa individual · ritual aromático",
      ctaLabel: "Preparar V60 na mesa",
      frase_venda:
        "Sugerir V60 preparado na mesa se o cliente tiver tempo para uma experiência aromática, leve e frutada, ideal para começar o dia com calma.",
    });
  }
  if (chemex) {
    list.push({
      kind: "experience",
      id: chemex.id,
      nome: chemex.nome,
      preco: chemex.preco,
      categoria: chemex.categoria,
      subcategoria: chemex.subcategoria,
      badgeLabel: "Mesa de grupo · partilha em jarra",
      ctaLabel: "Preparar Chemex para partilhar",
      frase_venda:
        "Sugerir a partilha de uma Chemex servida em jarra de vidro na mesa, destacando que é uma extração suave e limpa, perfeita para acompanhar a pastelaria e prolongar a conversa.",
    });
  }
  return list;
}


// Bebidas dedicadas para hamburguers e saladas (sem focaccia/blue latte)
function refreshingDrinksSuggestions(item: MenuItem): UpsellSuggestion[] {
  const limonada: UpsellSuggestion = {
    kind: "goal", // usa o destaque visual (accent) — limonada é a aposta principal
    id: "drink-limonada-hortela",
    nome: "Limonada c/ Hortelã",
    preco: 3.2,
    categoria: "Bebidas" as MenuItem["categoria"],
    subcategoria: item.subcategoria,
    frase_venda:
      "Leve, ácida e refrescante — a nossa Limonada com Hortelã limpa o palato e equilibra na perfeição. Junto?",
    badgeLabel: "Recomendação do chef · refrescante",
  };
  const abacaxiCoco: UpsellSuggestion = {
    kind: "pairing",
    id: "drink-abacaxi-coco",
    nome: "Sumo de Abacaxi & Côco",
    preco: 4.2,
    categoria: "Bebidas" as MenuItem["categoria"],
    subcategoria: item.subcategoria,
    frase_venda:
      "Tropical e cremoso — abacaxi natural com leite de côco, um final exótico que combina lindamente. Aceita?",
    badgeLabel: "Alternativa tropical",
  };
  return [limonada, abacaxiCoco];
}


export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    meta: [
      { title: "Delta POS · Avenida da Liberdade" },
      { name: "description", content: "Sistema operacional Delta Coffee House — Avenida da Liberdade." },
    ],
  }),
});

function App() {
  const [activeCat, setActiveCat] = useState<Category>("Refeições");
  const [activeSub, setActiveSub] = useState<Subcategory>("Hamburguers");
  const [upsellItem, setUpsellItem] = useState<MenuItem | null>(null);
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null);
  const [tab, setTab] = useState<Tab>("menu");
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [mgmtOpen, setMgmtOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { user, isLeader, isGerente } = useGoals();
  const { activeOrder, openOrder, addLine, swapLineItem, orders, hotContingency } = useOrders();

  const kitchenOpen = isKitchenOpen();
  const opStatus = operationalLabel();

  const currentCategory = categories.find((c) => c.name === activeCat)!;
  const filtered = useMemo(
    () => menu.filter((m) => m.categoria === activeCat && m.subcategoria === activeSub),
    [activeCat, activeSub]
  );

  const handleSelectCategory = (cat: Category) => {
    setActiveCat(cat);
    setActiveSub(categories.find((c) => c.name === cat)!.subcategories[0]);
  };

  const ensureOrder = (): string | null => {
    if (activeOrder) return activeOrder.id;
    // Fallback: comanda balcão = 0
    return openOrder(0);
  };

  // ID da linha acabada de registar (necessário para a troca silenciosa de Experiência).
  const [lastLineId, setLastLineId] = useState<string | null>(null);

  const handleItemTap = (item: MenuItem) => {
    if (!kitchenOpen && isKitchenItem(item) && !isGerente) {
      toast.error("Cozinha encerrada · só bebidas e sacos de café disponíveis");
      return;
    }
    const isCoffeeItem =
      item.categoria === "Cafetaria" &&
      (item.subcategoria === "Café em Espresso" ||
        item.subcategoria === "Café de Filtro" ||
        (item.subcategoria === "Campanhas" && !item.id.startsWith("saco-")));

    if (isCoffeeItem) {
      setCustomizerItem(item);
      return;
    }

    const orderId = ensureOrder();
    if (!orderId) return;
    addLine(orderId, item, { ownerUser: user?.name });
    // Captura a última linha após o estado se atualizar (microtask). A nossa addLine agrupa
    // por itemId em estado "registado", por isso encontrar a linha pelo itemId é fiável.
    queueMicrotask(() => {
      const ord = orders.find((o) => o.id === orderId);
      const line = ord?.lines.find((l) => l.itemId === item.id && l.status === "registado");
      setLastLineId(line?.id ?? null);
    });
    setUpsellItem(item);
  };

  const handleConfirmCustomizer = (grain: any, milk: any) => {
    if (!customizerItem) return;
    const orderId = ensureOrder();
    if (!orderId) return;

    // Create customized item
    const customId = `${customizerItem.id}__${grain.id}__${milk?.id ?? 'plain'}`;
    const customName = `${customizerItem.nome} [${grain.nome}${milk ? `, ${milk.nome}` : ""}]`;
    const customPrice = customizerItem.preco + grain.adicional + (milk?.adicional ?? 0);

    const customItem = {
      ...customizerItem,
      id: customId,
      nome: customName,
      preco: customPrice,
    };

    addLine(orderId, customItem, { ownerUser: user?.name });

    // Capture last line ID for silent experience switch (upselling)
    queueMicrotask(() => {
      const ord = orders.find((o) => o.id === orderId);
      const line = ord?.lines.find((l) => l.itemId === customId && l.status === "registado");
      setLastLineId(line?.id ?? null);
    });

    setUpsellItem(customItem);
    setCustomizerItem(null);
  };

  const upsellSuggestions = useMemo<UpsellSuggestion[]>(() => {
    if (!upsellItem) return [];
    // Café em Espresso (consumo em sala): experiência sensorial — troca silenciosa para V60/Chemex.
    if (upsellItem.subcategoria === "Café em Espresso") {
      return espressoExperienceSuggestions();
    }
    // Pratos pesados (hambúrgueres, sandes pesadas, ovos): só bebidas refrescantes (sumos frescos em destaque)
    if (isPratoPesado(upsellItem) || upsellItem.subcategoria === "Saladas") {
      return refreshingDrinksSuggestions(upsellItem);
    }
    const list: UpsellSuggestion[] = [];
    const goal = pickGoalSuggestion(upsellItem);
    if (goal) list.push(goal);
    list.push(pairingSuggestion(upsellItem));
    return list;
  }, [upsellItem]);

  const isEspressoExperience = upsellItem?.subcategoria === "Café em Espresso";

  const handleAcceptUpsell = (s: UpsellSuggestion) => {
    if (!upsellItem || !activeOrder) return;
    // Troca silenciosa: substitui o espresso registado pelo ritual de filtro escolhido.
    if (s.kind === "experience") {
      // Tenta usar a linha capturada; caso falhe, procura pelo itemId do espresso original.
      let lineId = lastLineId;
      if (!lineId) {
        const found = activeOrder.lines.find(
          (l) => l.itemId === upsellItem.id && l.status === "registado"
        );
        lineId = found?.id ?? null;
      }
      if (lineId) {
        swapLineItem(activeOrder.id, lineId, {
          id: s.id,
          nome: s.nome,
          preco: s.preco,
          subcategoria: s.subcategoria,
          categoria: s.categoria,
        });
      }
      setUpsellItem(null);
      setLastLineId(null);
      return;
    }
    addLine(
      activeOrder.id,
      {
        id: s.id,
        nome: s.nome,
        preco: s.preco,
        subcategoria: s.subcategoria,
        categoria: s.categoria,
      } as any,
      { isUpsell: true, ownerUser: user?.name }
    );
    toast.success(`${s.nome} adicionado`);
    setUpsellItem(null);
  };


  const orderCount = orders.filter((o) => !o.closedAt).reduce((s, o) => s + o.lines.length, 0);
  const activeTotal = activeOrder?.lines.reduce((s, l) => s + l.preco * l.qty, 0) ?? 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      <Toaster position="top-center" />

      <header className="bg-gradient-to-br from-primary to-espresso text-primary-foreground">
        <div className="mx-auto max-w-md px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent">
                Delta Coffee House
              </p>
              <h1 className="mt-1 font-display text-xl leading-tight">Sistema Operacional</h1>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-primary-foreground/70">
                <MapPin className="h-3 w-3" />
                Avenida da Liberdade
                {user && (
                  <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent">
                    {user.name} · {user.role}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setQuickOpen(true)}
                  className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-2 text-primary-foreground/80 active:scale-[0.97]"
                  aria-label="Troca rápida"
                >
                  <Users className="h-4 w-4" />
                </button>
                {user && (
                  <button
                    onClick={() => setAccountOpen(true)}
                    className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-2 text-primary-foreground/80 active:scale-[0.97]"
                    aria-label="Minha conta"
                  >
                    <UserCog className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setGoalsOpen(true)}
                  className="flex items-center gap-1 rounded-xl border border-accent/50 bg-accent/15 px-2.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-accent active:scale-[0.97]"
                >
                  <Trophy className="h-4 w-4" />
                  Objetivos
                </button>
              </div>
              <button
                onClick={() => setTablesOpen(true)}
                className="rounded-xl border border-accent/30 bg-primary-foreground/5 px-3 py-1.5 text-right active:scale-[0.97]"
              >
                <p className="text-[9px] uppercase tracking-wider text-primary-foreground/60">
                  {activeOrder ? `Mesa ${activeOrder.mesa === 0 ? "Balcão" : activeOrder.mesa}` : "Escolher mesa"}
                </p>
                <p className="font-display text-base font-semibold text-accent">
                  {activeTotal.toFixed(2)} €
                </p>
              </button>
            </div>
          </div>

          <div
            className="mt-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold"
            style={{
              background:
                opStatus.tone === "ok"
                  ? "oklch(0.55 0.13 150 / 0.20)"
                  : opStatus.tone === "warn"
                  ? "oklch(0.78 0.16 80 / 0.20)"
                  : "oklch(0.55 0.18 25 / 0.20)",
            }}
          >
            {!kitchenOpen && <Lock className="h-3 w-3" />}
            <span>{opStatus.label}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pt-5">
        {hotContingency && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border-2 p-3"
               style={{ borderColor: "oklch(0.78 0.16 80)", background: "oklch(0.96 0.08 80)" }}>
            <AlertTriangle className="h-4 w-4 mt-0.5 text-[oklch(0.55_0.16_60)] shrink-0" />
            <p className="text-[11px] font-semibold text-[oklch(0.30_0.12_60)]">
              Espera elevada para Ovos/Panquecas · sugira Focaccias ou Iogurtes
            </p>
          </div>
        )}

        {tab === "menu" && (
          <>
            <div className="-mx-5 overflow-x-auto px-5 pb-4 scrollbar-none">
              <div className="flex gap-2">
                {categories.map((c) => {
                  const active = c.name === activeCat;
                  return (
                    <button
                      key={c.name}
                      onClick={() => handleSelectCategory(c.name)}
                      className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-semibold transition-all ${
                        active ? "border-transparent text-primary-foreground shadow-[var(--shadow-card)]" : "border-border bg-card text-foreground"
                      }`}
                      style={active ? { backgroundColor: `var(--${c.accent})` } : undefined}
                    >
                      <span className="mr-1.5">{c.emoji}</span>{c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="-mx-5 overflow-x-auto px-5 pb-3 scrollbar-none">
              <div className="flex gap-2">
                {currentCategory.subcategories.map((sub) => {
                  const active = sub === activeSub;
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveSub(sub)}
                      className={`whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                        active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              {filtered.map((item) => {
                const locked = !kitchenOpen && isKitchenItem(item) && !isGerente;
                return (
                  <div key={item.id} className={locked ? "opacity-50 pointer-events-none" : ""}>
                    <MenuItemCard
                      item={item}
                      accentVar={categories.find((c) => c.name === item.categoria)!.accent}
                      onTap={() => handleItemTap(item)}
                    />
                    {locked && (
                      <p className="mt-1 flex items-center gap-1 px-2 text-[10px] text-destructive">
                        <Lock className="h-3 w-3" /> Cozinha encerrada
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "order" && <OrdersTab onOpenTables={() => setTablesOpen(true)} />}
        {tab === "kitchen" && <KitchenMonitor />}
        {tab === "staff" && <StaffTab />}
        {tab === "metrics" && <MetricsPanel />}
        {tab === "tips" && <RewardsPanel />}
        {tab === "bar" && <BarTab handleItemTap={handleItemTap} />}
        {tab === "maintenance" && <MaintenanceTab />}
      </main>

      <CoffeeCustomizerSheet
        item={customizerItem}
        onConfirm={handleConfirmCustomizer}
        onDismiss={() => setCustomizerItem(null)}
      />

      <UpsellSheet
        item={upsellItem}
        suggestions={upsellSuggestions}
        onAdd={handleAcceptUpsell}
        onDismiss={() => setUpsellItem(null)}
        experienceTitle={isEspressoExperience ? "Partilhar Experiência Delta Specialty" : undefined}
      />


      <GoalsModal
        open={goalsOpen}
        onClose={() => setGoalsOpen(false)}
        onOpenManagement={() => setMgmtOpen(true)}
        onOpenQuickSwitch={() => setQuickOpen(true)}
      />
      <UserManagementModal open={mgmtOpen} onClose={() => setMgmtOpen(false)} />
      <QuickSwitchModal open={quickOpen} onClose={() => setQuickOpen(false)} />
      <MyAccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
      <TableSelectorModal open={tablesOpen} onClose={() => setTablesOpen(false)} />

      <BottomNav
        active={tab}
        onChange={setTab}
        orderCount={orderCount}
        isLeader={isLeader}
        isGerente={isGerente}
        hotAlert={hotContingency}
      />
    </div>
  );
}

const BAR_ITEMS = [
  { id: "aperol-spritz", nome: "Aperol Spritz", preco: 12.0, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "spritz-delta", nome: "Spritz Delta da Casa", preco: 8.5, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "porto-tonico", nome: "Porto Tónico", preco: 14.0, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "mimosa", nome: "Mimosa", preco: 10.0, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "espresso-martini", nome: "Espresso Martini", preco: 10.0, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "vinho-branco", nome: "Vinho Branco da Casa", preco: 4.5, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "drink-limonada-hortela", nome: "Limonada c/ Hortelã", preco: 3.2, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "drink-abacaxi-coco", nome: "Sumo de Abacaxi & Côco", preco: 4.2, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "sumo-laranja", nome: "Sumo de Laranja Natural", preco: 3.8, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
  { id: "why-not-soda", nome: "Craft Soda [WHY NOT]", preco: 4.0, categoria: "Refeições" as const, subcategoria: "Sandes e Foccacias" as const, pairing: { nome: "", frase_venda: "", preco: 0 } },
];

function BarTab({ handleItemTap }: { handleItemTap: (item: any) => void }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl flex items-center gap-2">
          <GlassWater className="h-6 w-6 text-accent" />
          Menu de Bebidas & Bar
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Registo rápido de bebidas frescas, refrigerantes e cocktails
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {BAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              handleItemTap(item);
              toast.success(`${item.nome} adicionado`);
            }}
            className="flex flex-col text-left p-4 bg-card border border-border rounded-2xl hover:bg-secondary/40 active:scale-[0.98] transition-all shadow-[var(--shadow-card)]"
          >
            <span className="font-semibold text-sm text-foreground truncate w-full">{item.nome}</span>
            <span className="text-xs font-bold text-accent mt-2">{item.preco.toFixed(2)} €</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function MaintenanceTab() {
  const handleReset = () => {
    if (confirm("Tens a certeza que desejas apagar todos os dados operacionais (LocalStorage)?")) {
      localStorage.clear();
      toast.success("Dados operacionais reiniciados. Recarrega a página.");
      window.location.reload();
    }
  };

  const handleSeed = () => {
    localStorage.removeItem("delta_demo_initialized_v1");
    toast.success("Dados de demonstração reiniciados!");
    window.location.reload();
  };

  // Mock security audit log
  const auditLogs = [
    { time: "20:12", event: "Login bem-sucedido", user: "Ana Costa", detail: "Papel: Gerente. IP: 192.168.1.45" },
    { time: "19:45", event: "Rotação de Postos da Cozinha", user: "Ana Costa", detail: "Quentes -> Frios -> Produção -> Copa" },
    { time: "19:30", event: "Fecho de Turno / Caixa", user: "Pedro Oliveira", detail: "Comanda o-3 fechada e paga" },
    { time: "19:15", event: "Criação de Utilizador", user: "Pedro Oliveira", detail: "Novo colaborador 'João Antunes' adicionado" },
    { time: "18:00", event: "Persistência global efectuada", user: "Sistema", detail: "Backup de LocalStorage sincronizado com sucesso" },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl flex items-center gap-2 text-destructive">
          <Wrench className="h-6 w-6" />
          Menu de Manutenção & Zeladoria
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Painel restrito à Gerência · Auditoria e Ações de Sistema
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Ações Rápidas de Sistema</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSeed}
            className="rounded-xl bg-accent text-accent-foreground px-4 py-3 text-xs font-semibold hover:bg-accent/90 active:scale-95 transition-all"
          >
            Repor Dados de Demo
          </button>
          <button
            onClick={handleReset}
            className="rounded-xl bg-destructive text-destructive-foreground px-4 py-3 text-xs font-semibold hover:bg-destructive/90 active:scale-95 transition-all"
          >
            Limpar Todo o Armazenamento
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Registo de Auditoria de Segurança</h3>
        <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
          {auditLogs.map((log, index) => (
            <div key={index} className="text-[11px] border-b border-border/40 pb-2 flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{log.event}</p>
                <p className="text-muted-foreground mt-0.5">{log.detail} · Por {log.user}</p>
              </div>
              <span className="font-mono text-muted-foreground shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
