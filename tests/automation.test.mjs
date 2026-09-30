import { describe, it, expect } from 'vitest';
import { slugify, similarity, normalizeUrl, longestCopiedRun, stripHtml } from '../automation/lib/text.mjs';
import { parseFeed } from '../automation/lib/feeds.mjs';
import { classify, isCryptoRelated } from '../automation/lib/classify.mjs';
import { dedupeItems, clusterStories, alreadyPublished } from '../automation/lib/stories.mjs';
import { validateStory } from '../automation/lib/validate.mjs';
import { checkGenerated, toMarkdown, uniqueSlug } from '../automation/lib/article.mjs';

const NOW = new Date('2026-09-30T20:00:00Z');
const item = (over = {}) => ({
  feed: 'coindesk',
  publisher: 'CoinDesk',
  type: 'media',
  weight: 2,
  title: 'SEC approves new spot bitcoin ETF from major asset manager',
  url: 'https://www.coindesk.com/a',
  date: '2026-09-30T12:00:00Z',
  summary: 'The Securities and Exchange Commission approved a bitcoin ETF.',
  ...over,
});

describe('texto', () => {
  it('gera slug sem acentos e com limite', () => {
    expect(slugify('Regulação: Banco Central & Cripto!')).toBe('regulacao-banco-central-e-cripto');
    expect(slugify('a '.repeat(100), 20).length).toBeLessThanOrEqual(20);
  });
  it('remove HTML e entidades', () => {
    expect(stripHtml('<p>Olá&nbsp;<b>mundo</b> &amp; cia</p>')).toBe('Olá mundo & cia');
  });
  it('normaliza URL removendo utm, www e barra final', () => {
    expect(normalizeUrl('https://www.site.com/x/?utm_source=a&id=2#top')).toBe('https://site.com/x/?id=2');
  });
  it('mede similaridade de títulos', () => {
    expect(similarity('Bitwise launches spot NEAR ETF', 'Bitwise launches first US spot NEAR ETF')).toBeGreaterThan(0.5);
    expect(similarity('Bitcoin hashrate hits record', 'Ethereum Glamsterdam testnet date')).toBe(0);
  });
  it('detecta trechos copiados', () => {
    const src = 'the quick brown fox jumps over the lazy dog near the river bank today';
    expect(longestCopiedRun('texto novo: the quick brown fox jumps over the lazy dog near the river', src)).toBe(12);
    expect(longestCopiedRun('um texto totalmente diferente', src)).toBe(0);
  });
});

describe('feeds', () => {
  const feed = { id: 't', name: 'Teste', type: 'media', weight: 1, lang: 'en' };
  it('lê RSS 2.0', () => {
    const xml = `<rss><channel><item><title><![CDATA[Bitcoin news]]></title><link>https://a.com/1</link><pubDate>Wed, 30 Sep 2026 10:00:00 GMT</pubDate><description>&lt;p&gt;Resumo&lt;/p&gt;</description></item></channel></rss>`;
    const [it] = parseFeed(xml, feed);
    expect(it).toMatchObject({ title: 'Bitcoin news', url: 'https://a.com/1', summary: 'Resumo', publisher: 'Teste' });
    expect(it.date).toBe('2026-09-30T10:00:00.000Z');
  });
  it('lê Atom', () => {
    const xml = `<feed><entry><title>Bitcoin Core 32.0</title><link rel="alternate" href="https://github.com/r"/><updated>2026-09-18T14:30:08Z</updated></entry></feed>`;
    const [it] = parseFeed(xml, feed);
    expect(it.url).toBe('https://github.com/r');
    expect(it.title).toBe('Bitcoin Core 32.0');
  });
});

describe('classificação', () => {
  it('classifica por palavras-chave', () => {
    expect(classify(item())).toBe('regulacao');
    expect(classify(item({ title: 'Bitcoin miners boost hashrate after difficulty drop', summary: '' }))).toBe('mineracao');
    expect(classify(item({ title: 'DeFi protocol drained in $20M exploit', summary: '' }))).toBe('seguranca');
  });
  it('filtra notícias fora do tema', () => {
    expect(isCryptoRelated({ title: 'Pix e TIPS: parceria com Europa', summary: 'pagamentos' })).toBe(false);
    expect(isCryptoRelated({ title: 'BC cria regras para ativos virtuais', summary: '' })).toBe(true);
  });
});

