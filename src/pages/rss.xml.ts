import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublished, articleHref } from '../lib/articles';
import { CATEGORIES, SITE } from '../config/site';
import { link } from '../lib/url';

export const GET: APIRoute = async (context) => {
  const list = (await getPublished()).slice(0, 50);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: new URL(link('/'), context.site),
    trailingSlash: false,
    items: list.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.pubDate,
      link: link(articleHref(a)),
      categories: [CATEGORIES[a.data.category].name, ...a.data.tags],
      author: 'Redação CryptoRadar',
    })),
    customData: `<language>pt-br</language><ttl>60</ttl>`,
  });
};
