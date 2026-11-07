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
    address: 'R. Dr. Mario Kroeff, 95 – Arcozelo, Paty do Alferes – RJ, 26950-000',
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
    address: 'R. Francisco Alves, 57 – Lj 3 – Centro, Miguel Pereira – RJ, 26900-000',
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
  // Capítulo II — A fornada (ordem = ordem visual da colagem: destaque primeiro)
  { id: 'paes-estante', name: 'Pães da casa', chapter: 'fornada', image: 'paes-estante',
    alt: 'Estante da padaria cheia de pães variados', caption: 'Pães da casa' },
  { id: 'sonhos', name: 'Sonho', chapter: 'fornada', image: 'sonhos',
    alt: 'Seis sonhos polvilhados com açúcar em um prato', caption: 'Sonho' },
  { id: 'tranca-coco', name: 'Trança recheada de coco', chapter: 'fornada', image: 'tranca-coco',
    alt: 'Trança de massa dourada embalada em bandeja, com etiqueta da Padaria Ágape Miguel Pereira', caption: 'Trança recheada de coco' },
  { id: 'pao-frances', name: 'Pão francês', chapter: 'fornada', image: 'pao-frances',
    alt: 'Pães franceses dourados reunidos em uma cesta', caption: 'Pão francês' },
  // Capítulo III — Confeitaria
  { id: 'torta-pudim', name: 'Torta Pudim', chapter: 'confeitaria', image: 'torta-pudim',
    alt: 'Torta em camadas com cobertura branca escorrida e topo alaranjado, vista em corte', caption: 'Torta Pudim em corte' },
  { id: 'torta-pudim-duo', name: 'Torta Pudim', chapter: 'confeitaria', image: 'torta-pudim-duo',
    alt: 'Duas tortas retangulares em bandejas brancas, uma com cobertura clara e outra com raspas de chocolate', caption: 'Torta Pudim' },
  { id: 'rocambole', name: 'Rocambole', chapter: 'confeitaria', image: 'rocambole',
    alt: 'Rocambole fatiado exposto na vitrine da confeitaria', caption: 'Rocambole' },
  { id: 'torta-surpresa', name: 'Torta surpresa de morango com chocolate', chapter: 'confeitaria', image: 'torta-surpresa',
    alt: 'Torta surpresa de morango com chocolate na vitrine', caption: 'Torta surpresa de morango com chocolate' },
  { id: 'bolo-cerejas', name: 'Bolos da vitrine', chapter: 'confeitaria', image: 'bolo-cerejas',
    alt: 'Bolo com cobertura crocante e cerejas, em um prato na vitrine', caption: 'Bolos da vitrine' },
  { id: 'bolos-chocolate', name: 'Bolos de chocolate', chapter: 'confeitaria', image: 'bolos-chocolate',
    alt: 'Quatro bolos de chocolate com coberturas variadas sobre pratos', caption: 'Bolos de chocolate' },
  { id: 'doces-chocolate', name: 'Doces de chocolate', chapter: 'confeitaria', image: 'doces-chocolate',
    alt: 'Doces de chocolate com coberturas variadas, em embalagens individuais', caption: 'Doces de chocolate' },
  { id: 'bolo-festa', name: 'Bolos sob encomenda', chapter: 'confeitaria', image: 'bolo-festa', tag: 'Sob encomenda',
    alt: 'Bolo com chantilly e calda de chocolate, ao lado de Papai Noel, ursinho e árvores de Natal', caption: 'Transformamos sonhos em bolo' },
  // Capítulo IV — De perto
  { id: 'sonho-acucar', name: 'Açúcar no sonho', chapter: 'perto', image: 'sonho-acucar',
    alt: 'Sonhos polvilhados com açúcar, com recheio cremoso amarelo, vistos bem de perto', caption: 'Açúcar no sonho' },
  { id: 'bolo-farofa', name: 'Farofa e cerejas', chapter: 'perto', image: 'bolo-farofa',
    alt: 'Cerejas sobre bolinhas de cobertura marrom, farofa crocante e as camadas de um bolo, vistas de perto', caption: 'Farofa e cerejas' },
  { id: 'pao-na-chapa', name: 'Pão na chapa', chapter: 'perto', image: 'pao-na-chapa',
    alt: 'Duas fatias de pão na chapa, douradas e tostadas, em um prato branco com o logo da Padaria Ágape', caption: 'Pão na chapa' },
];

export const alsoMade = ['Lasanha no pão', 'Pão de queijo', 'Bolo de aipim', 'Chocolate quente', 'Café'];

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
];
