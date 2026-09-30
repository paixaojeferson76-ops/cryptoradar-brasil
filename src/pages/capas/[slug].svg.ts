import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublished } from '../../lib/articles';
import { coverSvg } from '../../lib/cover';
import { CATEGORIES } from '../../config/site';

export const getStaticPaths = (async () => {
  const list = await getPublished();
  return list.map((a) => ({ params: { slug: a.id }, props: { category: a.data.category } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params, props }) => {
  const cat = CATEGORIES[props.category as keyof typeof CATEGORIES];
  return new Response(coverSvg({ slug: params.slug!, hue: cat.hue, label: cat.name }), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
};
