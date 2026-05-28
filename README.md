# Delta Upselling ☕ | Sistema Operacional Delta Coffee House

Bem-vindo ao **Delta Upselling**, um sistema operacional e POS companion de alto desempenho para a equipa da **Delta Coffee House - Avenida da Liberdade**. Desenvolvido com uma interface moderna, interativa e focado na otimização de vendas e gestão eficiente de equipas.

Este projeto foi construído utilizando as mais recentes tecnologias web com foco em **excelência de design (UX/UI)**, **sugestões inteligentes em tempo real** e **gestão operacional rigorosa**.

---

## ✨ Funcionalidades Principais

*   **🧠 Motor de Upselling Inteligente (Sugestões Delta)**:
    *   **Destaques do Mês**: Campanhas automáticas e integradas para impulsionar os objetivos mensais (ex: *Focaccia de Burrata* e *Blue Latte*) com frases de venda personalizadas.
    *   **Experiência Sensorial (Especialidades de Café)**: Sugere upgrades silenciosos de *Café Espresso* para métodos de extração premium (*V60 Pour-Over* ou *Chemex* para partilha), melhorando a experiência do cliente.
    *   **Cruzamento de Bebidas Refrescantes**: Recomendações dinâmicas de bebidas ácidas ou tropicais para acompanhar refeições pesadas como Hambúrgueres ou Saladas.
*   **📅 Matriz de Escala e Horários Estrita**:
    *   **Roster de 22 Colaboradores**: Gestão e alocação de postos em tempo real baseada no perfil e nas competências de cada funcionário.
    *   **Motor de Rotação de Folgas**: Algoritmo que garante estritamente 2 folgas semanais por funcionário, respeitando a escala e prevenindo que as duas *Hostess* estejam de folga no mesmo domingo.
    *   **Regras de Farda e Higiene**: Bloqueio estrito que impede que colaboradores BoH (*Back of House*, ex: Cozinheiros e Copeiros) cubram posições FoH (*Front of House*), mantendo a conformidade com normas institucionais.
*   **⏰ Gestão Dinâmica de Horários e Alertas**:
    *   Acompanhamento em tempo real do estado operacional (Abertura, Serviço Normal, Cozinha Encerrada, Fecho, Fora de Horário).
    *   **Bloqueio de Cozinha**: Desativação inteligente da adição de pratos quentes/frios após o horário de encerramento antecipado da cozinha, permitindo apenas bebidas e sacos de café.
    *   **Contingência de Cozinha**: Alertas visuais e sonoros automáticos em caso de tempos de espera elevados para pratos específicos.
*   **📊 Métricas de Performance & SLAs**:
    *   Painel detalhado com acompanhamento de faturados, taxa de conversão de upselling (meta ≥ 30%) e receitas adicionais.
    *   Monitorização de SLAs operacionais por posto (ex: Barista, Caixa, Cozinheiro, Runner) com base em timestamps de fluxo de comanda.

---

## 🚀 Tecnologias Utilizadas

1.  **React 19 & TypeScript**: Aplicação robusta de tipagem estrita para segurança de dados e interfaces reativas.
2.  **TanStack Start & Router**: Framework de última geração para routing dinâmico e carregamento de dados eficiente.
3.  **TailwindCSS v4**: Design system moderno com transições polidas, animações GPU-optimized e suporte a temas.
4.  **Lucide React**: Biblioteca de ícones moderna e consistente.
5.  **Sonner**: Sistema de notificações toast fluidos e não obstrutivos.

---

## 🛠️ Como Executar Localmente

O projeto está configurado utilizando o gestor de pacotes moderno Bun.

1.  Instale as dependências:
    ```bash
    bun install
    ```
2.  Inicie o servidor de desenvolvimento:
    ```bash
    bun run dev
    ```
3.  Aceda à aplicação no seu navegador em `http://localhost:3000`.

---

## 📜 Licença

Desenvolvido para **Delta Coffee House - Avenida da Liberdade** por [Pedro Monteiro](https://github.com/PedroMonteiro94).
