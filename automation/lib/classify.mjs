import { stripAccents } from './text.mjs';

/** Regras simples de palavra-chave → categoria. A primeira com mais acertos vence. */
const RULES = {
  regulacao: ['sec', 'cvm', 'banco central', 'bcb', 'regula', 'lei ', 'law', 'bill', 'congress', 'senado', 'receita federal', 'tax', 'imposto', 'lawsuit', 'court', 'judge', 'charges', 'sanction', 'mica', 'compliance', 'resolucao', 'norma', 'cftc', 'treasury'],
  mercado: ['etf', 'price', 'preco', 'rally', 'market', 'mercado', 'inflows', 'outflows', 'fluxo', 'trading', 'liquidation', 'all-time high', 'maxima', 'queda', 'alta', 'fed', 'juros'],
  mineracao: ['miner', 'mining', 'minera', 'hashrate', 'hash rate', 'difficulty', 'dificuldade', 'halving', 'asic'],
  seguranca: ['hack', 'exploit', 'scam', 'golpe', 'phishing', 'stolen', 'roub', 'vulnerab', 'fraud', 'fraude', 'drain', 'attack', 'ataque'],
  defi: ['defi', 'dex', 'uniswap', 'aave', 'lending', 'liquidity', 'liquidez', 'yield', 'staking', 'tvl', 'protocol'],
  ethereum: ['ethereum', ' eth ', 'ether', 'vitalik', 'layer 2', 'l2', 'rollup', 'arbitrum', 'optimism', 'base chain', 'glamsterdam', 'fusaka', 'eip-'],
  bitcoin: ['bitcoin', ' btc', 'satoshi', 'lightning', 'bitcoin core', 'ordinals', 'taproot'],
  altcoins: ['solana', 'xrp', 'ripple', 'cardano', 'dogecoin', 'memecoin', 'stablecoin', 'usdt', 'usdc', 'tether', 'altcoin', 'bnb', 'toncoin', 'avalanche'],
  blockchain: ['blockchain', 'tokeniz', 'tokenized', 'drex', 'cbdc', 'ledger'],
  tecnologia: ['upgrade', 'atualiza', 'release', 'testnet', 'mainnet', 'software', 'client', 'protocolo', 'bip-'],
};

const TAG_WORDS = {
  Bitcoin: ['bitcoin', 'btc'],
  Ethereum: ['ethereum', 'ether', ' eth '],
  ETFs: ['etf'],
  stablecoins: ['stablecoin', 'usdt', 'usdc', 'tether'],
  regulação: ['regula', 'sec ', 'cvm', 'lei ', 'law'],
  'Banco Central': ['banco central', 'bcb'],
  SEC: ['sec '],
  DeFi: ['defi'],
  segurança: ['hack', 'exploit', 'golpe', 'scam', 'fraud'],
  mineração: ['mining', 'miner', 'minera', 'hashrate'],
  tokenização: ['tokeniz'],
  Solana: ['solana'],
  XRP: ['xrp', 'ripple'],
  Brasil: ['brasil', 'brazil', 'b3 '],
  Lightning: ['lightning'],
};

const OFFICIAL_CATEGORY = { bcb: 'regulacao', sec: 'regulacao', 'ethereum-blog': 'ethereum', 'bitcoin-core': 'bitcoin', 'bitcoin-optech': 'bitcoin' };

function haystack(item) {
  return ` ${stripAccents(`${item.title} ${item.summary ?? ''}`.toLowerCase())} `;
}

export function classify(item) {
  const h = haystack(item);
  let best = null;
  let bestScore = 0;
  for (const [cat, words] of Object.entries(RULES)) {
    // Título pesa mais do que resumo.
    const title = ` ${stripAccents(item.title.toLowerCase())} `;
    let score = 0;
    for (const w of words) {
      if (title.includes(w)) score += 2;
      else if (h.includes(w)) score += 1;
    }
    if (score > bestScore) {
      best = cat;
      bestScore = score;
    }
  }
  return best ?? OFFICIAL_CATEGORY[item.feed] ?? 'bitcoin';
}

export function suggestTags(item, max = 6) {
  const h = haystack(item);
  const tags = Object.entries(TAG_WORDS)
    .filter(([, words]) => words.some((w) => h.includes(w)))
    .map(([tag]) => tag);
  return tags.slice(0, max);
}

/** O item fala de cripto? Usado para filtrar feeds gerais (BC, SEC). */
export function isCryptoRelated(item) {
  const h = haystack(item);
  return /(cripto|crypto|bitcoin|btc|ethereum|blockchain|stablecoin|ativos? virtu|virtual asset|digital asset|token|defi|web3)/.test(h);
}
