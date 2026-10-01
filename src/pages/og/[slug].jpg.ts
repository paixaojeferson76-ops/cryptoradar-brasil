import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getPublished } from '../../lib/articles';
import { overlaySvg } from '../../lib/og';
import { CATEGORIES } from '../../config/site';

/** Imagem social 1200×630 das matérias com foto: foto + degradê + título. */
export const getStaticPaths = (async () => {
  const list = (await getPublished()).filter((a) => a.data.image?.startsWith('/images/'));
  return list.map((a) => ({
    params: { slug: a.id },
    props: { title: a.data.title, category: a.data.category as string, image: a.data.image! },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const cat = CATEGORIES[props.category as keyof typeof CATEGORIES];
  const photo = await readFile(join(process.cwd(), 'public', props.image as string));
  const jpg = await sharp(photo)
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .composite([{ input: overlaySvg(props.title as string, cat.name, cat.hue) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
