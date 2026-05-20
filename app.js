/* ==========================================================================
   Gourmet Bites Application Logic (projeto_food1)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // Application Constants & State
    // ==========================================================================

    const MENU_ITEMS = [
        {
            id: 'starter_bruschetta',
            category: 'starters',
            title: 'Bruschetta de Figo e Prosciutto',
            description: 'Figo caramelizado, queijo de cabra artesanal, presunto de Parma crocante e redução de balsâmico sobre pão sourdough.',
            price: 8.50,
            tag: 'Chef Signature',
            svgColor: '#D4AF37'
        },
        {
            id: 'starter_tataki',
            category: 'starters',
            title: 'Tataki de Atum com Sésamo',
            description: 'Lombo de atum fresco selado em crosta de sésamo, puré suave de abacate, Wasabi e redução de molho Ponzu trufado.',
            price: 11.50,
            tag: 'Fresco',
            svgColor: '#C85A32'
        },
        {
            id: 'main_salmon',
            category: 'mains',
            title: 'Salmão Wellington Supremo',
            description: 'Lombo de salmão fresco envolto em massa folhada crocante com cogumelos Duxelles, espinafres biológicos e molho Beurre Blanc.',
            price: 18.90,
            tag: 'Mais Vendido',
            svgColor: '#E88A62'
        },
        {
            id: 'main_beef',
            category: 'mains',
            title: 'Medalhão de Novilho com Trufas',
            description: 'Medalhão de lombo Angus grelhado no ponto ideal, puré cremoso de batata trufada, mini cenouras glaciadas e redução de vinho do Porto.',
            price: 24.50,
            tag: 'Premium',
            svgColor: '#8B0000'
        },
        {
            id: 'main_risotto',
            category: 'mains',
            title: 'Risotto de Cogumelos e Avelãs',
            description: 'Arroz Arbório cremoso cozinhado em caldo aromático de cogumelos silvestres, queijo Grana Padano e avelãs tostadas biológicas.',
            price: 16.50,
            tag: 'Vegetariano',
            svgColor: '#556B2F'
        },
        {
            id: 'dessert_lava',
            category: 'desserts',
            title: 'Petit Gâteau de Caramelo Salgado',
            description: 'Bolo quente com recheio fluído de caramelo de flor de sal, gelado artesanal de baunilha de Bourbon e crumble estaladiço de cacau.',
            price: 7.90,
            tag: 'Indulgente',
            svgColor: '#D2691E'
        },
        {
            id: 'dessert_panna',
            category: 'desserts',
            title: 'Panna Cotta de Favas Tonka',
            description: 'Creme aveludado com infusão de fava Tonka, coulis cítrico de framboesas silvestres frescas e folhas de hortelã biológica.',
            price: 6.50,
            tag: 'Clássico',
            svgColor: '#FF69B4'
        },
        {
            id: 'drink_sangria',
            category: 'drinks',
            title: 'Sangria Gourmet de Espumante',
            description: 'Espumante Reserva, bagas de frutos vermelhos biológicos, lichia fresca, hortelã da horta e um toque de licor Triple Sec.',
            price: 9.50,
            tag: 'Exclusivo',
            svgColor: '#FFDF00'
        },
        {
            id: 'drink_mocktail',
            category: 'drinks',
            title: 'Mocktail Citrino Floral',
            description: 'Infusão de hibisco biológico, sumo de lima espremido na hora, xarope artesanal de alecrim e água tónica premium.',
            price: 5.50,
            tag: 'Sem Álcool',
            svgColor: '#DA70D6'
        }
    ];

    const CUSTOMIZER_OPTIONS = {
        bases: [
            { id: 'cb_pure', name: 'Puré de Trufas Pretas', price: 4.50, color: '#F5F5DC' },
            { id: 'cb_quinoa', name: 'Quinoa Real Aromática', price: 3.50, color: '#EAE6DF' },
            { id: 'cb_rice', name: 'Arroz de Açafrão', price: 3.00, color: '#F4C430' }
        ],
        proteins: [
            { id: 'cp_beef', name: 'Medalhão de Novilho Angus', price: 12.00, color: '#6A2E2B' },
            { id: 'cp_salmon', name: 'Lombo de Salmão Grelhado', price: 10.50, color: '#FA8072' },
            { id: 'cp_tofu', name: 'Tofu Orgânico Defumado', price: 7.50, color: '#D2B48C' }
        ],
        toppings: [
            { id: 'ct_mushrooms', name: 'Cogumelos Selvagens', price: 2.50, color: '#5C4033' },
            { id: 'ct_asparagus', name: 'Espargos Grelhados', price: 2.80, color: '#3f704d' },
            { id: 'ct_pesto', name: 'Pesto de Manjericão e Pinhões', price: 1.80, color: '#567D46' },
            { id: 'ct_tomatoes', name: 'Tomates Cherry Assados', price: 2.00, color: '#CD5C5C' }
        ]
    };

    const TESTIMONIALS = [
        {
            text: "O Salmão Wellington é de outro planeta. Chegou quente, extremamente crocante e com uma apresentação digna de um restaurante com estrela Michelin no conforto da minha sala.",
            name: "Sofia Henriques",
            title: "Crítica Gastronómica",
            avatar: "SH"
        },
        {
            text: "A possibilidade de criar o meu próprio prato premium é genial. O puré de trufas pretas combinado com o lombo Angus grelhado no ponto exato foi uma experiência inesquecível.",
            name: "João Silva",
            title: "Entusiasta de Culinária",
            avatar: "JS"
        },
        {
            text: "Serviço cinco estrelas. A embalagem térmica é fantástica, mantendo todos os aromas preservados. Certamente que voltarei a encomendar com o Gourmet Bites.",
            name: "Beatriz Costa",
            title: "Arquiteta e Cliente Frequente",
            avatar: "BC"
        }
    ];

    const VALID_COUPON = {
        code: 'GOURMET20',
        discountPercent: 20
    };

    // State Variables
    let cart = [];
    let appliedCoupon = null;
    const shippingFee = 2.50;

    let selectedCustomBase = null;
    let selectedCustomProtein = null;
    let selectedCustomToppings = [];

    let currentReviewIndex = 0;

    // ==========================================================================
    // DOM Element Selectors
    // ==========================================================================

    // Navigation and Globals
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const cartTriggerBtn = document.getElementById('cart-trigger-btn');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const toastContainer = document.getElementById('toast-manager-container');

    // Menu Components
    const menuTabsContainer = document.getElementById('menu-tabs-container');
    const menuItemsGrid = document.getElementById('menu-items-grid');

    // Customizer Elements
    const baseOptionsBox = document.getElementById('base-options-box');
    const proteinOptionsBox = document.getElementById('protein-options-box');
    const toppingOptionsBox = document.getElementById('topping-options-box');
    const activeLayersBox = document.getElementById('active-layers-box');
    const emptyPlateAlert = document.getElementById('empty-plate-alert');
    const customizerTotalPrice = document.getElementById('customizer-total-price');
    const btnResetPlate = document.getElementById('btn-reset-plate');
    const btnAddPlateToCart = document.getElementById('btn-add-plate-to-cart');

    // Reviews Elements
    const reviewsTrack = document.getElementById('reviews-track-container');
    const reviewsDotsBox = document.getElementById('reviews-dots-box');
    const reviewsPrevBtn = document.getElementById('reviews-prev-btn');
    const reviewsNextBtn = document.getElementById('reviews-next-btn');

    // Shopping Cart Drawer Elements
    const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
    const cartDrawerContainer = document.getElementById('cart-drawer-container');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const couponField = document.getElementById('coupon-field');
    const couponApplyBtn = document.getElementById('coupon-apply-btn');
    const couponAlertMsg = document.getElementById('coupon-alert-msg');
    
    const cartSubtotal = document.getElementById('cart-subtotal');
    const couponDiscountRow = document.getElementById('coupon-discount-row');
    const appliedCouponName = document.getElementById('applied-coupon-name');
    const couponDiscountVal = document.getElementById('coupon-discount-val');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const btnCheckoutTrigger = document.getElementById('btn-checkout-trigger');

    // Checkout Modal Elements
    const checkoutModalBackdrop = document.getElementById('checkout-modal-backdrop');
    const checkoutModalContainer = document.getElementById('checkout-modal-container');
    const checkoutCloseBtn = document.getElementById('checkout-close-btn');
    const modalStepForm = document.getElementById('modal-step-form');
    const modalStepSuccess = document.getElementById('modal-step-success');
    const checkoutBillingForm = document.getElementById('checkout-billing-form');
    const checkoutPayment = document.getElementById('checkout-payment');
    const creditCardDetails = document.getElementById('credit-card-details');
    const modalSummaryTotal = document.getElementById('modal-summary-total');
    const btnSuccessClose = document.getElementById('btn-success-close');
    const orderProgressLoader = document.getElementById('order-progress-loader');
    const orderStatusMsg = document.getElementById('order-status-msg');
    const stepPrep = document.getElementById('step-prep');
    const stepDelivery = document.getElementById('step-delivery');
    const stepArrived = document.getElementById('step-arrived');

    // Credit Card formatting inputs
    const cardNumInput = document.getElementById('card-num');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvvInput = document.getElementById('card-cvv');

    // ==========================================================================
    // Utility & Secure Safe Rendering Helpers
    // ==========================================================================

    // Helper to safely clear element children
    function clearElement(element) {
        if (element) {
            element.replaceChildren();
        }
    }

    // Securely parse SVG string into real DOM element
    function parseSvg(svgString) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgString, 'image/svg+xml');
            // Check for parsing errors
            if (doc.getElementsByTagName('parsererror').length > 0) {
                console.error('SVG Parsing Error');
                return null;
            }
            return doc.documentElement;
        } catch (e) {
            console.error('Failed to parse SVG safely', e);
            return null;
        }
    }

    // Safe formatting helper for currency
    function formatCurrency(value) {
        return `${value.toFixed(2)} €`;
    }

    // ==========================================================================
    // Toast Alert Notification System
    // ==========================================================================

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Icon base on type
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'toast-icon';
        
        let svgIcon = '';
        if (type === 'success') {
            svgIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        } else if (type === 'warning') {
            svgIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" stroke-linecap="round"/></svg>`;
        } else {
            svgIcon = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01" stroke-linecap="round"/></svg>`;
        }
        
        const parsedIcon = parseSvg(svgIcon);
        if (parsedIcon) {
            iconWrapper.appendChild(parsedIcon);
        }
        
        const textSpan = document.createElement('span');
        textSpan.className = 'toast-msg';
        textSpan.textContent = message;
        
        toast.appendChild(iconWrapper);
        toast.appendChild(textSpan);
        
        toastContainer.appendChild(toast);
        
        // Auto trigger slide out and delete
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // ==========================================================================
    // Light / Dark Theme Toggler
    // ==========================================================================

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        const isLight = body.classList.contains('light-theme');
        showToast(isLight ? 'Modo Claro Ativado' : 'Modo Escuro Ativado', 'info');
    });

    // ==========================================================================
    // Main Menu Rendering & Tabs Filtering
    // ==========================================================================

    function renderMenuItems(categoryFilter = 'all') {
        clearElement(menuItemsGrid);
        
        const filteredItems = categoryFilter === 'all' 
            ? MENU_ITEMS 
            : MENU_ITEMS.filter(item => item.category === categoryFilter);
            
        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            
            // Visual top of card (SVG illustration inside)
            const visualDiv = document.createElement('div');
            visualDiv.className = 'menu-item-visual';
            
            // Tag banner
            const tagSpan = document.createElement('span');
            tagSpan.className = 'menu-item-tag';
            tagSpan.textContent = item.tag;
            visualDiv.appendChild(tagSpan);
            
            // Plate representation SVG
            const plateSvgStr = `
                <svg class="card-svg-plate" viewBox="0 0 100 100" width="130" height="130">
                    <circle cx="50" cy="50" r="45" fill="var(--color-surface-card)" stroke="var(--color-border)" stroke-width="1.5"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-gold)" stroke-width="0.3" stroke-dasharray="2 2"/>
                    <circle cx="50" cy="50" r="28" fill="${item.svgColor}" opacity="0.85"/>
                    <circle cx="45" cy="45" r="8" fill="#FFF" opacity="0.25"/>
                    <circle cx="55" cy="55" r="10" fill="#000" opacity="0.15"/>
                    <circle cx="52" cy="42" r="3" fill="var(--color-gold)"/>
                    <circle cx="42" cy="52" r="2" fill="var(--color-gold)"/>
                </svg>
            `;
            const parsedSvg = parseSvg(plateSvgStr);
            if (parsedSvg) {
                visualDiv.appendChild(parsedSvg);
            }
            
            // Content panel
            const contentDiv = document.createElement('div');
            contentDiv.className = 'menu-item-content';
            
            const headDiv = document.createElement('div');
            headDiv.className = 'menu-item-head';
            
            const titleH3 = document.createElement('h3');
            titleH3.className = 'menu-item-title';
            titleH3.textContent = item.title;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'menu-item-price';
            priceSpan.textContent = formatCurrency(item.price);
            
            headDiv.appendChild(titleH3);
            headDiv.appendChild(priceSpan);
            
            const descP = document.createElement('p');
            descP.className = 'menu-item-description';
            descP.textContent = item.description;
            
            // Add CTA button
            const addBtn = document.createElement('button');
            addBtn.className = 'add-to-cart-btn';
            addBtn.setAttribute('id', `btn-add-${item.id}`);
            
            const cartSvgStr = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
            const btnSvg = parseSvg(cartSvgStr);
            if (btnSvg) {
                addBtn.appendChild(btnSvg);
            }
            
            const btnText = document.createElement('span');
            btnText.textContent = 'Adicionar ao Carrinho';
            addBtn.appendChild(btnText);
            
            // Click listener safely adding item
            addBtn.addEventListener('click', () => {
                addToCart(item);
            });
            
            contentDiv.appendChild(headDiv);
            contentDiv.appendChild(descP);
            contentDiv.appendChild(addBtn);
            
            card.appendChild(visualDiv);
            card.appendChild(contentDiv);
            
            menuItemsGrid.appendChild(card);
        });
    }

    // Bind Category Tabs click events
    menuTabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('.menu-tab');
        if (!tab) return;
        
        // Remove active states
        document.querySelectorAll('.menu-tab').forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');
        
        const category = tab.getAttribute('data-category');
        renderMenuItems(category);
    });

    // ==========================================================================
    // Interactive Chef's Plate Customizer Logic
    // ==========================================================================

    function initCustomizerOptions() {
        clearElement(baseOptionsBox);
        clearElement(proteinOptionsBox);
        clearElement(toppingOptionsBox);
        
        // Render Bases options
        CUSTOMIZER_OPTIONS.bases.forEach(base => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'custom-opt-btn';
            btn.setAttribute('id', `opt-base-${base.id}`);
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'opt-name';
            nameSpan.textContent = base.name;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'opt-price';
            priceSpan.textContent = `+ ${formatCurrency(base.price)}`;
            
            btn.appendChild(nameSpan);
            btn.appendChild(priceSpan);
            
            btn.addEventListener('click', () => selectBase(base));
            baseOptionsBox.appendChild(btn);
        });
        
        // Render Protein options
        CUSTOMIZER_OPTIONS.proteins.forEach(protein => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'custom-opt-btn';
            btn.setAttribute('id', `opt-prot-${protein.id}`);
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'opt-name';
            nameSpan.textContent = protein.name;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'opt-price';
            priceSpan.textContent = `+ ${formatCurrency(protein.price)}`;
            
            btn.appendChild(nameSpan);
            btn.appendChild(priceSpan);
            
            btn.addEventListener('click', () => selectProtein(protein));
            proteinOptionsBox.appendChild(btn);
        });
        
        // Render Toppings options
        CUSTOMIZER_OPTIONS.toppings.forEach(topping => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'custom-opt-btn';
            btn.setAttribute('id', `opt-top-${topping.id}`);
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'opt-name';
            nameSpan.textContent = topping.name;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'opt-price';
            priceSpan.textContent = `+ ${formatCurrency(topping.price)}`;
            
            btn.appendChild(nameSpan);
            btn.appendChild(priceSpan);
            
            btn.addEventListener('click', () => toggleTopping(topping));
            toppingOptionsBox.appendChild(btn);
        });
        
        updateCustomizerUI();
    }

    function selectBase(base) {
        selectedCustomBase = base;
        
        // Highlight active button UI
        document.querySelectorAll('#base-options-box .custom-opt-btn').forEach(btn => btn.classList.remove('selected'));
        const activeBtn = document.getElementById(`opt-base-${base.id}`);
        if (activeBtn) activeBtn.classList.add('selected');
        
        updateCustomizerUI();
        showToast(`Base selecionada: ${base.name}`, 'info');
    }

    function selectProtein(protein) {
        selectedCustomProtein = protein;
        
        // Highlight active button UI
        document.querySelectorAll('#protein-options-box .custom-opt-btn').forEach(btn => btn.classList.remove('selected'));
        const activeBtn = document.getElementById(`opt-prot-${protein.id}`);
        if (activeBtn) activeBtn.classList.add('selected');
        
        updateCustomizerUI();
        showToast(`Proteína selecionada: ${protein.name}`, 'info');
    }

    function toggleTopping(topping) {
        const index = selectedCustomToppings.findIndex(t => t.id === topping.id);
        const activeBtn = document.getElementById(`opt-top-${topping.id}`);
        
        if (index > -1) {
            selectedCustomToppings.splice(index, 1);
            if (activeBtn) activeBtn.classList.remove('selected');
            showToast(`Removido: ${topping.name}`, 'info');
        } else {
            selectedCustomToppings.push(topping);
            if (activeBtn) activeBtn.classList.add('selected');
            showToast(`Adicionado: ${topping.name}`, 'info');
        }
        
        updateCustomizerUI();
    }

    function updateCustomizerUI() {
        // Calculate estimated cost
        let total = 0;
        if (selectedCustomBase) total += selectedCustomBase.price;
        if (selectedCustomProtein) total += selectedCustomProtein.price;
        selectedCustomToppings.forEach(t => total += t.price);
        
        customizerTotalPrice.textContent = formatCurrency(total);
        
        // Clear canvas interactive layers
        clearElement(activeLayersBox);
        
        if (!selectedCustomBase && !selectedCustomProtein && selectedCustomToppings.length === 0) {
            activeLayersBox.appendChild(emptyPlateAlert);
            return;
        }
        
        // Remove dynamic alert
        if (emptyPlateAlert.parentNode) {
            activeLayersBox.removeChild(emptyPlateAlert);
        }
        
        // 1. Draw Base layer
        if (selectedCustomBase) {
            const baseDiv = document.createElement('div');
            baseDiv.className = 'visual-layer base-layer';
            const baseSvg = `
                <svg viewBox="0 0 200 200" width="220" height="220">
                    <circle cx="100" cy="100" r="70" fill="${selectedCustomBase.color}" opacity="0.9" />
                    <!-- Texture grains -->
                    <circle cx="80" cy="80" r="2" fill="#000" opacity="0.05" />
                    <circle cx="120" cy="110" r="2.5" fill="#000" opacity="0.05" />
                    <circle cx="100" cy="120" r="2" fill="#000" opacity="0.05" />
                    <circle cx="95" cy="75" r="1.5" fill="#000" opacity="0.05" />
                </svg>
            `;
            const parsedBase = parseSvg(baseSvg);
            if (parsedBase) baseDiv.appendChild(parsedBase);
            activeLayersBox.appendChild(baseDiv);
        }
        
        // 2. Draw Protein layer
        if (selectedCustomProtein) {
            const protDiv = document.createElement('div');
            protDiv.className = 'visual-layer protein-layer';
            
            // Generate visual path representing meat/salmon block/tofu
            let svgContent = '';
            if (selectedCustomProtein.id === 'cp_beef') {
                // Ribeye medallion path
                svgContent = `
                    <svg viewBox="0 0 200 200" width="160" height="160">
                        <path d="M70 70 C 85 55, 115 55, 130 70 C 145 85, 145 115, 130 130 C 115 145, 85 145, 70 130 C 55 115, 55 85, 70 70 Z" fill="${selectedCustomProtein.color}" />
                        <path d="M80 80 C 88 72, 112 72, 120 80" fill="none" stroke="#522421" stroke-width="2" />
                        <path d="M85 95 C 93 87, 107 87, 115 95" fill="none" stroke="#522421" stroke-width="2" />
                    </svg>
                `;
            } else if (selectedCustomProtein.id === 'cp_salmon') {
                // Salmon block path
                svgContent = `
                    <svg viewBox="0 0 200 200" width="165" height="165">
                        <rect x="65" y="75" width="70" height="50" rx="10" transform="rotate(-15 100 100)" fill="${selectedCustomProtein.color}" />
                        <!-- White fatty salmon lines -->
                        <path d="M 75 80 L 125 100" stroke="#FFF" stroke-width="1.5" opacity="0.4" transform="rotate(-15 100 100)" />
                        <path d="M 70 95 L 120 115" stroke="#FFF" stroke-width="1.5" opacity="0.4" transform="rotate(-15 100 100)" />
                        <path d="M 65 110 L 115 130" stroke="#FFF" stroke-width="1.5" opacity="0.4" transform="rotate(-15 100 100)" />
                    </svg>
                `;
            } else {
                // Tofu cube paths
                svgContent = `
                    <svg viewBox="0 0 200 200" width="150" height="150">
                        <rect x="65" y="65" width="45" height="45" rx="4" fill="${selectedCustomProtein.color}" stroke="#B89B74" stroke-width="1" />
                        <rect x="85" y="85" width="45" height="45" rx="4" fill="${selectedCustomProtein.color}" stroke="#B89B74" stroke-width="1" opacity="0.8" />
                    </svg>
                `;
            }
            
            const parsedProt = parseSvg(svgContent);
            if (parsedProt) protDiv.appendChild(parsedProt);
            activeLayersBox.appendChild(protDiv);
        }
        
        // 3. Draw Toppings layer
        if (selectedCustomToppings.length > 0) {
            selectedCustomToppings.forEach(topping => {
                const topDiv = document.createElement('div');
                topDiv.className = `visual-layer topping-${topping.id}`;
                
                let svgStr = '';
                if (topping.id === 'ct_mushrooms') {
                    // Scattered mushroom icons
                    svgStr = `
                        <svg viewBox="0 0 200 200" width="180" height="180">
                            <!-- Mushroom 1 -->
                            <path d="M 50 110 C 50 90, 80 90, 80 110 Z" fill="${topping.color}" />
                            <rect x="62" y="110" width="6" height="10" rx="2" fill="#8C7060" />
                            <!-- Mushroom 2 -->
                            <path d="M 120 80 C 120 60, 150 60, 150 80 Z" fill="${topping.color}" />
                            <rect x="132" y="80" width="6" height="10" rx="2" fill="#8C7060" />
                        </svg>
                    `;
                } else if (topping.id === 'ct_asparagus') {
                    // Asparagus spear lines
                    svgStr = `
                        <svg viewBox="0 0 200 200" width="190" height="190">
                            <rect x="60" y="50" width="6" height="100" rx="3" transform="rotate(45 100 100)" fill="${topping.color}" />
                            <rect x="80" y="45" width="6" height="100" rx="3" transform="rotate(35 100 100)" fill="${topping.color}" opacity="0.9" />
                        </svg>
                    `;
                } else if (topping.id === 'ct_pesto') {
                    // Green circular drops of pesto sauce
                    svgStr = `
                        <svg viewBox="0 0 200 200" width="200" height="200">
                            <circle cx="70" cy="50" r="5" fill="${topping.color}" />
                            <circle cx="130" cy="65" r="7" fill="${topping.color}" />
                            <circle cx="60" cy="120" r="6" fill="${topping.color}" />
                            <circle cx="140" cy="115" r="4" fill="${topping.color}" />
                        </svg>
                    `;
                } else {
                    // Tomatoes assados
                    svgStr = `
                        <svg viewBox="0 0 200 200" width="180" height="180">
                            <circle cx="90" cy="50" r="9" fill="${topping.color}" />
                            <path d="M 88 41 Q 90 35, 93 41" stroke="#3f704d" stroke-width="1.5" fill="none" />
                            <circle cx="120" cy="130" r="8.5" fill="${topping.color}" />
                            <path d="M 118 121 Q 120 115, 122 121" stroke="#3f704d" stroke-width="1.5" fill="none" />
                        </svg>
                    `;
                }
                
                const parsedTop = parseSvg(svgStr);
                if (parsedTop) topDiv.appendChild(parsedTop);
                activeLayersBox.appendChild(topDiv);
            });
        }
    }

    function resetCustomizerPlate() {
        selectedCustomBase = null;
        selectedCustomProtein = null;
        selectedCustomToppings = [];
        
        // Remove button selectors
        document.querySelectorAll('.customizer-panel .custom-opt-btn').forEach(btn => btn.classList.remove('selected'));
        
        updateCustomizerUI();
        showToast('O seu prato foi limpo.', 'info');
    }

    function addPlateToCart() {
        if (!selectedCustomBase) {
            showToast('Erro: Selecione uma Base para o seu prato!', 'warning');
            return;
        }
        if (!selectedCustomProtein) {
            showToast('Erro: Selecione uma Proteína para o seu prato!', 'warning');
            return;
        }
        
        // Compose custom item
        const id = `custom_${Date.now()}`;
        const baseName = selectedCustomBase.name;
        const proteinName = selectedCustomProtein.name;
        const toppingsText = selectedCustomToppings.length > 0 
            ? selectedCustomToppings.map(t => t.name).join(', ') 
            : 'Sem guarnições adicionais';
            
        let price = selectedCustomBase.price + selectedCustomProtein.price;
        selectedCustomToppings.forEach(t => price += t.price);
        
        const customItem = {
            id: id,
            isCustom: true,
            title: 'Obra-Prima do Chef (Personalizado)',
            description: `Base: ${baseName} | Proteína: ${proteinName} | Guarnições: ${toppingsText}`,
            price: price,
            svgColor: '#ECECEC'
        };
        
        addToCart(customItem);
        resetCustomizerPlate();
        showToast('Prato Personalizado adicionado ao seu pedido!', 'success');
    }

    // Bind customizer actions
    btnResetPlate.addEventListener('click', resetCustomizerPlate);
    btnAddPlateToCart.addEventListener('click', addPlateToCart);

    // ==========================================================================
    // Reviews Slider Carousel Logic
    // ==========================================================================

    function initReviewsSlider() {
        clearElement(reviewsTrack);
        clearElement(reviewsDotsBox);
        
        TESTIMONIALS.forEach((review, idx) => {
            const slide = document.createElement('div');
            slide.className = 'review-slide';
            slide.setAttribute('data-index', idx);
            
            const card = document.createElement('div');
            card.className = 'review-card';
            
            // Stars representation
            const starsWrapper = document.createElement('div');
            starsWrapper.className = 'review-stars';
            
            for (let i = 0; i < 5; i++) {
                const starSvgStr = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
                const parsedStar = parseSvg(starSvgStr);
                if (parsedStar) starsWrapper.appendChild(parsedStar);
            }
            
            const textP = document.createElement('p');
            textP.className = 'review-text';
            textP.textContent = `"${review.text}"`;
            
            const authorWrapper = document.createElement('div');
            authorWrapper.className = 'review-author';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'author-avatar';
            avatarDiv.textContent = review.avatar;
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'author-info';
            
            const nameH4 = document.createElement('h4');
            nameH4.className = 'author-name';
            nameH4.textContent = review.name;
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'author-title';
            titleSpan.textContent = review.title;
            
            infoDiv.appendChild(nameH4);
            infoDiv.appendChild(titleSpan);
            
            authorWrapper.appendChild(avatarDiv);
            authorWrapper.appendChild(infoDiv);
            
            card.appendChild(starsWrapper);
            card.appendChild(textP);
            card.appendChild(authorWrapper);
            
            slide.appendChild(card);
            reviewsTrack.appendChild(slide);
            
            // Create slide indicators
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Mostrar avaliação ${idx + 1}`);
            dot.addEventListener('click', () => jumpToReview(idx));
            reviewsDotsBox.appendChild(dot);
        });
        
        updateSliderPosition();
    }

    function updateSliderPosition() {
        reviewsTrack.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
        
        // Update dots UI
        document.querySelectorAll('.slider-dot').forEach((dot, idx) => {
            if (idx === currentReviewIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function slideReviews(direction) {
        if (direction === 'next') {
            currentReviewIndex = (currentReviewIndex + 1) % TESTIMONIALS.length;
        } else {
            currentReviewIndex = (currentReviewIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length;
        }
        updateSliderPosition();
    }

    function jumpToReview(idx) {
        currentReviewIndex = idx;
        updateSliderPosition();
    }

    reviewsPrevBtn.addEventListener('click', () => slideReviews('prev'));
    reviewsNextBtn.addEventListener('click', () => slideReviews('next'));

    // ==========================================================================
    // Shopping Cart Drawer Manager (State Operations)
    // ==========================================================================

    function openCart() {
        cartDrawerBackdrop.classList.add('open');
        cartDrawerContainer.classList.add('open');
    }

    function closeCart() {
        cartDrawerBackdrop.classList.remove('open');
        cartDrawerContainer.classList.remove('open');
    }

    cartTriggerBtn.addEventListener('click', openCart);
    cartCloseBtn.addEventListener('click', closeCart);
    cartDrawerBackdrop.addEventListener('click', closeCart);

    function addToCart(item) {
        // Search if normal menu item already in cart
        const existingIdx = cart.findIndex(cItem => cItem.id === item.id && !cItem.isCustom);
        
        if (existingIdx > -1) {
            cart[existingIdx].qty += 1;
            showToast(`Quantidade de "${item.title}" aumentada.`, 'success');
        } else {
            cart.push({
                ...item,
                qty: 1
            });
            showToast(`"${item.title}" adicionado ao carrinho!`, 'success');
        }
        
        updateCartUI();
        openCart();
    }

    function changeCartItemQty(id, delta) {
        const itemIdx = cart.findIndex(cItem => cItem.id === id);
        if (itemIdx === -1) return;
        
        cart[itemIdx].qty += delta;
        
        if (cart[itemIdx].qty <= 0) {
            const title = cart[itemIdx].title;
            cart.splice(itemIdx, 1);
            showToast(`"${title}" removido do pedido.`, 'info');
        }
        
        updateCartUI();
    }

    function removeCartItem(id) {
        const itemIdx = cart.findIndex(cItem => cItem.id === id);
        if (itemIdx === -1) return;
        
        const title = cart[itemIdx].title;
        cart.splice(itemIdx, 1);
        updateCartUI();
        showToast(`"${title}" removido do pedido.`, 'info');
    }

    function updateCartUI() {
        clearElement(cartItemsList);
        
        // Update header count badge
        let totalCount = 0;
        cart.forEach(item => totalCount += item.qty);
        cartCountBadge.textContent = totalCount.toString();
        
        if (cart.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-cart-view';
            
            const emptyIcon = parseSvg(`<svg class="empty-cart-icon" viewBox="0 0 24 24" width="64" height="64" fill="currentColor"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/></svg>`);
            if (emptyIcon) emptyDiv.appendChild(emptyIcon);
            
            const textSpan = document.createElement('span');
            textSpan.textContent = 'O seu carrinho está vazio.';
            emptyDiv.appendChild(textSpan);
            
            cartItemsList.appendChild(emptyDiv);
            
            // Set pricing to zeros
            cartSubtotal.textContent = '0.00 €';
            couponDiscountRow.style.display = 'none';
            cartTotalPrice.textContent = '0.00 €';
            
            btnCheckoutTrigger.disabled = true;
            return;
        }
        
        btnCheckoutTrigger.disabled = false;
        
        // Loop through active cart items
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.qty;
            
            const cartItemRow = document.createElement('div');
            cartItemRow.className = 'cart-item';
            
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'cart-item-details';
            
            const titleH4 = document.createElement('h4');
            titleH4.className = 'cart-item-title';
            titleH4.textContent = item.title;
            
            const descSpan = document.createElement('span');
            descSpan.className = 'cart-item-desc';
            descSpan.textContent = item.description;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'cart-item-price';
            priceSpan.textContent = formatCurrency(item.price * item.qty);
            
            detailsDiv.appendChild(titleH4);
            detailsDiv.appendChild(descSpan);
            detailsDiv.appendChild(priceSpan);
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'cart-item-actions';
            
            // Remove button
            const rmBtn = document.createElement('button');
            rmBtn.className = 'btn-remove-item';
            rmBtn.setAttribute('aria-label', `Remover ${item.title}`);
            const rmIcon = parseSvg(`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
            if (rmIcon) rmBtn.appendChild(rmIcon);
            rmBtn.addEventListener('click', () => removeCartItem(item.id));
            
            // Quantity Selector
            const qtyDiv = document.createElement('div');
            qtyDiv.className = 'qty-selector';
            
            const minBtn = document.createElement('button');
            minBtn.type = 'button';
            minBtn.className = 'qty-btn';
            minBtn.textContent = '-';
            minBtn.addEventListener('click', () => changeCartItemQty(item.id, -1));
            
            const valSpan = document.createElement('span');
            valSpan.className = 'qty-val';
            valSpan.textContent = item.qty.toString();
            
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'qty-btn';
            addBtn.textContent = '+';
            addBtn.addEventListener('click', () => changeCartItemQty(item.id, 1));
            
            qtyDiv.appendChild(minBtn);
            qtyDiv.appendChild(valSpan);
            qtyDiv.appendChild(addBtn);
            
            actionsDiv.appendChild(rmBtn);
            actionsDiv.appendChild(qtyDiv);
            
            cartItemRow.appendChild(detailsDiv);
            cartItemRow.appendChild(actionsDiv);
            
            cartItemsList.appendChild(cartItemRow);
        });
        
        // Calculations and Promo Coupon handling
        cartSubtotal.textContent = formatCurrency(subtotal);
        let finalPrice = subtotal;
        
        if (appliedCoupon) {
            const discount = subtotal * (appliedCoupon.discountPercent / 100);
            finalPrice -= discount;
            
            couponDiscountRow.style.display = 'flex';
            appliedCouponName.textContent = `(${appliedCoupon.code})`;
            couponDiscountVal.textContent = `- ${formatCurrency(discount)}`;
        } else {
            couponDiscountRow.style.display = 'none';
        }
        
        finalPrice += shippingFee;
        cartTotalPrice.textContent = formatCurrency(finalPrice);
        
        // Store total in modal sum total dynamically
        modalSummaryTotal.textContent = formatCurrency(finalPrice);
    }

    // Coupon verification
    couponApplyBtn.addEventListener('click', () => {
        const input = couponField.value.trim().toUpperCase();
        
        if (cart.length === 0) {
            showToast('Erro: Adicione pratos antes de aplicar o cupão!', 'warning');
            return;
        }
        
        if (input === VALID_COUPON.code) {
            appliedCoupon = VALID_COUPON;
            couponAlertMsg.className = 'coupon-feedback success';
            couponAlertMsg.textContent = 'Cupão GOURMET20 (20% de Desconto) aplicado com sucesso!';
            updateCartUI();
            showToast('Desconto de 20% aplicado!', 'success');
        } else {
            appliedCoupon = null;
            couponAlertMsg.className = 'coupon-feedback error';
            couponAlertMsg.textContent = 'Código de desconto inválido ou expirado.';
            updateCartUI();
            showToast('Código de desconto inválido.', 'warning');
        }
    });

    // ==========================================================================
    // checkout Modal Multi-step Manager
    // ==========================================================================

    function toggleCheckoutModal(isOpen) {
        if (isOpen) {
            closeCart();
            checkoutModalBackdrop.classList.add('open');
            checkoutModalContainer.classList.add('open');
            
            // Default step setup
            modalStepForm.style.display = 'block';
            modalStepSuccess.style.display = 'none';
            checkoutBillingForm.reset();
            creditCardDetails.style.display = 'none';
        } else {
            checkoutModalBackdrop.classList.remove('open');
            checkoutModalContainer.classList.remove('open');
        }
    }

    btnCheckoutTrigger.addEventListener('click', () => toggleCheckoutModal(true));
    checkoutCloseBtn.addEventListener('click', () => toggleCheckoutModal(false));
    checkoutModalBackdrop.addEventListener('click', () => toggleCheckoutModal(false));

    // Handle billing payment option switches
    checkoutPayment.addEventListener('change', (e) => {
        if (e.target.value === 'card') {
            creditCardDetails.style.display = 'block';
            cardNumInput.required = true;
            cardExpiryInput.required = true;
            cardCvvInput.required = true;
        } else {
            creditCardDetails.style.display = 'none';
            cardNumInput.required = false;
            cardExpiryInput.required = false;
            cardCvvInput.required = false;
        }
    });

    // Submitting order - Simulated transitions and progress updates
    checkoutBillingForm.addEventListener('submit', () => {
        // Proceed with UI transition to Success Step
        modalStepForm.style.display = 'none';
        modalStepSuccess.style.display = 'block';
        
        // Reset states
        cart = [];
        appliedCoupon = null;
        couponField.value = '';
        couponAlertMsg.textContent = '';
        updateCartUI();
        
        // Start Order Dispatch progress bar animations
        runSimulatedDeliveryProgress();
    });

    function runSimulatedDeliveryProgress() {
        orderProgressLoader.style.width = '15%';
        orderStatusMsg.textContent = 'O Chef Ricardo começou a confecionar o seu pedido...';
        stepPrep.classList.add('active');
        stepDelivery.classList.remove('active');
        stepArrived.classList.remove('active');
        
        // Kitchen phase completes -> Dispatching delivery
        setTimeout(() => {
            orderProgressLoader.style.width = '60%';
            orderStatusMsg.textContent = 'O seu pedido já saiu e está a caminho da sua morada!';
            stepDelivery.classList.add('active');
        }, 5000);
        
        // Delivery completes -> Arrived
        setTimeout(() => {
            orderProgressLoader.style.width = '100%';
            orderStatusMsg.textContent = 'O estafeta chegou! Bom apetite!';
            stepArrived.classList.add('active');
        }, 10000);
    }

    btnSuccessClose.addEventListener('click', () => {
        toggleCheckoutModal(false);
    });

    // CC Security formatting inputs
    cardNumInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = value.substring(0, 19);
    });

    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
    });

    cardCvvInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.substring(0, 3);
    });

    // ==========================================================================
    // Initializer Boot
    // ==========================================================================

    function init() {
        renderMenuItems('all');
        initCustomizerOptions();
        initReviewsSlider();
        updateCartUI();
    }

    init();
});
