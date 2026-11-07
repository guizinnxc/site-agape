// Fonte única de texto e dados do site. Somente fatos confirmados (spec §3).
// Nunca incluir preços, horários (só o aviso hoursNote), nem ingredientes não citados.

export const site = {
  name: 'Padaria e Confeitaria Ágape',
  since: 2012,
  tagline: 'Delícias artesanais todos os dias',
  motto: 'A vida começa depois do café',
  instagram: 'https://www.instagram.com/padariaagape25/',
  whatsappDisplay: '(24) 98110-0190',
  hoursNote: 'Confirme o horário do dia pelo WhatsApp antes de vir',
};

export const creditText = {
  instagram: 'Foto: Instagram @padariaagape25',
  maps: 'Foto: cliente no Google Maps',
};

export const chapters = [
  { n: 1, roman: 'I', slug: 'vitrine', name: 'A vitrine acende' },
  { n: 2, roman: 'II', slug: 'fornada', name: 'A fornada' },
  { n: 3, roman: 'III', slug: 'confeitaria', name: 'Confeitaria' },
  { n: 4, roman: 'IV', slug: 'perto', name: 'De perto' },
  { n: 5, roman: 'V', slug: 'casas', name: 'Duas casas' },
  { n: 6, roman: 'VI', slug: 'visite', name: 'Visite e encomende' },
];

export const houses = [
  {
    slug: 'arcozelo',
    name: 'Padaria Ágape Arcozelo',
    shortName: 'Arcozelo',
    address: 'R. Dr. Mario Kroeff, 95, Arcozelo, Paty do Alferes, RJ, 26950-000',
    postalCode: '26950-000',
    locality: 'Paty do Alferes',
    lat: -22.4071627,
    lng: -43.4226476,
    note: 'Casa reinaugurada em 2 de outubro de 2026',
    accent: 'gold',
    images: [
      { id: 'ilha-paes', caption: 'Pães na ilha', alt: 'Ilha central da padaria de Arcozelo com pães expostos' },
      { id: 'cafe-neon', caption: 'Letreiro do café', alt: 'Canto do café na loja de Arcozelo, com letreiro luminoso ao fundo' },
      { id: 'mercearia', caption: 'Mercearia', alt: 'Prateleiras da mercearia dentro da loja de Arcozelo' },
    ],
  },
  {
    slug: 'miguel-pereira',
    name: 'Padaria Ágape Gourmet',
    shortName: 'Miguel Pereira',
    address: 'R. Francisco Alves, 57, Loja 3, Centro, Miguel Pereira, RJ, 26900-000',
    postalCode: '26900-000',
    locality: 'Miguel Pereira',
    lat: -22.4545576,
    lng: -43.4712167,
    note: 'A casa de Miguel Pereira',
    accent: 'terracotta',
    images: [
      { id: 'fachada-miguel', caption: 'Fachada', alt: 'Fachada da loja da Padaria Ágape em Miguel Pereira' },
      { id: 'salao-miguel', caption: 'Salão', alt: 'Interior da loja de Miguel Pereira com vitrine refrigerada e a frase na parede ao fundo' },
      { id: 'balcao-miguel', caption: 'Balcão', alt: 'Balcão de atendimento da loja de Miguel Pereira' },
    ],
  },
];

