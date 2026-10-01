#!/usr/bin/env node
/**
 * Verificação visual/responsiva com o navegador instalado (Edge ou Chrome).
 * Para cada rota, em celular (375px) e desktop (1280px):
 *  - a página responde 200;
 *  - não há rolagem horizontal;
 *  - não há erros de JavaScript;
 *  - salva uma captura em screenshots/.
 *
 * Uso: npm run build && npx astro preview   (em outro terminal)
 *      npm run test:mobile
 * Variáveis: CHECK_URL (padrão http://localhost:4321/cryptoradar-brasil), BROWSER_PATH.
 */
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';

const BASE = (process.env.CHECK_URL || 'http://localhost:4321/cryptoradar-brasil').replace(/\/$/, '');
const ROUTES = (process.env.CHECK_ROUTES || '/,/noticias,/bitcoin,/guias,/noticias/o-que-e-bitcoin,/busca?q=halving,/sobre,/politica-de-privacidade,/rota-inexistente')
  .split(',');

const candidates = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) {
  console.error('Nenhum navegador Chrome/Edge encontrado. Defina BROWSER_PATH.');
  process.exit(1);
}

mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
let failures = 0;

for (const [label, viewport] of [
  ['celular', { width: 375, height: 800 }],
  ['desktop', { width: 1280, height: 900 }],
]) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'pt-BR' });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle' }).catch((e) => ({ status: () => e.message }));
    const expected = route === '/rota-inexistente' ? 404 : 200;
    const status = res?.status?.();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    // Rola a página para carregar as imagens com loading="lazy" antes da captura.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState('networkidle').catch(() => {});
    const name = `${label}-${route.replace(/[^a-z0-9]+/gi, '_') || 'home'}.png`;
    await page.screenshot({ path: `screenshots/${name}`, fullPage: true });
    const ok = status === expected && overflow <= 0 && errors.length === 0;
    if (!ok) failures++;
    console.log(
      `${ok ? 'OK  ' : 'FALHA'} ${label.padEnd(7)} ${route.padEnd(34)} status=${status} overflow=${overflow}px${errors.length ? ' erros=' + errors.join(' | ') : ''}`,
    );
    await page.close();
  }
  await ctx.close();
}
await browser.close();
if (failures) {
  console.error(`\n${failures} verificação(ões) falharam.`);
  process.exit(1);
}
console.log('\nTodas as páginas passaram (sem rolagem horizontal e sem erros de JS).');
