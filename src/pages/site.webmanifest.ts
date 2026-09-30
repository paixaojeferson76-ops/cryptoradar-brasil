import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { link } from '../lib/url';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: SITE.name,
      short_name: SITE.shortName,
      lang: SITE.lang,
      start_url: link('/'),
      display: 'browser',
      background_color: '#f3f5fa',
      theme_color: '#131c38',
      icons: [
        { src: link('/logo-192.png'), sizes: '192x192', type: 'image/png' },
        { src: link('/logo-512.png'), sizes: '512x512', type: 'image/png' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
