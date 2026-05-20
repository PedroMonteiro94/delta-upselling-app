# Gourmet Bites 🍽️ | Alta Gastronomia ao seu Dispor

Bem-vindo ao **Gourmet Bites**, uma aplicação web single-page (SPA) de alta performance e visual premium, focada na encomenda de pratos gourmet e na personalização interativa de criações do Chef com ingredientes biológicos de produtores locais sustentáveis.

Este projeto foi construído do zero com foco em **excelência de design (UX/UI)**, **interatividade viva** e **segurança avançada** (com uma política CSP rígida e proteção integrada contra injeções de script XSS).

---

## ✨ Funcionalidades Principais

*   **🎨 Experiência Estética Premium (Dark Mode Default)**: Design sofisticado, tipografia elegante (fontes *Outfit* e *Playfair Display* da Google Fonts) e estética de vidro polido (*glassmorphism*) adaptada tanto para modos escuros como claros.
*   **🍕 Criador de Pratos Interativo ("Obra-Prima do Chef")**: Permite selecionar bases, proteínas e guarnições gourmet num formulário integrado que gera representações dinâmicas sobre um prato cerâmico virtual, calculando os custos estimados em tempo real.
*   **🍜 Menu Gourmet Dinâmico**: Menu dividido por abas com filtros rápidos animados (Entradas, Pratos Principais, Sobremesas, Bebidas) e cartões detalhados.
*   **🛒 Carrinho Lateral Deslizante**: Painel fluido para gerir quantidades, aplicar códigos promocionais (ex: `GOURMET20` para 20% de desconto) e recalcular taxas automaticamente.
*   **💳 Checkout em Vidro Fluido (Simulação Dinâmica)**: Formulário elegante com validações inteligentes e formatador em tempo real de dados de pagamento (MB Way / Cartão de Crédito).
*   **🚚 Acompanhamento de Pedido Progressivo**: Um ecrã de sucesso que simula a preparação pelo Chef e a rota de entrega em tempo real através de uma barra de progresso viva.
*   **🔔 Sistema de Notificações Toast**: Toast de alertas flutuantes e elegantes para interações e feedback das ações do utilizador.
*   **🔒 Segurança Nativa Extrema**: Arquitetura livre de manipulações de string inseguras (`innerHTML`) que mitiga por completo riscos de XSS, com uma Content Security Policy (CSP) integrada.

---

## 🚀 Tecnologias Utilizadas

1.  **HTML5 Semântico**: Estrutura robusta e acessível.
2.  **Vanilla CSS3**: Design system modular baseado em CSS Custom Properties (Variáveis), transições suaves e animações baseadas em `@keyframes` otimizadas para GPU.
3.  **Vanilla JavaScript (ES6+)**: Gestão de estado na memória, manipulação dinâmica e segura do DOM utilizando APIs estruturadas (`document.createElement` / `replaceChildren` / `DOMParser`).

---

## 🛠️ Como Iniciar Localmente

Para correr o projeto na sua máquina local, não necessita de nenhuma base de dados ou dependência pesada.

1.  Clone este repositório ou faça download da pasta do projeto.
2.  Abra o ficheiro [index.html](index.html) diretamente no seu navegador de preferência ou, preferencialmente, corra-o utilizando uma extensão de servidor local (como *Live Server* do VS Code ou `npx serve .`).
3.  **Nota**: Devido à política rígida de segurança CSP configurada para bloquear inline scripts e proteger o site de ataques, o projeto deve ser executado num contexto de servidor Web local para melhor compatibilidade de recursos adicionais.

### 🎫 Cupão de Teste
Experimente adicionar itens ao carrinho e aplique o seguinte cupão na secção de descontos para ver o cálculo dinâmico:
*   `GOURMET20` — Garante **20% de desconto** imediato sobre o subtotal!

---

## 📜 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se à vontade para utilizar, estudar ou estender o código!

Desenvolvido com 💛 por [Pedro Monteiro](https://github.com/PedroMonteiro94).
