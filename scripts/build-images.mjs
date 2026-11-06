import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMAGES } from './images.config.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'assets', 'originais');
const saida = join(raiz, 'public', 'img');
mkdirSync(saida, { recursive: true });

// Gira pelo EXIF e recorta; devolve um buffer já normalizado.
async function carregar(src, crop) {
  const girada = await sharp(join(origem, src)).rotate().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = girada.info;
  if (!crop) return { buf: girada.data, width: W, height: H };
  const region = {
    left: Math.round(crop.left * W),
    top: Math.round(crop.top * H),
    width: Math.round(crop.width * W),
    height: Math.round(crop.height * H),
  };
  const buf = await sharp(girada.data).extract(region).toBuffer();
  return { buf, width: region.width, height: region.height };
}

const manifest = {};
for (const img of IMAGES) {
  const { buf, width, height } = await carregar(img.src, img.crop);
  const widths = [...new Set(img.widths.map((w) => Math.min(w, width)))].sort((a, b) => a - b);
  for (const w of widths) {
    const base = sharp(buf).resize({ width: w, withoutEnlargement: true });
    const alvo = join(saida, `${img.id}-${w}`);
    await base.clone().avif({ quality: 50 }).toFile(`${alvo}.avif`);
    await base.clone().webp({ quality: 72 }).toFile(`${alvo}.webp`);
    await base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(`${alvo}.jpg`);
  }
  const maior = widths[widths.length - 1];
  manifest[img.id] = {
    width: maior,
    height: Math.round((height * maior) / width),
    widths,
    focal: img.focal ?? '50% 50%',
    credit: img.credit,
  };
  console.log(`${img.id}: ${widths.join(', ')}`);
}

// Imagem de compartilhamento (Open Graph), fora do manifest.
const vit = await carregar('maps-arcozelo/maps-arc-01.jpg');
await sharp(vit.buf)
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 80, mozjpeg: true, progressive: true })
  .toFile(join(saida, 'og-vitrine.jpg'));

writeFileSync(join(saida, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('manifest.json e og-vitrine.jpg gerados');
