# Sistema Operacional de Cafetaria — Plano de Implementação

Este é um pedido grande (8 módulos interligados). Proponho construir em **3 fases incrementais**, todas em frontend (localStorage), reaproveitando o `GoalsProvider` já existente. Sem backend novo.

---

## Fase 1 — Núcleo de dados, horários, contas e mesas

**Novos ficheiros**
- `src/lib/schedule.ts` — horários loja/staff (Seg-Sáb 08:00–22:30 / Dom 09:00–20:00), `isKitchenOpen()`, `isServiceWindow()`, `isPreOpening()`.
- `src/lib/roster.ts` — 22 colaboradores fixos com `posto` (cozinheiro, copeiro, barista, caixa, sala, hostess, runner, responsavel), gerador de matriz de folgas semanal (estritamente 2/semana, rotação Sáb-Dom-Seg cruzada, exceção Hostess Dom-Seg-Ter alternada).
- `src/lib/tables.ts` — zonas Esplanada (501–505), Área 2 (301–307), Área 1 (201–224).

**Atualizar `src/lib/goals.tsx`**
- Adicionar role `"responsavel"` (3 utilizadores), PIN de 4 dígitos.
- Banners de janela operacional + bloqueio cozinha.

## Fase 2 — Multi-pedidos, KDS por praças e fluxo 3 etapas

**Novos ficheiros**
- `src/lib/orders.tsx` — store global (Context) com múltiplas comandas abertas por mesa, linhas com `status` registado/entregue/pago, timestamps por etapa, classificação `praca: "quente" | "fria" | "bebida"`, cálculo de tempo médio Praça Quente + flag de contingência (>10 min).
- `src/components/TableSelector.tsx` — grelha tátil das 3 zonas.
- `src/components/KitchenMonitor.tsx` — KDS dividido por praças com cronómetros.
- `src/components/OrdersTab.tsx` — lista de comandas abertas, avanço de estado 3 etapas.

**Atualizar `src/data/menu.ts`**
- Marcar cada item com `praca` e `kitchen: boolean` (para bloqueio cozinha).
- Adicionar "Saco de Café 250gr" (objetivo cooperativo).

**Atualizar `src/routes/index.tsx`**
- Fluxo: escolher mesa → criar/abrir comanda → adicionar itens (com bloqueio cozinha por horário) → avançar etapas.
- Banner amarelo de contingência Praça Quente.

## Fase 3 — Staff, alocação, SLAs, gamificação financeira

**Novos ficheiros**
- `src/components/StaffTab.tsx` — só liderança (gerente + responsável). Ranking, semáforos SLA por posto, motor de sugestões de alocação com justificação textual (regra de farda: cozinheiro/copeiro nunca fora da cozinha; só baristas de apoio, caixas e responsáveis podem cobrir sala).
- `src/components/ScheduleGrid.tsx` — grelha semanal com folgas geradas pela matriz.
- `src/components/RewardsPanel.tsx` — prémios individuais (+1€ Focaccia / +0,50€ Blue Latte, teto 50€/mês cada) e Fundo Natal (+1,50€ por saco, teto individual 100€/mês, total potencial 700€) com pop-up reativo + barra festiva.

**Atualizar `src/lib/goals.tsx`**
- `registerPaidGoalItems` calcula prémios financeiros aplicando tetos mensais.
- `fundoNatal` persistente anual em `localStorage` (sem reset mensal).

**Atualizar `src/components/BottomNav.tsx`**
- Tabs: Menu, Pedidos, Cozinha, Staff (gated), Prémios.

---

## Detalhes técnicos chave

```text
Roles:      gerente(1) | responsavel(3) | colaborador(18)
Postos:     cozinheiro, copeiro, barista, caixa, sala, hostess, runner
Farda FoH:  barista, caixa, sala, hostess, runner, responsavel  ← cobertura sala
Farda BoH:  cozinheiro, copeiro                                  ← BLOQUEADOS fora cozinha

Matriz folgas (estrita 2/sem):
  Semana A: Sáb + Dom
  Semana B: Seg + Dom        (compensação cruzada)
  Hostess A: Dom + Seg
  Hostess B: Dom + Ter       (nunca ambas no Domingo)

Bloqueio cozinha:
  Seg-Sáb ≥ 22:00 → só bebidas + sacos café
  Dom    ≥ 19:30 → só bebidas + sacos café

Fluxo pedido: registado → entregue (timestamp SLA) → pago (gera prémio)
SLA:  caixa<90s · barista latte<3m / filtro<5m · cozinha quente<10m frio<6m · sala conv≥30% · runner<10m
```

Persistência: tudo em `localStorage` (chaves versionadas). Sem migração de schema Supabase neste plano.

---

## Pergunta antes de implementar

A fase 3 (motor de sugestões + premiação financeira) é a mais densa. Confirma se queres tudo num só passo, ou preferes que eu pare após a Fase 2 para validares antes de avançar para o Staff/Prémios?