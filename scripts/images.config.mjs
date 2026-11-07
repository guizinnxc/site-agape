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
  item('vitrine-miguel', 'maps-miguel/maps-mig-03.jpg'),
  item('torta-surpresa', 'maps-miguel/maps-mig-04.jpg', { crop: { left: 0.25, top: 0, width: 0.75, height: 0.55 } }),
  item('rocambole', 'maps-miguel/maps-mig-05.jpg', { crop: { left: 0.35, top: 0, width: 0.65, height: 0.65 } }),
  item('salao-miguel', 'maps-miguel/maps-mig-06.jpg'),
  item('balcao-miguel', 'maps-miguel/maps-mig-07.jpg'),
  item('tranca-coco', 'maps-miguel/maps-mig-08.jpg', { crop: { left: 0, top: 0, width: 1, height: 0.62 } }),
  item('cafe-manha', 'maps-miguel/maps-mig-10.jpg'),
  item('torta-pudim', 'instagram/post-DZz82hDEUnh-2.jpg'),
  item('torta-pudim-duo', 'instagram/post-DZz82hDEUnh-1.jpg', { crop: { left: 0, top: 0.28, width: 1, height: 0.72 } }),
  item('bolo-festa', 'instagram/post-De5L3iXRbiT-1.jpg'),
];