describe('deduplicação e agrupamento', () => {
  it('remove URLs repetidas e já vistas', () => {
    const list = [item(), item({ url: 'https://coindesk.com/a/' }), item({ url: 'https://x.com/b' })];
    expect(dedupeItems(list)).toHaveLength(2);
    expect(dedupeItems(list, new Set(['https://x.com/b']))).toHaveLength(1);
  });
  it('agrupa o mesmo fato de fontes diferentes', () => {
    const stories = clusterStories([
      item(),
      item({ publisher: 'Decrypt', url: 'https://decrypt.co/z', title: 'SEC approves spot bitcoin ETF from major asset manager today' }),
      item({ publisher: 'The Block', url: 'https://theblock.co/q', title: 'Solana network outage lasts five hours' }),
    ]);
    expect(stories).toHaveLength(2);
    expect(stories.find((s) => s.items.length === 2).publishers).toEqual(['CoinDesk', 'Decrypt']);
  });
  it('reconhece pauta já publicada', () => {
    const [story] = clusterStories([item()]);
    expect(alreadyPublished(story, [{ title: 'outro', sourceUrls: ['https://coindesk.com/a'] }])).toBe(true);
    expect(alreadyPublished(story, [{ title: 'Algo diferente', sourceUrls: [] }])).toBe(false);
  });
});

describe('validação', () => {
  const story = (items) => clusterStories(items)[0];
  it('aceita notícia recente e marca confiança pela quantidade de fontes', () => {
    expect(validateStory(story([item()]), { now: NOW })).toMatchObject({ ok: true, confidence: 'baixa' });
    const three = [item(), item({ publisher: 'B', url: 'https://b.com/1' }), item({ publisher: 'C', url: 'https://c.com/1' })];
    expect(validateStory(story(three), { now: NOW }).confidence).toBe('alta');
  });
  it('fonte oficial dá confiança alta', () => {
    expect(validateStory(story([item({ type: 'official', feed: 'sec' })]), { now: NOW }).confidence).toBe('alta');
  });
  it('rejeita antigas, rumores, previsões e resumos', () => {
    expect(validateStory(story([item({ date: '2026-09-20T00:00:00Z' })]), { now: NOW }).ok).toBe(false);
    expect(validateStory(story([item({ title: 'Bitcoin ETF approval reportedly coming soon' })]), { now: NOW }).ok).toBe(false);
    expect(validateStory(story([item({ title: 'Analyst sees bitcoin reaching $500K' })]), { now: NOW }).ok).toBe(false);
    expect(validateStory(story([item({ title: "Here's what happened in crypto today" })]), { now: NOW }).ok).toBe(false);
  });
  it('rejeita data no futuro', () => {
    expect(validateStory(story([item({ date: '2026-10-05T00:00:00Z' })]), { now: NOW }).ok).toBe(false);
  });
});

describe('artigo gerado', () => {
  const [story] = clusterStories([item()]);
  const body = Array.from({ length: 30 }, (_, i) => `Frase original número ${i} sobre a aprovação do fundo pela SEC, explicada ao leitor.`).join(' ');
  const good = () => ({
    title: 'SEC aprova novo ETF de bitcoin à vista de grande gestora',
    description: 'A SEC aprovou um novo ETF de bitcoin à vista, segundo o CoinDesk. Veja o que foi decidido e o que muda para investidores.',
    category: 'mercado',
    tags: ['ETFs', 'SEC'],
    body: `${body}\n\nVeja [o guia](/noticias/o-que-sao-etfs-de-criptomoedas).`,
  });
  const slugs = new Set(['o-que-sao-etfs-de-criptomoedas']);

  it('aprova texto válido', () => {
    expect(checkGenerated(good(), story, slugs)).toEqual([]);
  });
  it('reprova links inventados e linguagem de recomendação', () => {
    const g = good();
    g.body += ' [x](/noticias/nao-existe) [y](https://site-qualquer.com) Recomendamos a compra.';
    const p = checkGenerated(g, story, slugs);
    expect(p.join()).toMatch(/inexistente/);
    expect(p.join()).toMatch(/externo/);
    expect(p.join()).toMatch(/recomendação/);
  });
  it('reprova corpo curto', () => {
    expect(checkGenerated({ ...good(), body: 'curto' }, story, slugs).join()).toMatch(/curto/);
  });
  it('gera frontmatter com fontes e rascunho', () => {
    const md = toMarkdown(good(), story, { now: NOW, draft: true, reviewed: false, model: 'teste' });
    expect(md).toMatch(/^---\ntitle: "SEC aprova/);
    expect(md).toContain('url: "https://www.coindesk.com/a"');
    expect(md).toMatch(/draft: true/);
    expect(md).toMatch(/pubDate: 2026-09-30T17:00:00-03:00/);
  });
  it('gera slug único', () => {
    expect(uniqueSlug('Título X', new Set(['titulo-x']))).toBe('titulo-x-2');
  });
});
