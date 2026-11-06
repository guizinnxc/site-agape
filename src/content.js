// Fonte única de texto e dados do site. Somente fatos confirmados (spec §3).
// Nunca incluir preços, horários além de hoursNote, nem ingredientes não citados.

export const site = {
  name: 'Padaria e Confeitaria Ágape',
  since: 2012,
  tagline: 'Delícias artesanais todos os dias',
  motto: 'A vida começa depois do café',
  instagram: 'https://www.instagram.com/padariaagape25/',
  whatsappDisplay: '(24) 98110-0190',
  hoursNote: 'Abre às 6h · confirme o horário do dia pelo WhatsApp',
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
    address: 'R. Dr. Mario Kroeff, 95 – Arcozelo, Paty do Alferes – RJ, 26950-000',
    postalCode: '26950-000',
    locality: 'Paty do Alferes',
    lat: -22.4071627,
    lng: -43.4226476,
    note: 'Casa reinaugurada em 2 de outubro de 2026',
    accent: 'gold',
    images: [
      { id: 'ilha-paes', alt: 'Ilha central da padaria de Arcozelo com pães expostos' },
      { id: 'cafe-neon', alt: 'Canto do café na loja de Arcozelo, com letreiro luminoso ao fundo' },
      { id: 'mercearia', alt: 'Prateleiras da mercearia dentro da loja de Arcozelo' },
    ],
  },
  {
    slug: 'miguel-pereira',
    name: 'Padaria Ágape Gourmet',
    shortName: 'Miguel Pereira',
    address: 'R. Francisco Alves, 57 – Lj 3 – Centro, Miguel Pereira – RJ, 26900-000',
    postalCode: '26900-000',
    locality: 'Miguel Pereira',
    lat: -22.4545576,
    lng: -43.4712167,
    note: 'A casa de Miguel Pereira',
    accent: 'terracotta',
    images: [
      { id: 'fachada-miguel', alt: 'Fachada da loja da Padaria Ágape em Miguel Pereira' },
      { id: 'salao-miguel', alt: 'Salão da loja de Miguel Pereira com mesas para o café' },
      { id: 'balcao-miguel', alt: 'Balcão de atendimento da loja de Miguel Pereira' },
    ],
  },
];

export const products = [
  // Capítulo II — A fornada
  { id: 'pao-frances', name: 'Pão francês', chapter: 'fornada', image: 'pao-frances',
    alt: 'Pães franceses dourados reunidos em uma cesta', caption: 'Pão francês, da fornada do dia' },
  { id: 'sonhos', name: 'Sonho', chapter: 'fornada', image: 'sonhos',
    alt: 'Sonhos polvilhados expostos na vitrine da padaria', caption: 'Sonho' },
  { id: 'tranca-coco', name: 'Trança recheada de coco', chapter: 'fornada', image: 'tranca-coco',
    alt: 'Trança de massa dourada, recheada de coco, sobre a bancada', caption: 'Trança recheada de coco' },
  { id: 'paes-estante', name: 'Pães da casa', chapter: 'fornada', image: 'paes-estante',
    alt: 'Estante da padaria cheia de pães variados', caption: 'Pães da casa' },
  { id: 'padeiros', name: 'Nossos padeiros', chapter: 'fornada', image: 'padeiros',
    alt: 'Equipe de padeiros trabalhando na produção da padaria', caption: 'Nossos padeiros' },
  // Capítulo III — Confeitaria
  { id: 'torta-pudim', name: 'Torta Pudim', chapter: 'confeitaria', image: 'torta-pudim', tag: 'Novidade',
    alt: 'Torta Pudim inteira, novidade da confeitaria', caption: 'Torta Pudim, a novidade da casa' },
  { id: 'torta-pudim-duo', name: 'Torta Pudim', chapter: 'confeitaria', image: 'torta-pudim-duo',
    alt: 'Fatias da Torta Pudim servidas sobre a mesa', caption: 'Torta Pudim' },
  { id: 'rocambole', name: 'Rocambole', chapter: 'confeitaria', image: 'rocambole',
    alt: 'Rocambole fatiado exposto na vitrine da confeitaria', caption: 'Rocambole' },
  { id: 'torta-surpresa', name: 'Torta surpresa de morango com chocolate', chapter: 'confeitaria', image: 'torta-surpresa',
    alt: 'Torta surpresa de morango com chocolate na vitrine', caption: 'Torta surpresa de morango com chocolate' },
  { id: 'bolo-cerejas', name: 'Bolos da vitrine', chapter: 'confeitaria', image: 'bolo-cerejas',
    alt: 'Bolos decorados com cerejas na vitrine da confeitaria', caption: 'Bolos da vitrine' },
  { id: 'bolos-chocolate', name: 'Bolos de chocolate', chapter: 'confeitaria', image: 'bolos-chocolate',
    alt: 'Bolos de chocolate alinhados na vitrine', caption: 'Bolos de chocolate' },
  { id: 'doces-chocolate', name: 'Doces de chocolate', chapter: 'confeitaria', image: 'doces-chocolate',
    alt: 'Doces de chocolate arrumados em bandeja na vitrine', caption: 'Doces de chocolate' },
  { id: 'bolo-festa', name: 'Bolos sob encomenda', chapter: 'confeitaria', image: 'bolo-festa', tag: 'Sob encomenda',
    alt: 'Bolo decorado para festa, feito sob encomenda', caption: 'Transformamos sonhos em bolo' },
  // Capítulo IV — De perto
  { id: 'vitrine-miguel', name: 'Vitrine de doces', chapter: 'perto', image: 'vitrine-miguel',
    alt: 'Vitrine de doces da loja de Miguel Pereira vista de perto', caption: 'Vitrine de doces' },
  { id: 'ilha-paes', name: 'Pães na ilha', chapter: 'perto', image: 'ilha-paes',
    alt: 'Pães dispostos na ilha central da loja, vistos de perto', caption: 'Pães na ilha' },
  { id: 'cafe-manha', name: 'Café da manhã', chapter: 'perto', image: 'cafe-manha',
    alt: 'Mesa posta para o café da manhã na padaria', caption: 'Café da manhã' },
];

export const alsoMade = ['Lasanha no pão', 'Pão de queijo', 'Bolo de aipim', 'Chocolate quente', 'Café'];

export const credits = [
  'Fotos: Instagram @padariaagape25',
  'Fotos de clientes publicadas no Google Maps',
];

// Pendências de conteúdo (spec §3). Documentação; não renderizadas na página.
export const pending = [
  'Horário completo por dia: o site mostra apenas "Abre às 6h · confirme o horário do dia pelo WhatsApp".',
  'Preços: não exibidos (etiquetas nas fotos de clientes são antigas).',
  'Qual loja atende o WhatsApp e área de delivery: texto genérico "Encomendas e delivery".',
  'Autorização formal de uso das fotos de clientes do Maps: créditos no rodapé e nota no README.',
];
