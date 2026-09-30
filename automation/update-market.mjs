#!/usr/bin/env node
/**
 * Atualiza src/data/market.json com um retrato do mercado usado no build.
 * No navegador, o bloco de mercado ainda tenta atualizar os preços ao vivo.
 *
 * Fontes (gratuitas, sem cadastro):
 *  - CoinGecko  /simple/price  (atribuição obrigatória: "Dados: CoinGecko")
 *  - mempool.space /api/v1/fees/recommended (taxas da rede Bitcoin)
 *  - alternative.me Fear & Greed Index
 * Uso: node automation/update-market.mjs
 */
import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/env.mjs';

loadEnv();

export const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
];

const OUT = fileURLToPath(new URL('../src/data/market.json', import.meta.url));

async function getJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'CryptoRadarBrasil/1.0 (+github.com)', ...headers },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

export async function fetchMarket() {
  const key = process.env.CRYPTO_API_KEY?.trim();
  const ids = COINS.map((c) => c.id).join(',');
  const prices = await getJson(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl,usd&include_24hr_change=true&include_market_cap=true`,
    key ? { 'x-cg-demo-api-key': key } : {},
  );
  const coins = COINS.filter((c) => prices[c.id]).map((c) => ({
    ...c,
    brl: prices[c.id].brl,
    usd: prices[c.id].usd,
    change24h: Number((prices[c.id].brl_24h_change ?? 0).toFixed(2)),
    marketCapBrl: prices[c.id].brl_market_cap ?? null,
  }));
  if (coins.length === 0) throw new Error('CoinGecko não retornou preços');

  let fees = null;
  try {
    const f = await getJson('https://mempool.space/api/v1/fees/recommended');
    fees = { fastest: f.fastestFee, halfHour: f.halfHourFee, hour: f.hourFee, economy: f.economyFee };
  } catch (e) {
    console.warn('Aviso: taxas indisponíveis —', e.message);
  }

  let fearGreed = null;
  try {
    const fg = await getJson('https://api.alternative.me/fng/?limit=1');
    const d = fg.data?.[0];
    if (d) fearGreed = { value: Number(d.value), label: d.value_classification };
  } catch (e) {
    console.warn('Aviso: índice medo/ganância indisponível —', e.message);
  }

  return { updatedAt: new Date().toISOString(), coins, fees, fearGreed };
}

async function main() {
  try {
    const data = await fetchMarket();
    await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
    console.log(`Mercado atualizado: ${data.coins.length} moedas (${data.updatedAt})`);
  } catch (e) {
    // Mantém o retrato anterior: um build nunca deve quebrar porque uma API caiu.
    const previous = await readFile(OUT, 'utf8').catch(() => null);
    console.error('Falha ao atualizar o mercado:', e.message);
    if (!previous) process.exitCode = 1;
    else console.error('Mantido o arquivo anterior.');
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