export const products = [
  // Capítulo II, A fornada (ordem = ordem visual da colagem: destaque primeiro).
  // Fotos e nomes do Instagram da padaria.
  { id: 'pao-fermentacao', name: 'Pão de fermentação natural', chapter: 'fornada', image: 'pao-fermentacao',
    alt: 'Quatro pães compridos de casca dourada e enfarinhada, lado a lado em uma cesta', caption: 'Pão de fermentação natural' },
  { id: 'pao-sovado', name: 'Pão sovado com farofa doce', chapter: 'fornada', image: 'pao-sovado',
    alt: 'Pães sovados cobertos de farofa doce dourada, empilhados em uma cesta de vime', caption: 'Pão sovado com farofa doce' },
  { id: 'paes-trancados', name: 'Pães trançados', chapter: 'fornada', image: 'paes-trancados',
    alt: 'Cesta cheia de pães trançados dourados, salpicados de ervas verdes', caption: 'Pães trançados' },
  { id: 'esfihas', name: 'Esfiha', chapter: 'fornada', image: 'esfihas',
    alt: 'Esfihas abertas recém-saídas do forno, lado a lado em uma bandeja', caption: 'Esfiha' },
  { id: 'bolo-pamonha', name: 'Bolo de pamonha', chapter: 'fornada', image: 'bolo-pamonha',
    alt: 'Bolos de pamonha dourados com palha de milho, enfileirados na vitrine', caption: 'Bolo de pamonha' },
  { id: 'bolo-caseiro', name: 'Bolos caseiros', chapter: 'fornada', image: 'bolo-caseiro',
    alt: 'Bolo caseiro redondo com furo no meio, coberto de caldas escorridas, em um prato', caption: 'Bolos caseiros todos os dias' },
  { id: 'roscas', name: 'Roscas', chapter: 'fornada', image: 'roscas',
    alt: 'Roscas embaladas em saquinhos com o selo da Padaria Ágape, em uma prateleira', caption: 'Roscas' },
  // Capítulo III, Confeitaria (prateleira)
  { id: 'tortinhas-morango', name: 'Tortinhas de morango', chapter: 'confeitaria', image: 'tortinhas-morango',
    alt: 'Duas tortinhas de morango em pratos sobre o balcão de vidro, com a vitrine de pães ao fundo', caption: 'Tortinhas de morango' },
  { id: 'tortelete-limao', name: 'Tortelete de limão', chapter: 'confeitaria', image: 'tortelete-limao',
    alt: 'Seis torteletes com cobertura branca e raspas de limão em uma bandeja', caption: 'Tortelete de limão' },
  { id: 'macarons', name: 'Macarons', chapter: 'confeitaria', image: 'macarons',
    alt: 'Macarons coloridos empilhados em um prato branco', caption: 'Macarons' },
  { id: 'mil-folhas', name: 'Mil-folhas nevado', chapter: 'confeitaria', image: 'mil-folhas',
    alt: 'Mil-folhas polvilhados de açúcar, com morangos e raspas de chocolate por cima', caption: 'Mil-folhas nevado' },
  { id: 'brownie-recheado', name: 'Brownie recheado', chapter: 'confeitaria', image: 'brownie-recheado',
    alt: 'Brownie recheado em camadas, decorado com chocolate branco, em um prato', caption: 'Brownie recheado' },
  { id: 'quindim', name: 'Quindim', chapter: 'confeitaria', image: 'quindim',
    alt: 'Quindim amarelo e brilhante em uma forminha de papel, sobre um prato branco', caption: 'Quindim' },
  { id: 'croissant-amor', name: 'Croissant do amor', chapter: 'confeitaria', image: 'croissant-amor',
    alt: 'Croissant recheado de morango e chocolate sobre uma tábua de madeira', caption: 'Croissant do amor' },
  { id: 'torta-amendoim', name: 'Torta de amendoim com chocolate', chapter: 'confeitaria', image: 'torta-amendoim',
    alt: 'Fatia de torta com creme claro e faixas de cobertura de chocolate, em um prato', caption: 'Torta de amendoim com chocolate' },
  { id: 'torta-pudim', name: 'Torta Pudim', chapter: 'confeitaria', image: 'torta-pudim',
    alt: 'Torta em camadas com cobertura branca escorrida e topo alaranjado, vista em corte', caption: 'Torta Pudim em corte' },
  { id: 'torta-chantilly', name: 'Tortas a pronta entrega', chapter: 'confeitaria', image: 'torta-chantilly',
    alt: 'Torta redonda com bordas de chantilly, cobertura de chocolate e cerejas no centro, lateral com farofa', caption: 'Tortas a pronta entrega' },
  { id: 'bolo-frutas-vermelhas', name: 'Bolos sob encomenda', chapter: 'confeitaria', image: 'bolo-frutas-vermelhas', tag: 'Sob encomenda',
    alt: 'Bolo de chocolate com morangos e mirtilos no topo, envolto em uma fita preta com o nome Padaria Ágape', caption: 'Bolo de chocolate com frutas vermelhas' },
  // Capítulo IV, De perto
  { id: 'chocolate-quente', name: 'Chocolate quente', chapter: 'perto', image: 'chocolate-quente',
    alt: 'Taça de chocolate quente com chantilly e chocolate em barra espetado no topo, vista de perto', caption: 'Chocolate quente' },
  { id: 'tortelete-physalis', name: 'Chocolate e physalis', chapter: 'perto', image: 'tortelete-physalis',
    alt: 'Tortelete com creme, pedaços de chocolate e physalis, visto bem de perto', caption: 'Chocolate e physalis' },
  { id: 'chantilly-cereja', name: 'Chantilly e cereja', chapter: 'perto', image: 'chantilly-cereja',
    alt: 'Torta com espiral de chantilly polvilhado, cereja e physalis no topo, vista de perto', caption: 'Chantilly e cereja' },
];

export const alsoMade = [
  'Pão francês',
  'Sonho',
  'Trança recheada de coco',
  'Pão na chapa',
  'Pão com salame',
  'Pão de queijo',
  'Lasanha no pão',
  'Rocambole',
  'Torta Alemã',
  'Bolo de aipim',
  'Capuccino Galak',
  'Café',
];

export const credits = [
  'Fotos: Instagram @padariaagape25',
  'Fotos de clientes publicadas no Google Maps',
];

// Pendências de conteúdo (spec §3). Documentação; não renderizadas na página.
export const pending = [
  'Horário completo por dia (o Google Maps só confirma sexta, 06:00–21:00): o site mostra apenas "Confirme o horário do dia pelo WhatsApp antes de vir".',
  'Preços: não exibidos (etiquetas nas fotos de clientes são antigas).',
  'Qual loja atende o WhatsApp e área de delivery: texto genérico "Encomendas e delivery".',
  'Autorização formal de uso das fotos de clientes do Maps: créditos no rodapé e nota no README.',
  'Confirmar se a Torta Pudim ainda é novidade (post de junho de 2026): o site não usa mais a etiqueta "Novidade".',
  'Nome exato das roscas embaladas (o catálogo das fotos as descreve como roscas ou biscoitos): o site usa "Roscas".',
];
