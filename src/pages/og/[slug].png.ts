import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { getPublished } from '../../lib/articles';
import { coverSvg } from '../../lib/cover';
import { CATEGORIES, SITE } from '../../config/site';

/** Imagens 1200×630 para Open Graph / X (redes sociais não aceitam SVG nem WebP em todos os apps). */
export const getStaticPaths = (async () => {
  // Matérias com foto usam /og/<slug>.jpg (endpoint ao lado).
  const list = (await getPublished()).filter((a) => !a.data.image?.startsWith('/images/'));
  const pages = list.map((a) => ({
    params: { slug: a.id },
    props: { title: a.data.title, category: a.data.category as string, image: a.data.image ?? '' },
  }));
  pages.push({ params: { slug: 'default' }, props: { title: SITE.tagline, category: 'bitcoin', image: '' } });
  return pages;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, props }) => {
  const cat = CATEGORIES[props.category as keyof typeof CATEGORIES];
  const svg = coverSvg({
    slug: params.slug!,
    hue: cat.hue,
    label: params.slug === 'default' ? 'Notícias e guias sobre cripto' : cat.name,
    title: props.title as string,
    brand: SITE.name,
  });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
