export type Category = "Refeições" | "Cafetaria" | "Pastelaria & Sobremesas";

export type Subcategory =
  // Refeições
  | "Hamburguers"
  | "Sandes e Foccacias"
  | "Saladas"
  | "Ovos"
  // Cafetaria
  | "Café em Espresso"
  | "Café de Filtro"
  | "Campanhas"
  // Pastelaria
  | "Doces"
  | "Sobremesas";

export interface Pairing {
  nome: string;
  frase_venda: string;
  preco: number;
}

export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: Category;
  subcategoria: Subcategory;
  pairing: Pairing;
}

export const categories: {
  name: Category;
  accent: string;
  emoji: string;
  subcategories: Subcategory[];
}[] = [
  {
    name: "Refeições",
    accent: "category-meals",
    emoji: "🍽️",
    subcategories: ["Hamburguers", "Sandes e Foccacias", "Saladas", "Ovos"],
  },
  {
    name: "Cafetaria",
    accent: "category-coffee",
    emoji: "☕",
    subcategories: ["Café em Espresso", "Café de Filtro", "Campanhas"],
  },
  {
    name: "Pastelaria & Sobremesas",
    accent: "category-pastry",
    emoji: "🥐",
    subcategories: ["Doces", "Sobremesas"],
  },
];

