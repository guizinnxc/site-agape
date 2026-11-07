// Origem relativa a assets/originais/. Frações de crop (0–1) incidem sobre a imagem já girada pelo EXIF.
const D = [480, 960, 1600];
const item = (id, src, extra = {}) => ({
  id,
  src,
  credit: src.startsWith('instagram/') ? 'instagram' : 'maps',
  widths: D,
  ...extra,
});

export const IMAGES = [
  item('vitrine-arcozelo', 'maps-arcozelo/maps-arc-01.jpg', { widths: [640, 1200, 1600] }),
  // Hero no tablet/desktop: recorte em pé da vitrine de Arcozelo (tortinhas, sonhos e docinhos),
  // acima da fileira de baixo, onde ficam as etiquetas com preço.
  item('vitrine-arco', 'maps-arcozelo/maps-arc-01.jpg', { crop: { left: 0.18, top: 0.05, width: 0.42, height: 0.725 }, widths: [480, 672] }),
  item('paes-estante', 'maps-arcozelo/maps-arc-07.jpg'),
  item('pao-frances', 'maps-arcozelo/maps-arc-06.jpg', { widths: [480, 600] }),
  item('sonhos', 'maps-arcozelo/maps-arc-03.jpg'),
  item('bolos-chocolate', 'maps-arcozelo/maps-arc-02.jpg'),
  item('doces-chocolate', 'maps-arcozelo/maps-arc-04.jpg'),
  item('ilha-paes', 'maps-arcozelo/maps-arc-05.jpg'),
  item('cafe-neon', 'maps-arcozelo/maps-arc-08.jpg'),
  item('mercearia', 'maps-arcozelo/maps-arc-10.jpg'),
  item('fachada-miguel', 'maps-miguel/maps-mig-01.jpg'),
  item('bolo-cerejas', 'maps-miguel/maps-mig-02.jpg'),
  // focal: object-position do recorte em capa; o topo de morangos fica à vista.
  item('torta-surpresa', 'maps-miguel/maps-mig-04.jpg', { crop: { left: 0.25, top: 0, width: 0.75, height: 0.55 }, focal: '50% 20%' }),
  item('rocambole', 'maps-miguel/maps-mig-05.jpg', { crop: { left: 0.35, top: 0, width: 0.65, height: 0.65 } }),
  item('salao-miguel', 'maps-miguel/maps-mig-06.jpg'),
  item('balcao-miguel', 'maps-miguel/maps-mig-07.jpg'),
  item('tranca-coco', 'maps-miguel/maps-mig-08.jpg', { crop: { left: 0, top: 0, width: 1, height: 0.62 } }),
  item('torta-pudim', 'instagram/post-DZz82hDEUnh-2.jpg'),
  item('torta-pudim-duo', 'instagram/post-DZz82hDEUnh-1.jpg', { crop: { left: 0, top: 0.28, width: 1, height: 0.72 } }),
  item('bolo-festa', 'instagram/post-De5L3iXRbiT-1.jpg'),
  // Hero no celular: retrato da vitrine de Miguel Pereira (tortinhas, pães de coco e donuts).
  // Etiquetas antigas só no terço de baixo, sob o véu escuro do hero.
  item('vitrine-retrato', 'maps-miguel/maps-mig-03.jpg', { crop: { left: 0.0625, top: 0.1, width: 0.245, height: 0.9 } }),
  // Capítulo IV — De perto: recortes fechados de textura, sem etiquetas de preço.
  item('sonho-acucar', 'maps-arcozelo/maps-arc-03.jpg', { crop: { left: 0.344, top: 0, width: 0.469, height: 1 } }),
  item('bolo-farofa', 'maps-miguel/maps-mig-02.jpg', { crop: { left: 0.3, top: 0.18, width: 0.4, height: 0.82 } }),
  item('pao-na-chapa', 'maps-miguel/maps-mig-10.jpg', { crop: { left: 0.156, top: 0.29, width: 0.375, height: 0.71 } }),
];
