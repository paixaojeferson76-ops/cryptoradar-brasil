// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeSiteLinks from './src/lib/rehype-site-links.mjs';

// SITE_URL define o endereço público. Pode conter um caminho (ex.: GitHub Pages
// sem domínio próprio: https://usuario.github.io/cryptoradar-brasil).
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const siteUrl = new URL(
  env.SITE_URL || 'https://paixaojeferson76-ops.github.io/cryptoradar-brasil',
);
const base = siteUrl.pathname.replace(/\/$/, '') || '/';

export default defineConfig({
  site: siteUrl.origin,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  redirects: { '/home': '/' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    sitemap({
      filter: (page) => !/\/(home|busca|404)\/?$/.test(page),
      changefreq: 'daily',
      lastmod: new Date(),
    }),
  ],
  markdown: {
    processor: unified({ rehypePlugins: [[rehypeSiteLinks, { base }]] }),
  },
});
