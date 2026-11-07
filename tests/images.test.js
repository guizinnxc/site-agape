import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { IMAGES } from '../scripts/images.config.mjs';

const manifestPath = 'public/img/manifest.json';
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

describe('imagens responsivas', () => {
  it('ids são únicos e válidos', () => {
    const ids = IMAGES.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('crédito casa com a origem', () => {
    for (const i of IMAGES) {
      expect(i.credit).toBe(/^instagram(-perfil)?\//.test(i.src) ? 'instagram' : 'maps');
    }
  });

  it('instagram-perfil/ também é crédito do Instagram', async () => {
    const { item } = await import('../scripts/images.config.mjs');
    expect(item('x', 'instagram-perfil/ig-a-1.jpg').credit).toBe('instagram');
    expect(item('x', 'instagram/post-a-1.jpg').credit).toBe('instagram');
    expect(item('x', 'maps-miguel/maps-mig-01.jpg').credit).toBe('maps');
  });

  for (const img of IMAGES) {
    describe(img.id, () => {
      it('está no manifest com larguras coerentes', () => {
        const m = manifest[img.id];
        expect(m, 'ausente do manifest').toBeDefined();
        const w = m.widths;
        for (let k = 1; k < w.length; k++) expect(w[k]).toBeGreaterThan(w[k - 1]);
        expect(Math.max(...w)).toBeLessThanOrEqual(m.width);
        expect(m.credit).toBe(img.credit);
      });

      it('tem os arquivos avif, webp e jpg de cada largura', () => {
        const m = manifest[img.id];
        expect(m, 'ausente do manifest').toBeDefined();
        for (const w of m.widths) {
          for (const ext of ['avif', 'webp', 'jpg']) {
            expect(existsSync(`public/img/${img.id}-${w}.${ext}`), `${img.id}-${w}.${ext}`).toBe(true);
          }
        }
      });
    });
  }

  it('gera og-vitrine.jpg', () => {
    expect(existsSync('public/img/og-vitrine.jpg')).toBe(true);
  });
});
