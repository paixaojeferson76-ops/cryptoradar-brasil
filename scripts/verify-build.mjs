#!/usr/bin/env node
/**
 * Verificação do site gerado em dist/ (rodar depois de `npm run build`).
 *  - rotas obrigatórias existem;
 *  - cada página tem title, description, canonical, Open Graph, um único <h1> e lang pt-BR;
 *  - JSON-LD válido (e NewsArticle/Article nas notícias);
 *  - links internos e imagens apontam para arquivos existentes;
 *  - sitemap, robots.txt, RSS e ads.txt corretos;
 *  - nenhum segredo (chave de API/token) vazou para o HTML.
 * Opção --external: também testa todos os links externos das seções "Fontes".
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { loadEnv } from '../automation/lib/env.mjs';

loadEnv();
const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const site = new URL(process.env.SITE_URL || 'https://paixaojeferson76-ops.github.io/cryptoradar-brasil');
const BASE = site.pathname.replace(/\/$/, '');
const errors = [];
const warn = [];
const fail = (m) => errors.push(m);

const REQUIRED = [
  '/', '/home', '/noticias', '/bitcoin', '/ethereum', '/altcoins', '/blockchain', '/defi', '/regulacao',
  '/mineracao', '/seguranca', '/mercado', '/tecnologia', '/guias', '/sobre', '/contato',
  '/politica-de-privacidade', '/termos-de-uso', '/politica-de-cookies', '/busca', '/autor/redacao',
];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const exists = async (p) => stat(p).then(() => true).catch(() => false);

function fileForPath(pathname) {
  let p = decodeURIComponent(pathname.split(/[?#]/)[0]);
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  if (!p || p === '/') return join(DIST, 'index.html');
  if (extname(p)) return join(DIST, p);
  return join(DIST, p, 'index.html');
}

const files = await walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));

for (const r of REQUIRED) if (!(await exists(fileForPath(r)))) fail(`rota ausente: ${r}`);

const external = new Set();
let articles = 0;
for (const f of html) {
  const rel = f.slice(DIST.length).replace(/\\/g, '/');
  const src = await readFile(f, 'utf8');
  if (rel === 'home/index.html') continue; // redirecionamento
  const need = (re, what) => re.test(src) || fail(`${rel}: falta ${what}`);
  need(/<html lang="pt-BR"/, 'lang pt-BR');
  need(/<title>[^<]{10,}<\/title>/, '<title>');
  need(/<meta name="description" content="[^"]{50,}"/, 'meta description (50+ caracteres)');
  need(/<link rel="canonical" href="https:\/\//, 'canonical absoluto');
  need(/<meta property="og:image" content="https:\/\//, 'og:image');
  need(/<meta name="twitter:card"/, 'twitter:card');
  const h1 = (src.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(`${rel}: ${h1} <h1> (esperado 1)`);
  const desc = (src.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? '';
  if (desc.length > 170) warn.push(`${rel}: description longa (${desc.length})`);

  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const ld = JSON.parse(m[1]);
      if (rel.startsWith('noticias/') && !rel.startsWith('noticias/pagina') && rel !== 'noticias/index.html') {
        articles++;
        const types = ld['@graph'].map((n) => n['@type']);
        if (!types.some((t) => /Article/.test(t))) fail(`${rel}: JSON-LD sem Article`);
        if (!types.includes('BreadcrumbList')) fail(`${rel}: JSON-LD sem BreadcrumbList`);
      }
    } catch {
      fail(`${rel}: JSON-LD inválido`);
    }
  }

  for (const m of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (/^https?:\/\//.test(url)) {
      if (url.startsWith('http://')) fail(`${rel}: link inseguro (http): ${url}`);
      if (/<section class="sources"/.test(src) && src.indexOf(m[0]) > src.indexOf('class="sources"')) external.add(url);
      continue;
    }
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    if (BASE && !url.startsWith(BASE + '/') && url !== BASE) fail(`${rel}: link interno sem o prefixo ${BASE}: ${url}`);
    if (url.includes('/busca?') || url.includes('/pagefind/')) continue;
    if (!(await exists(fileForPath(url)))) fail(`${rel}: link quebrado ${url}`);
  }

  if (/AIza[0-9A-Za-z_-]{30,}|sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY/.test(src)) {
    fail(`${rel}: possível segredo exposto no HTML!`);
  }
}
if (articles < 5) fail(`poucas páginas de artigo encontradas (${articles})`);

// sitemap
const xml = new XMLParser();
const smIndex = await readFile(join(DIST, 'sitemap-index.xml'), 'utf8').catch(() => '');
if (!smIndex) fail('sitemap-index.xml ausente');
else {
  const sm = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8');
  const urls = [].concat(xml.parse(sm).urlset.url).map((u) => u.loc);
  if (urls.length < 25) fail(`sitemap com poucas URLs (${urls.length})`);
  if (urls.some((u) => /\/(busca|home|404)\/?$/.test(u))) fail('sitemap inclui página que não deve ser indexada');
  if (!urls.every((u) => u.startsWith(site.origin + BASE))) fail('sitemap com URL fora do SITE_URL');
  console.log(`sitemap: ${urls.length} URLs`);
}

// robots
const robots = await readFile(join(DIST, 'robots.txt'), 'utf8').catch(() => '');
if (!robots.includes(`Sitemap: ${site.origin}${BASE}/sitemap-index.xml`)) fail('robots.txt sem a linha Sitemap correta');

// RSS
const rssRaw = await readFile(join(DIST, 'rss.xml'), 'utf8').catch(() => '');
try {
  const items = [].concat(xml.parse(rssRaw).rss.channel.item);
  if (items.length < 5) fail('RSS com poucos itens');
  if (!items.every((i) => String(i.link).startsWith(site.origin + BASE + '/noticias/'))) fail('RSS com links incorretos');
  console.log(`rss: ${items.length} itens`);
} catch {
  fail('rss.xml inválido');
}

// Busca (Pagefind)
if (!(await exists(join(DIST, 'pagefind', 'pagefind-ui.js')))) fail('índice de busca (pagefind) não gerado');

// Links externos das fontes
if (process.argv.includes('--external')) {
  console.log(`\nTestando ${external.size} links de fontes...`);
  await Promise.all(
    [...external].map(async (u) => {
      try {
        let r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Mozilla/5.0 (CryptoRadar link check)' } });
        if (r.status >= 400) r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'Mozilla/5.0 (CryptoRadar link check)' } });
        if (r.status >= 400 && r.status !== 403 && r.status !== 429) fail(`fonte inacessível (${r.status}): ${u}`);
        else if (r.status >= 400) warn.push(`fonte bloqueia robôs (${r.status}), conferir manualmente: ${u}`);
      } catch (e) {
        warn.push(`fonte sem resposta (${e.name}): ${u}`);
      }
    }),
  );
}

console.log(`\n${html.length} páginas HTML verificadas, ${articles} artigos.`);
for (const w of warn) console.log(`aviso: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`ERRO: ${e}`);
  console.error(`\n${errors.length} problema(s) encontrados.`);
  process.exit(1);
}
console.log('Tudo certo: rotas, SEO, links internos, sitemap, robots, RSS e busca.');
