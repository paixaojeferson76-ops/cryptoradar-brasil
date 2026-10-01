/**
 * Imagens ilustrativas de bancos abertos via Openverse (https://openverse.org),
 * da WordPress Foundation. Não exige chave. Só aceitamos licenças que permitem
 * uso comercial: CC0, domínio público (PDM) e CC BY (exige crédito, que o site
 * exibe abaixo da foto).
 *
 * As imagens são baixadas e convertidas para WebP em public/images/noticias/,
 * para o site não depender de links externos e carregar rápido.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT } from './store.mjs';

const API = 'https://api.openverse.org/v1/images/';
export const IMAGES_DIR = join(ROOT, 'public', 'images', 'noticias');
const UA = 'CryptoRadarBrasil/1.0 (+https://github.com/paixaojeferson76-ops/cryptoradar-brasil)';

/** Bancos com fotos de boa qualidade; 3D, ilustrações de jogos etc. ficam de fora. */
const SOURCES = ['stocksnap', 'rawpixel', 'wikimedia', 'flickr', 'nappy', 'spacex', 'nasa', 'europeana'];
// Títulos que costumam indicar retrato de pessoa, logotipo, figura ou recorte (não usar como ilustração).
const AVOID = /(portrait|selfie|headshot|on reason tv|interview|speaker|png|sticker|logo|icon|vector|clipart|illustration|meme|cartoon)/i;

const LICENSE_NAME = { cc0: 'CC0', pdm: 'domínio público', by: 'CC BY' };

export async function searchImages(query, { pageSize = 20 } = {}) {
  const params = new URLSearchParams({
    q: query,
    license: 'cc0,pdm,by',
    aspect_ratio: 'wide',
    size: 'large',
    mature: 'false',
    page_size: String(pageSize),
  });
  const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Openverse HTTP ${res.status}`);
  const { results = [] } = await res.json();
  return results
    .filter((r) => SOURCES.includes(r.source) && !AVOID.test(r.title ?? '') && (r.width ?? 0) >= 900)
    .map((r) => ({
      id: r.id,
      title: (r.title ?? '').replace(/^File:/, '').replace(/\.(jpe?g|png|webp|tiff?)$/i, '').trim(),
      creator: r.creator || null,
      creatorUrl: r.creator_url || null,
      source: r.source,
      license: r.license,
      licenseVersion: r.license_version,
      licenseUrl: r.license_url,
      pageUrl: r.foreign_landing_url,
      url: r.url,
      width: r.width,
      height: r.height,
    }));
}

/** Texto de crédito exibido abaixo da imagem. */
export function creditFor(img) {
  const lic = `${LICENSE_NAME[img.license] ?? img.license.toUpperCase()}${img.license === 'by' && img.licenseVersion ? ' ' + img.licenseVersion : ''}`;
  const who = img.creator ? ` por ${img.creator}` : '';
  const source = img.source === 'wikimedia' ? 'Wikimedia Commons' : img.source.charAt(0).toUpperCase() + img.source.slice(1);
  return `Imagem${who} (${lic}), via ${source}`;
}

/**
 * URL para download. No Wikimedia, usa a miniatura oficial em cache (o original
 * costuma ser enorme e o servidor limita com HTTP 429).
 */
// O Wikimedia só gera miniaturas nessas larguras padronizadas (outras dão HTTP 400).
const WIKI_WIDTHS = [330, 500, 960, 1280, 1920];

export function downloadUrl(img, wanted = 1600) {
  const width = WIKI_WIDTHS.find((w) => w >= wanted) ?? 1920;
  const m = img.url.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w)\/(\w\w)\/([^/]+)$/);
  if (!m || (img.width ?? 0) <= width) return img.url;
  const [, root, a, ab, file] = m;
  const thumbName = /\.svg$/i.test(file) ? `${width}px-${file}.png` : `${width}px-${file}`;
  return `${root}/thumb/${a}/${ab}/${file}/${thumbName}`;
}

export async function fetchImage(url, tries = 4) {
  for (let i = 1; ; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000), redirect: 'follow' });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status === 429 && i < tries) {
      await new Promise((r) => setTimeout(r, 4000 * i));
      continue;
    }
    throw new Error(`download HTTP ${res.status}`);
  }
}

/** Baixa a imagem e grava <slug>.webp (1600px) e <slug>-800.webp. Retorna o caminho público. */
export async function saveImage(img, slug) {
  const buf = await fetchImage(downloadUrl(img, 1600));
  await mkdir(IMAGES_DIR, { recursive: true });
  const base = sharp(buf, { failOn: 'none' }).rotate();
  const meta = await base.metadata();
  if ((meta.width ?? 0) < 900) throw new Error('imagem pequena demais');
  await base.clone().resize(1600, 900, { fit: 'cover', position: 'attention' }).webp({ quality: 74 }).toFile(join(IMAGES_DIR, `${slug}.webp`));
  await base.clone().resize(800, 450, { fit: 'cover', position: 'attention' }).webp({ quality: 70 }).toFile(join(IMAGES_DIR, `${slug}-800.webp`));
  return `/images/noticias/${slug}.webp`;
}

/** Campos de frontmatter para a imagem escolhida. */
export function imageFrontmatter(img, path, alt) {
  return {
    image: path,
    imageAlt: alt,
    imageCredit: creditFor(img),
    imageSource: img.pageUrl,
    imageLicenseUrl: img.licenseUrl ?? undefined,
  };
}

/**
 * Escolhe e salva uma imagem para uma notícia gerada automaticamente.
 * Tenta cada consulta em ordem; ignora imagens já usadas no site. Nunca lança
 * erro: sem imagem, o site usa a capa "radar" gerada.
 */
export async function pickImageFor(slug, queries, usedSources = new Set()) {
  for (const q of queries.filter(Boolean)) {
    let results = [];
    try {
      results = await searchImages(q);
    } catch {
      continue;
    }
    // Preferência: CC0/domínio público de bancos de foto; depois CC BY.
    results.sort((a, b) => Number(b.license !== 'by') - Number(a.license !== 'by'));
    for (const img of results.filter((r) => !usedSources.has(r.pageUrl)).slice(0, 4)) {
      try {
        const path = await saveImage(img, slug);
        usedSources.add(img.pageUrl);
        return imageFrontmatter(img, path, `Imagem ilustrativa: ${img.title || q}`);
      } catch {
        /* tenta a próxima */
      }
    }
  }
  return null;
}
