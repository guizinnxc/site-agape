// Origem relativa a assets/originais/. Frações de crop (0–1) incidem sobre a imagem já girada pelo EXIF.
const D = [480, 960, 1600];
export const item = (id, src, extra = {}) => ({
  id,
  src,
  // instagram/ e instagram-perfil/ são fotos do perfil da padaria; o resto, de clientes no Maps.
  credit: /^instagram(-perfil)?\//.test(src) ? 'instagram' : 'maps',
  widths: D,
  ...extra,
});

export const IMAGES = [
  item('vitrine-arcozelo', 'maps-arcozelo/maps-arc-01.jpg', { widths: [640, 1200, 1600] }),
  // Casas (capítulo V) e a ponte do café: fotos de lugar.
  item('ilha-paes', 'maps-arcozelo/maps-arc-05.jpg'),
  item('cafe-neon', 'maps-arcozelo/maps-arc-08.jpg'),
  item('mercearia', 'maps-arcozelo/maps-arc-10.jpg'),
  item('fachada-miguel', 'maps-miguel/maps-mig-01.jpg'),
  item('salao-miguel', 'maps-miguel/maps-mig-06.jpg'),
  item('balcao-miguel', 'maps-miguel/maps-mig-07.jpg'),
  // Hero no celular: retrato da vitrine de Miguel Pereira (tortinhas, pães de coco e donuts).
  // Etiquetas antigas só no terço de baixo, sob o véu escuro do hero.
  item('vitrine-retrato', 'maps-miguel/maps-mig-03.jpg', { crop: { left: 0.0625, top: 0.1, width: 0.245, height: 0.9 } }),

  // Capítulo II, A fornada: fotos do Instagram da padaria (retrato 3:4 e 4:5).
  // focal: object-position no recorte em capa de cada moldura (4:3, 1:1, 3:4).
  item('pao-fermentacao', 'instagram-perfil/ig-DLskFSLxA7--1.jpg'),
  item('pao-sovado', 'instagram-perfil/ig-DV1r8BkkUis-1.jpg', { focal: '50% 68%' }),
  item('paes-trancados', 'instagram-perfil/ig-DJcZzgRRbZt-1.jpg', { focal: '50% 62%' }),
  item('esfihas', 'instagram-perfil/ig-DIRocE2RC7J-1.jpg', { widths: [480, 960] }),
  item('bolo-pamonha', 'instagram-perfil/ig-DHrJG85x_Vy-1.jpg', { widths: [480, 960], focal: '50% 66%' }),
  item('bolo-caseiro', 'instagram-perfil/ig-DL0ieTnxknV-1.jpg', { widths: [480, 960], focal: '50% 62%' }),
  item('roscas', 'instagram-perfil/ig-DIMhXQHxKNH-1.jpg', { widths: [480, 960], focal: '50% 60%' }),

  // Capítulo III, Confeitaria (prateleira): molduras 3:4, 4:5 e 1:1 em sequência.
  item('tortinhas-morango', 'instagram-perfil/ig-DJNHgYXREEp-1.jpg', { widths: [480, 960], focal: '50% 78%' }),
  item('tortelete-limao', 'instagram-perfil/ig-DW9ykUtAJsd-1.jpg', { widths: [480, 960] }),
  item('macarons', 'instagram-perfil/ig-DI7ADGJxtUT-1.jpg', { widths: [480, 960], focal: '50% 62%' }),
  item('mil-folhas', 'instagram-perfil/ig-DN6KVPCEW2y-1.jpg', { widths: [480, 960], focal: '50% 60%' }),
  item('brownie-recheado', 'instagram-perfil/ig-DIEo0wuR5Md-1.jpg', { widths: [480, 960], focal: '50% 55%' }),
  item('quindim', 'instagram-perfil/ig-DOy-V1EkeQT-1.jpg', { widths: [480, 960] }),
  item('croissant-amor', 'instagram-perfil/ig-DMivYx-RK9r-1.jpg', { widths: [480, 960], focal: '50% 62%' }),
  item('torta-amendoim', 'instagram-perfil/ig-DKPrmUaRBC6-1.jpg', { widths: [480, 960] }),
  item('torta-pudim', 'instagram/post-DZz82hDEUnh-2.jpg'),
  item('torta-chantilly', 'instagram-perfil/ig-DMTM1ogx9DX-1.jpg', { widths: [480, 960], focal: '50% 66%' }),
  // Encomenda: o bolo sem o display do QR Code à esquerda, já em 4:5.
  item('bolo-frutas-vermelhas', 'instagram-perfil/ig-DFOohkqv2g8-1.jpg', { crop: { left: 0.26, top: 0.22, width: 0.74, height: 0.74 } }),

  // Capítulo IV, De perto: recortes fechados de textura.
  item('chocolate-quente', 'instagram-perfil/ig-DNrD_xb4ujN-1.jpg', { crop: { left: 0.1, top: 0.04, width: 0.85, height: 0.85 } }),
  item('tortelete-physalis', 'instagram-perfil/ig-DLK6RTqRduq-1.jpg', { crop: { left: 0.02, top: 0.12, width: 0.7, height: 0.7 }, focal: '40% 50%' }),
  item('chantilly-cereja', 'instagram-perfil/ig-DM07fpJxHMQ-1.jpg', { crop: { left: 0.19, top: 0.02, width: 0.8, height: 0.8 } }),
];