export const menu: MenuItem[] = [
  // ─────────────── REFEIÇÕES · HAMBURGUERS ───────────────
  {
    id: "hamb-novilho",
    nome: "Hambúrguer de Novilho com Bacon e Queijo Cheddar",
    descricao:
      "Alface coração, tomate, cebola caramelizada, ovo estrelado, batata frita e maionese de alho.",
    preco: 13.0,
    categoria: "Refeições",
    subcategoria: "Hamburguers",
    pairing: {
      nome: "Craft Soda [WHY NOT]",
      frase_venda:
        "Para acompanhar o hambúrguer de novilho, sugiro a nossa Craft Soda [WHY NOT] — refrescante e com personalidade, equilibra na perfeição o sabor do cheddar e do bacon. Posso adicionar?",
      preco: 4.0,
    },
  },
  {
    id: "hamb-veg",
    nome: "Hambúrguer Vegetariano no Bolo do Caco",
    descricao:
      "Arroz integral, feijão preto, nozes, especiarias, alface coração, tomate, guacamole, picles de cebola roxa e batata frita.",
    preco: 12.0,
    categoria: "Refeições",
    subcategoria: "Hamburguers",
    pairing: {
      nome: "Limonada c/ Hortelã",
      frase_venda:
        "Com o hambúrguer vegetariano, a nossa Limonada com Hortelã é o par ideal — leve e refrescante, realça o frescor do guacamole. Aceita juntar?",
      preco: 3.2,
    },
  },

  // ─────────────── REFEIÇÕES · SANDES E FOCCACIAS ───────────────
  {
    id: "focaccia-mortadela",
    nome: "Focaccia de Mortadela de Bolonha e Stracciatella",
    descricao: "Focaccia artesanal com mortadela italiana, stracciatella cremosa e pistacchio.",
    preco: 12.5,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Spritz Delta da Casa",
      frase_venda:
        "A nossa Focaccia de Mortadela pede um Spritz Delta da Casa — fresco e citrino, equilibra a riqueza da stracciatella. Adiciono?",
      preco: 8.5,
    },
  },
  {
    id: "focaccia-burrata",
    nome: "Focaccia de Burrata, Tomate e Pesto",
    descricao: "Focaccia quente com burrata, tomate maduro e pesto de manjericão.",
    preco: 11.5,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Aperol Spritz",
      frase_venda:
        "Esta focaccia ganha outra dimensão com um Aperol Spritz — italianíssima combinação que realça o frescor do pesto. Sirvo?",
      preco: 12.0,
    },
  },
  {
    id: "focaccia-vegetais",
    nome: "Focaccia de Vegetais Grelhados",
    descricao: "Focaccia com beringela, courgette, pimento assado e queijo de cabra.",
    preco: 10.5,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Limonada c/ Hortelã",
      frase_venda:
        "Para complementar a focaccia de vegetais, a Limonada com Hortelã é leve e refrescante — par ideal. Aceita?",
      preco: 3.2,
    },
  },
  {
    id: "focaccia-salmao",
    nome: "Focaccia de Salmão Fumado",
    descricao: "Focaccia artesanal com salmão fumado, queijo creme, rúcula e alcaparras.",
    preco: 12.5,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Vinho Branco da Casa",
      frase_venda:
        "A Focaccia de Salmão Fumado pede um Vinho Branco da Casa — fresco e mineral, equilibra o fumado e as alcaparras. Em alternativa, um Chá Frio de Hibisco também combina lindamente. Adiciono?",
      preco: 4.5,
    },
  },
  {
    id: "focaccia-frango",
    nome: "Focaccia de Frango Grelhado",
    descricao: "Focaccia artesanal com peito de frango grelhado, mozzarella fresca, tomate confitado e molho pesto.",
    preco: 11.5,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Limonada c/ Hortelã",
      frase_venda:
        "A Focaccia de Frango Grelhado fica perfeita com a nossa Limonada com Hortelã — leve e refrescante, limpa o palato entre dentadas. Cerveja Artesanal também é ótima escolha. Sirvo?",
      preco: 3.2,
    },
  },
  {
    id: "prego",
    nome: "Prego no Bolo do Caco",
    descricao: "Prego servido em bolo do caco com batata frita.",
    preco: 14.0,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Porto Tónico",
      frase_venda:
        "Um Prego no bolo do caco merece um Porto Tónico — a frescura do tónico com o vinho do porto branco eleva o sabor da carne. Sirvo?",
      preco: 14.0,
    },
  },
  {
    id: "club-sandwich",
    nome: "Club Sandwich",
    descricao:
      "Peito de frango, queijo, fiambre, bacon, tomate, ovo, alface coração e maionese de alho.",
    preco: 14.0,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Sumo de Laranja Natural",
      frase_venda:
        "Para acompanhar o Club Sandwich, recomendo o nosso Sumo de Laranja Natural — fresco e vitamínico, equilibra os sabores intensos da sandes. Adiciono?",
      preco: 3.8,
    },
  },
  {
    id: "croissant-burrata",
    nome: "Croissant com Burrata, Rúcula e Vegetais Grelhados",
    descricao: "Croissant com burrata, rúcula, beringela e courgette grelhadas.",
    preco: 9.0,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Aperol Spritz",
      frase_venda:
        "Com a burrata e os vegetais grelhados, o nosso Aperol Spritz é o par perfeito — fresco e ligeiramente amargo, realça a cremosidade da burrata. Posso preparar?",
      preco: 12.0,
    },
  },
  {
    id: "croissant-salmao",
    nome: "Croissant de Salmão Fumado, Queijo Creme e Abacate",
    descricao: "Croissant artesanal com salmão fumado, queijo creme e abacate fresco.",
    preco: 10.0,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Mimosa",
      frase_venda:
        "Para acompanhar o croissant de salmão, sugiro a nossa Mimosa — sumo de laranja e espumante, um clássico de brunch que combina lindamente. Aceita?",
      preco: 10.0,
    },
  },
  {
    id: "tosta-mista",
    nome: "Tosta Mista",
    descricao: "Tosta clássica de fiambre e queijo em pão tostado.",
    preco: 7.0,
    categoria: "Refeições",
    subcategoria: "Sandes e Foccacias",
    pairing: {
      nome: "Cappuccino",
      frase_venda:
        "Uma Tosta Mista pede um Cappuccino acabado de fazer — o creme de leite combina lindamente com o queijo derretido. Junto?",
      preco: 4.0,
    },
  },

  // ─────────────── REFEIÇÕES · SALADAS ───────────────
  {
    id: "salada-caesar",
    nome: "Salada Caesar de Peito de Frango",
    descricao:
      "Alface coração, bacon, croutons, queijo parmesão, salsa e molho caesar.",
    preco: 13.0,
    categoria: "Refeições",
    subcategoria: "Saladas",
    pairing: {
      nome: "Sumo do Dia",
      frase_venda:
        "Com a sua Caesar, o nosso Sumo do Dia é a escolha ideal — fresco e equilibrado, complementa a salada sem pesar. Quer experimentar?",
      preco: 4.0,
    },
  },
  {
    id: "salada-feta",
    nome: "Salada de Alface Ibérica, Pepino, Melancia e Queijo Feta",
    descricao: "Com sementes de abóbora e vinagrete de balsâmico.",
    preco: 12.0,
    categoria: "Refeições",
    subcategoria: "Saladas",
    pairing: {
      nome: "Limonada c/ Hortelã",
      frase_venda:
        "Para realçar a frescura da melancia e do feta, a nossa Limonada com Hortelã é perfeita — leve e revigorante. Adiciono?",
      preco: 3.2,
    },
  },
  {
    id: "salada-burrata",
    nome: "Salada de Burrata com Mix de Tomates, Pêssego e Rúcula",
    descricao: "Vinagrete de balsâmico e azeite de manjericão.",
    preco: 12.0,
    categoria: "Refeições",
    subcategoria: "Saladas",
    pairing: {
      nome: "Aperol Spritz",
      frase_venda:
        "Esta salada de burrata pede um Aperol Spritz — fresco e amargo na medida certa, faz uma harmonização italiana de excelência. Sirvo?",
      preco: 12.0,
    },
  },
  {
    id: "salada-frango",
    nome: "Salada de Frango, Maçã Verde, Abacate e Rabanete",
    descricao: "Alface coração, aipo e molho de iogurte e ervas.",
    preco: 13.0,
    categoria: "Refeições",
    subcategoria: "Saladas",
    pairing: {
      nome: "Espresso Tónico",
      frase_venda:
        "Com esta salada leve, o nosso Espresso Tónico é uma surpresa — refrescante e estimulante, fecha a refeição com elegância. Adiciono?",
      preco: 4.0,
    },
  },

  // ─────────────── REFEIÇÕES · OVOS ───────────────
  {
    id: "ovos-benedict",
    nome: "Ovos Benedict com Molho Holandês",
    descricao: "Cogumelos Nãm, espinafres e granola.",
    preco: 12.0,
    categoria: "Refeições",
    subcategoria: "Ovos",
    pairing: {
      nome: "Flat White",
      frase_venda:
        "Uns Ovos Benedict pedem um Flat White — duplo espresso e leite emulsionado, equilibra na perfeição a riqueza do holandês. Aceita?",
      preco: 4.2,
    },
  },
  {
    id: "ovos-mexidos",
    nome: "Ovos Mexidos",
    descricao: "Cogumelos Nãm, espinafres e tomate cherry.",
    preco: 9.5,
    categoria: "Refeições",
    subcategoria: "Ovos",
    pairing: {
      nome: "Sumo de Laranja Natural",
      frase_venda:
        "Para completar os Ovos Mexidos, sugiro o nosso Sumo de Laranja Natural — clássico de pequeno-almoço, fresco e vitamínico. Adiciono?",
      preco: 3.8,
    },
  },
  {
    id: "ovos-escalfados-abacate",
    nome: "Ovos Escalfados com Abacate e Bacon",
    descricao: "Rúcula e cebolinho.",
    preco: 10.0,
    categoria: "Refeições",
    subcategoria: "Ovos",
    pairing: {
      nome: "Cappuccino",
      frase_venda:
        "Com estes ovos escalfados, um Cappuccino cremoso é o par ideal — equilibra o salgado do bacon com a doçura do leite vaporizado. Sirvo?",
      preco: 4.0,
    },
  },
  {
    id: "omelete",
    nome: "Omelete Simples",
    descricao:
      "Por + 2,00€ personaliza com 2 ingredientes: cebola, queijo, fiambre, tomate, cogumelos ou espinafres.",
    preco: 9.0,
    categoria: "Refeições",
    subcategoria: "Ovos",
    pairing: {
      nome: "Tosta de Abacate",
      frase_venda:
        "Quer complementar a omelete com a nossa Tosta de Abacate? Junto, formam um pequeno-almoço completo, nutritivo e cheio de sabor.",
      preco: 4.5,
    },
  },
  {
    id: "shakshuka",
    nome: "Green Shakshuka",
    descricao: "Espargos, espinafres, alho francês, ovos escalfados e queijo feta.",
    preco: 10.0,
    categoria: "Refeições",
    subcategoria: "Ovos",
    pairing: {
      nome: "Matcha Latte",
      frase_venda:
        "Com a Green Shakshuka, o nosso Matcha Latte é a escolha perfeita — herbal e suave, prolonga a experiência verde do prato. Aceita?",
      preco: 6.0,
    },
  },
  {
    id: "panquecas",
    nome: "Panquecas Fluffy",
    descricao: "Stack de panquecas fofas com xarope de ácer, frutos vermelhos e nata batida.",
    preco: 9.0,
    categoria: "Refeições",
    subcategoria: "Ovos",
    pairing: {
      nome: "Cappuccino",
      frase_venda:
        "As nossas Panquecas Fluffy pedem um Cappuccino cremoso — o leite vaporizado equilibra a doçura do xarope. Adiciono?",
      preco: 4.0,
    },
  },
  {
    id: "iogurte-granola",
    nome: "Iogurte com Granola e Frutos Vermelhos",
    descricao: "Iogurte natural, granola caseira e mix de frutos vermelhos.",
    preco: 6.5,
    categoria: "Refeições",
    subcategoria: "Ovos",
    pairing: {
      nome: "Sumo de Laranja Natural",
      frase_venda:
        "Para completar o iogurte com granola, sugiro o Sumo de Laranja Natural — fresco e vitamínico. Aceita?",
      preco: 3.8,
    },
  },

  // ─────────────── CAFETARIA · CAFÉ EM ESPRESSO ───────────────
  {
    id: "espresso-our-blend",
    nome: "Espresso Our Blend",
    descricao: "Combinação de robustas e arábicas, com notas de cacau e avelã torrada.",
    preco: 1.4,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Pastel de Nata",
      frase_venda:
        "Um Espresso pede um Pastel de Nata — a combinação portuguesa por excelência, doce e crocante. Junto?",
      preco: 1.6,
    },
  },
  {
    id: "espresso-heritage",
    nome: "Espresso Heritage Blend",
    descricao:
      "Blend dedicado à Ásia, muito equilibrado, com notas de cacau e noz.",
    preco: 2.3,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Bolo do Dia",
      frase_venda:
        "Com o Heritage Blend, recomendo uma fatia do nosso Bolo do Dia — caseiro e acabado de fazer, eleva as notas tostadas do café. Aceita?",
      preco: 3.5,
    },
  },
  {
    id: "espresso-pure-arabica",
    nome: "Espresso Pure Arabica",
    descricao: "100% arábica, acidez rica e sabor a noz e chocolate.",
    preco: 1.8,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Cookie",
      frase_venda:
        "O Pure Arabica combina divinalmente com a nossa Cookie — o amargo elegante do café equilibra o doce dos pedaços de chocolate. Sirvo?",
      preco: 3.0,
    },
  },
  {
    id: "espresso-single-origin",
    nome: "Espresso Single-Origin",
    descricao: "A expressão máxima de uma origem geográfica — pergunte qual está disponível.",
    preco: 2.4,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Tarte de Amêndoa",
      frase_venda:
        "Para um Single-Origin, sugiro a nossa Tarte de Amêndoa — a sua doçura subtil deixa as notas de origem do café brilharem. Adiciono?",
      preco: 4.0,
    },
  },
  {
    id: "cappuccino",
    nome: "Cappuccino",
    descricao: "Espresso e creme de leite vaporizado.",
    preco: 4.0,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Cinnamon Roll",
      frase_venda:
        "Um Cappuccino pede um Cinnamon Roll — quente, com canela e mel, é uma combinação acolhedora e irresistível. Aceita?",
      preco: 3.5,
    },
  },
  {
    id: "flat-white",
    nome: "Flat White",
    descricao: "Duplo espresso e leite emulsionado em microespuma.",
    preco: 4.2,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Pain au Chocolat",
      frase_venda:
        "Com o Flat White, recomendo o nosso Pain au Chocolat — folhado estaladiço e chocolate negro, um par clássico de café especialidade. Junto?",
      preco: 3.5,
    },
  },
  {
    id: "latte-macchiato",
    nome: "Latte Macchiato",
    descricao: "Espresso com espuma de leite.",
    preco: 4.0,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "New York Roll",
      frase_venda:
        "Com o Latte Macchiato, o nosso New York Roll é a estrela — folhado, recheado e indulgente. Sirvo?",
      preco: 4.5,
    },
  },
  {
    id: "espresso-macchiato",
    nome: "Espresso Macchiato",
    descricao: "Espresso com pequena dose de espuma de leite.",
    preco: 2.0,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Bolo de Arroz",
      frase_venda:
        "Um Espresso Macchiato pede um Bolo de Arroz — tradição portuguesa, simples e perfeita para acompanhar. Adiciono?",
      preco: 1.8,
    },
  },
  {
    id: "mocha",
    nome: "Mocha",
    descricao: "Espresso, chocolate e espuma de leite.",
    preco: 4.5,
    categoria: "Cafetaria",
    subcategoria: "Café em Espresso",
    pairing: {
      nome: "Cookie",
      frase_venda:
        "Para reforçar a indulgência do Mocha, sugiro a nossa Cookie — chocolate sobre chocolate, uma pausa decadente. Aceita?",
      preco: 3.0,
    },
  },

  // ─────────────── CAFETARIA · CAFÉ DE FILTRO ───────────────
  {
    id: "cold-brew",
    nome: "Cold Brew Pure Arabica",
    descricao: "Extração a frio durante 9h — mais aroma, menos acidez. 250ml.",
    preco: 5.0,
    categoria: "Cafetaria",
    subcategoria: "Café de Filtro",
    pairing: {
      nome: "Tarte Banoffee",
      frase_venda:
        "O Cold Brew combina lindamente com a nossa Tarte Banoffee — o frio e a complexidade do café cortam a doçura do caramelo e banana. Sirvo?",
      preco: 5.5,
    },
  },
  {
    id: "aeropress",
    nome: "AeroPress® Pure Arabica",
    descricao: "Pressão manual e filtro de papel — bebida compacta, rica e equilibrada.",
    preco: 5.5,
    categoria: "Cafetaria",
    subcategoria: "Café de Filtro",
    pairing: {
      nome: "Bolo sem Glúten",
      frase_venda:
        "Para acompanhar o AeroPress, sugiro uma fatia do nosso Bolo sem Glúten — leve e elegante, deixa o café ser o protagonista. Adiciono?",
      preco: 4.0,
    },
  },
  {
    id: "french-press",
    nome: "French Press Pure Arabica",
    descricao: "Imersão em água quente — café encorpado, com textura e aromas pronunciados.",
    preco: 5.5,
    categoria: "Cafetaria",
    subcategoria: "Café de Filtro",
    pairing: {
      nome: "Tiramisù Clássico",
      frase_venda:
        "O French Press encorpado pede o nosso Tiramisù Clássico — café com café, uma harmonização italiana de luxo. Aceita?",
      preco: 5.5,
    },
  },
  {
    id: "v60-pour-over",
    nome: "V60 Pour Over · Single-Origin",
    descricao: "Extração lenta em V60, preparada na mesa — perfil aromático, leve e frutado.",
    preco: 6.5,
    categoria: "Cafetaria",
    subcategoria: "Café de Filtro",
    pairing: {
      nome: "Pastel de Nata",
      frase_venda:
        "O V60 leve e frutado pede um Pastel de Nata — doçura cremosa que realça as notas do single-origin. Sirvo?",
      preco: 1.6,
    },
  },
  {
    id: "chemex-partilha",
    nome: "Chemex em Jarra · Partilha",
    descricao: "Chemex 50cl servida em jarra de vidro na mesa — extração suave e limpa para 2.",
    preco: 8.0,
    categoria: "Cafetaria",
    subcategoria: "Café de Filtro",
    pairing: {
      nome: "Tábua de Pastelaria Mini",
      frase_venda:
        "Para acompanhar a Chemex de partilha, sugiro a Tábua de Pastelaria Mini — variedade de doces para prolongar a conversa. Aceita?",
      preco: 9.5,
    },
  },


  // ─────────────── CAFETARIA · CAMPANHAS ───────────────
  {
    id: "blue-latte",
    nome: "Blue Latte",
    descricao: "Espresso, leite vaporizado e spirulina azul — assinatura Delta.",
    preco: 6.5,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Cinnamon Roll",
      frase_venda:
        "O nosso Blue Latte fica espetacular com um Cinnamon Roll — o doce da canela equilibra a frescura herbal da spirulina. Junto?",
      preco: 3.5,
    },
  },
  {
    id: "pistacchio-latte",
    nome: "Pistacchio Latte",
    descricao: "Espresso, espuma de leite e pistacchio.",
    preco: 6.0,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Affogatto Pistacchio",
      frase_venda:
        "Se gosta do nosso Pistacchio Latte, vai adorar o Affogatto Pistacchio — espresso quente sobre gelado de nata e pistacchio. Sugere ao cliente como sobremesa?",
      preco: 7.0,
    },
  },
  {
    id: "golden-latte",
    nome: "Golden Latte",
    descricao: "Curcuma e leite vaporizado.",
    preco: 6.0,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Tarte de Amêndoa",
      frase_venda:
        "Com o Golden Latte, a Tarte de Amêndoa é a escolha ideal — a doçura subtil acompanha o calor da curcuma. Adiciono?",
      preco: 4.0,
    },
  },
  {
    id: "matcha-latte",
    nome: "Matcha Latte",
    descricao: "Matcha cerimonial e leite vaporizado.",
    preco: 6.0,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Cookie",
      frase_venda:
        "Um Matcha Latte pede uma Cookie — o herbal do matcha equilibra o chocolate, uma pausa moderna e elegante. Aceita?",
      preco: 3.0,
    },
  },
  {
    id: "spicy-coffee",
    nome: "Spicy Coffee",
    descricao: "Espresso, espuma de leite e gengibre.",
    preco: 6.0,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Pastel de Nata",
      frase_venda:
        "O picante suave do Spicy Coffee combina lindamente com um Pastel de Nata polvilhado de canela — quente, especiado e irresistível. Junto?",
      preco: 1.6,
    },
  },
  {
    id: "peach-ginger-frappe",
    nome: "Peach and Ginger Frappé",
    descricao: "Espresso, xarope de pêssego, ginger beer e gelo.",
    preco: 7.0,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Salada de Fruta Fresca",
      frase_venda:
        "Para acompanhar este frappé refrescante, sugiro a nossa Salada de Fruta Fresca — leve, colorida e perfeita para um momento de verão. Aceita?",
      preco: 3.0,
    },
  },
  {
    id: "affogatto-pistacchio",
    nome: "Affogatto Pistacchio",
    descricao: "Espresso sobre bola de gelado de nata e pistacchio.",
    preco: 7.0,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Espresso Martini",
      frase_venda:
        "Para prolongar o momento doce, sugiro um Espresso Martini — espresso, vodka e licor de café, sofisticação líquida. Posso preparar?",
      preco: 10.0,
    },
  },
  {
    id: "saco-cafe-250",
    nome: "Saco de Café 250gr · Our Blend",
    descricao: "Para levar para casa. Cada saco vendido injeta +1,50€ no Fundo do Jantar de Natal da equipa.",
    preco: 9.5,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Espresso Our Blend (loja)",
      frase_venda:
        "Leve um Espresso Our Blend agora para experimentar o mesmo blend do saco em casa — torrado fresco esta semana. Sirvo?",
      preco: 1.4,
    },
  },
  {
    id: "saco-cafe-pure-arabica",
    nome: "Saco de Café 250gr · Pure Arabica",
    descricao: "100% Arábica para levar. Cada saco vendido injeta +1,50€ no Fundo do Jantar de Natal.",
    preco: 11.0,
    categoria: "Cafetaria",
    subcategoria: "Campanhas",
    pairing: {
      nome: "Espresso Pure Arabica",
      frase_venda:
        "Antes de levar o saco, experimente o Espresso Pure Arabica para confirmar o perfil aromático. Sirvo?",
      preco: 1.8,
    },
  },

  // ─────────────── PASTELARIA & SOBREMESAS · DOCES ───────────────
  {
    id: "pastel-nata",
    nome: "Pastel de Nata",
    descricao: "Massa folhada estaladiça e creme aveludado, polvilhado de canela.",
    preco: 1.6,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Doces",
    pairing: {
      nome: "Espresso Our Blend",
      frase_venda:
        "Nada como acompanhar o Pastel de Nata com o nosso Espresso Our Blend — a tradição portuguesa no seu melhor. Sirvo já?",
      preco: 1.4,
    },
  },
  {
    id: "new-york-roll",
    nome: "New York Roll",
    descricao: "Folhado em espiral, recheado e indulgente.",
    preco: 4.5,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Doces",
    pairing: {
      nome: "Latte Macchiato",
      frase_venda:
        "Um New York Roll pede um Latte Macchiato — cremoso e equilibrado, é o par perfeito para um momento gourmet. Adiciono?",
      preco: 4.0,
    },
  },
  {
    id: "cinnamon-roll",
    nome: "Cinnamon Roll",
    descricao: "Massa fofa, canela e cobertura doce.",
    preco: 3.5,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Doces",
    pairing: {
      nome: "Cappuccino",
      frase_venda:
        "Com um Cinnamon Roll acabado de aquecer, um Cappuccino cremoso eleva a experiência — canela e leite vaporizado, puro conforto. Aceita?",
      preco: 4.0,
    },
  },
  {
    id: "pain-chocolat",
    nome: "Pain au Chocolat",
    descricao: "Folhado francês com chocolate.",
    preco: 3.5,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Doces",
    pairing: {
      nome: "Flat White",
      frase_venda:
        "Para acompanhar o Pain au Chocolat, recomendo um Flat White — café especialidade que valoriza o chocolate sem o sobrepor. Sirvo?",
      preco: 4.2,
    },
  },
  {
    id: "cookie",
    nome: "Cookie",
    descricao: "Cookie americana com pedaços de chocolate.",
    preco: 3.0,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Doces",
    pairing: {
      nome: "Mocha",
      frase_venda:
        "Uma Cookie pede o nosso Mocha — espresso, chocolate e espuma de leite, dose dupla de prazer. Adiciono?",
      preco: 4.5,
    },
  },
  {
    id: "tarte-amendoa",
    nome: "Tarte de Amêndoa",
    descricao: "Fatia de tarte tradicional de amêndoa.",
    preco: 4.0,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Doces",
    pairing: {
      nome: "Espresso Single-Origin",
      frase_venda:
        "Para a Tarte de Amêndoa, sugiro um Espresso Single-Origin — a sua complexidade aromática realça os sabores tostados da amêndoa. Aceita?",
      preco: 2.4,
    },
  },

  // ─────────────── PASTELARIA & SOBREMESAS · SOBREMESAS ───────────────
  {
    id: "tiramisu",
    nome: "Tiramisù Clássico",
    descricao: "Receita tradicional italiana com café, mascarpone e cacau.",
    preco: 5.5,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Sobremesas",
    pairing: {
      nome: "Espresso Martini",
      frase_venda:
        "O Tiramisù pede um Espresso Martini — para terminar a refeição com sofisticação italiana e um toque festivo. Posso preparar?",
      preco: 10.0,
    },
  },
  {
    id: "banoffee",
    nome: "Tarte Banoffee",
    descricao: "Base crocante, banana, caramelo toffee e natas.",
    preco: 5.5,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Sobremesas",
    pairing: {
      nome: "Cold Brew Pure Arabica",
      frase_venda:
        "A Tarte Banoffee fica perfeita com o nosso Cold Brew — o frio e a baixa acidez cortam a doçura do caramelo. Sirvo?",
      preco: 5.0,
    },
  },
  {
    id: "fruta-fresca",
    nome: "Salada de Fruta Fresca",
    descricao: "Mix de fruta da época cortada na hora.",
    preco: 3.0,
    categoria: "Pastelaria & Sobremesas",
    subcategoria: "Sobremesas",
    pairing: {
      nome: "Chá Branco",
      frase_venda:
        "Com a Salada de Fruta Fresca, sugiro o nosso Chá Branco — delicado e floral, prolonga a leveza do momento. Adiciono?",
      preco: 3.5,
    },
  },
];

