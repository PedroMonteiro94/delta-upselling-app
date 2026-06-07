import { menu } from "@/data/menu";

const DEMO_INITIALIZED = "delta_demo_initialized_v1";

export function initializeDemoData() {
  if (localStorage.getItem(DEMO_INITIALIZED)) {
    return; // já foi inicializado
  }

  // Criar usuários demo
  const users = [
    { name: "João Silva", password: "1234", role: "colaborador" as const, archived: false, createdAt: new Date().toISOString() },
    { name: "Maria Santos", password: "1234", role: "colaborador" as const, archived: false, createdAt: new Date().toISOString() },
    { name: "Pedro Oliveira", password: "1234", role: "responsavel" as const, archived: false, createdAt: new Date().toISOString() },
    { name: "Ana Costa", password: "1234", role: "gerente" as const, archived: false, createdAt: new Date().toISOString() },
  ];

  localStorage.setItem("delta_users_v3", JSON.stringify(users));

  // Criar pedidos de demonstração
  const now = Date.now();
  const orders = [
    {
      id: `o-${now}-1`,
      mesa: 1,
      createdAt: now - 900000, // 15 minutos atrás
      closedAt: undefined,
      lines: [
        {
          id: `l-${now}-1-1`,
          itemId: "hamburguer-novilho-bacon",
          nome: "Hambúrguer de Novilho com Bacon",
          preco: 13.0,
          qty: 1,
          isUpsell: false,
          praca: "quente",
          status: "entregue" as const,
          registadoAt: now - 900000,
          entregueAt: now - 600000,
        },
        {
          id: `l-${now}-1-2`,
          itemId: "blue-latte",
          nome: "Blue Latte",
          preco: 5.5,
          qty: 1,
          isUpsell: true,
          praca: "bebida",
          status: "pago" as const,
          registadoAt: now - 900000,
          entregueAt: now - 800000,
          pagoAt: now - 600000,
          ownerUser: "João Silva",
        },
      ],
    },
    {
      id: `o-${now}-2`,
      mesa: 3,
      createdAt: now - 600000, // 10 minutos atrás
      closedAt: undefined,
      lines: [
        {
          id: `l-${now}-2-1`,
          itemId: "focaccia-burrata",
          nome: "Focaccia de Burrata",
          preco: 9.5,
          qty: 2,
          isUpsell: false,
          praca: "quente",
          status: "registado" as const,
          registadoAt: now - 600000,
          ownerUser: "Maria Santos",
        },
        {
          id: `l-${now}-2-2`,
          itemId: "cappuccino",
          nome: "Cappuccino",
          preco: 4.0,
          qty: 2,
          isUpsell: false,
          praca: "bebida",
          status: "registado" as const,
          registadoAt: now - 600000,
          ownerUser: "Maria Santos",
        },
      ],
    },
    {
      id: `o-${now}-3`,
      mesa: 5,
      createdAt: now - 300000, // 5 minutos atrás
      closedAt: undefined,
      lines: [
        {
          id: `l-${now}-3-1`,
          itemId: "salada-kale",
          nome: "Salada de Kale e Quinoa",
          preco: 12.0,
          qty: 1,
          isUpsell: false,
          praca: "fria",
          status: "registado" as const,
          registadoAt: now - 300000,
          ownerUser: "Pedro Oliveira",
        },
      ],
    },
  ];

  localStorage.setItem("delta_orders_v1", JSON.stringify(orders));

  // Criar stats de demonstração
  const currentMonth = new Date().toISOString().slice(0, 7);
  const stats: Record<string, any> = {};

  users.forEach((user) => {
    stats[user.name] = {
      focacciasSold: Math.floor(Math.random() * 20) + 5,
      blueLattesSold: Math.floor(Math.random() * 15) + 3,
      sacosSold: Math.floor(Math.random() * 10) + 2,
      totalAdded: 0,
      extraRevenue: 0,
      rewardFocaccia: 0,
      rewardBlue: 0,
      rewardSaco: 0,
      month: currentMonth,
    };
  });

  localStorage.setItem("delta_goals_stats_v2", JSON.stringify(stats));

  // Criar histórico de stats
  const statsHistory: Record<string, any> = {};
  const previousMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .slice(0, 7);

  users.forEach((user) => {
    statsHistory[user.name] = {
      [previousMonth]: {
        focacciasSold: Math.floor(Math.random() * 25) + 10,
        blueLattesSold: Math.floor(Math.random() * 20) + 8,
        sacosSold: Math.floor(Math.random() * 15) + 5,
        totalAdded: 0,
        extraRevenue: 0,
        rewardFocaccia: Math.floor(Math.random() * 25),
        rewardBlue: Math.floor(Math.random() * 15),
        rewardSaco: Math.floor(Math.random() * 20),
        month: previousMonth,
      },
      [currentMonth]: stats[user.name],
    };
  });

  localStorage.setItem("delta_goals_stats_history_v1", JSON.stringify(statsHistory));

  // Criar Fundo Natal de demonstração
  const fundoNatal = {
    total: 0,
    year: new Date().getFullYear(),
    perUserMonth: {} as Record<string, Record<string, number>>,
  };

  users.forEach((user) => {
    fundoNatal.perUserMonth[user.name] = {
      [previousMonth]: Math.floor(Math.random() * 50) + 20,
      [currentMonth]: Math.floor(Math.random() * 40) + 15,
    };
    fundoNatal.total = Object.values(fundoNatal.perUserMonth)
      .flatMap((months) => Object.values(months))
      .reduce((a, b) => a + b, 0);
  });

  localStorage.setItem("delta_fundo_natal_v1", JSON.stringify(fundoNatal));

  // Marcar como inicializado
  localStorage.setItem(DEMO_INITIALIZED, "true");
}
