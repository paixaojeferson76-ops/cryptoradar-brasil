import type { APIRoute } from 'astro';
import { absolute } from '../lib/url';

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /busca',
      'Disallow: /pagefind/',
      '',
      `Sitemap: ${absolute('/sitemap-index.xml', site)}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