export interface GrainOption {
  id: string;
  nome: string;
  descricao: string;
  adicional: number;
}

export interface MilkOption {
  id: string;
  nome: string;
  adicional: number;
}

export const GRAINS: GrainOption[] = [
  { id: "grain-che2", nome: "Delta CHE2", descricao: "Combinação clássica robusta/arábica com cacau/avelã", adicional: 0.0 },
  { id: "grain-heritage", nome: "Delta Heritage", descricao: "Blend asiático com notas de cacau e noz", adicional: 0.0 },
  { id: "grain-toki", nome: "Impossible Toki", descricao: "Cafés Impossible - notas florais e citrinas vibrantes", adicional: 1.0 },
  { id: "grain-tolima", nome: "Impossible Tolima", descricao: "Cafés Impossible - perfil doce de caramelo e chocolate", adicional: 1.0 },
  { id: "grain-impossible-java", nome: "Impossible Java", descricao: "Cafés Impossible - encorpado, terroso e picante", adicional: 1.0 },
  { id: "grain-impossible-moka", nome: "Impossible Moka", descricao: "Cafés Impossible - aromático, frutado com bagas silvestres", adicional: 1.0 },
  { id: "grain-ethiopia", nome: "Etiópia Yirgacheffe", descricao: "Single-Origin - acidez floral, jasmim e limão", adicional: 0.5 },
  { id: "grain-colombia", nome: "Colômbia Excelso", descricao: "Single-Origin - notas de caramelo e frutos vermelhos", adicional: 0.5 },
  { id: "grain-brazil", nome: "Brasil Sul de Minas", descricao: "Single-Origin - doce, acidez baixa, avelã e chocolate", adicional: 0.5 },
  { id: "grain-kenya", nome: "Quénia AA", descricao: "Single-Origin - encorpado com acidez cítrica e groselha", adicional: 0.5 },
  { id: "grain-india", nome: "Índia Malabar", descricao: "Single-Origin - encorpado, notas de especiarias e chocolate", adicional: 0.5 },
];

export const MILK_ALTERNATIVES: MilkOption[] = [
  { id: "milk-aveia", nome: "Leite de Aveia", adicional: 0.5 },
  { id: "milk-amendoa", nome: "Leite de Amêndoa", adicional: 0.5 },
  { id: "milk-coco", nome: "Leite de Côco", adicional: 0.5 },
  { id: "milk-semlactose", nome: "Leite Sem Lactose", adicional: 0.3 },
  { id: "milk-soja", nome: "Leite de Soja", adicional: 0.3 },
];

export const MILK_EXTRAS: MilkOption[] = [
  { id: "milk-extra-quente", nome: "Leite Quente à parte", adicional: 0.4 },
  { id: "milk-extra-frio", nome: "Leite Frio à parte", adicional: 0.4 },
  { id: "milk-extra-espuma", nome: "Extra Espuma de Leite", adicional: 0.2 },
];

