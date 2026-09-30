import { longestCopiedRun, slugify } from './text.mjs';

export const CATEGORIES = ['bitcoin', 'ethereum', 'altcoins', 'blockchain', 'defi', 'regulacao', 'mineracao', 'seguranca', 'mercado', 'tecnologia'];

export const SYSTEM_PROMPT = `Você é redator do CryptoRadar Brasil, portal de notícias sobre criptomoedas em português do Brasil.
Escreva uma NOTÍCIA ORIGINAL a partir das informações das fontes fornecidas. Regras obrigatórias:
1. Use SOMENTE fatos presentes nas fontes. Não invente números, datas, nomes, citações ou consequências.
2. Atribua as informações: "segundo a SEC", "de acordo com o CoinDesk", etc.
3. NÃO copie frases das fontes: reescreva com suas palavras. Citações diretas só se aparecerem nas fontes, curtas e entre aspas.
4. Separe fato de contexto. Nada de previsão de preço, opinião de investimento ou recomendação de compra/venda.
5. Se as fontes forem insuficientes, contraditórias ou parecerem rumor, responda {"skip": true, "reason": "..."}.
6. Público brasileiro: explique siglas e termos técnicos na primeira menção; converta horários para Brasília quando houver horário exato.
7. Tom jornalístico, frases claras, voz ativa. Sem sensacionalismo, sem emojis.
8. Corpo em Markdown com 300 a 600 palavras: 1º parágrafo responde o quê, quem, quando; depois 2 a 4 seções com "## Subtítulo". Não repita o título no corpo. Não inclua seção de fontes (o site gera).
9. Não afirme relação de causa e efeito que as fontes não afirmem, não use adjetivos que as fontes não usem e não termine com conclusão, opinião ou frase de efeito: encerre com um fato ou com o próximo passo informado pelas fontes.
10. Inclua de 1 a 3 links internos, SOMENTE da lista de artigos fornecida, no formato [texto](/noticias/slug), onde fizer sentido.
Responda APENAS com JSON no formato:
{"title": "até 110 caracteres", "description": "resumo de 120 a 240 caracteres", "seoTitle": "até 65 caracteres", "seoDescription": "120 a 155 caracteres", "category": "uma de: ${CATEGORIES.join(', ')}", "tags": ["3 a 6 tags em português"], "body": "markdown"}`;

export function buildUserPrompt(story, existing) {
  const sources = story.items
    .map(
      (i, n) =>
        `FONTE ${n + 1} — ${i.publisher} (${i.type === 'official' ? 'fonte oficial' : 'veículo'}), publicada em ${i.date}\nTítulo: ${i.title}\nURL: ${i.url}\nResumo: ${i.summary || '(sem resumo no feed)'}${i.fullText ? `\nTrechos da página (material de apuração, NÃO copie):\n${i.fullText}` : ''}`,
    )
    .join('\n\n');
  const internal = existing
    .slice(0, 60)
    .map((a) => `- /noticias/${a.slug} — ${a.title}`)
    .join('\n');
  return `Categoria sugerida: ${story.category}\n\n${sources}\n\nArtigos do site disponíveis para links internos:\n${internal}`;
}

const FORBIDDEN = /(recomendamos (a )?compra|compre agora|lucro garantido|garantia de retorno|vai (subir|explodir)|to the moon|conselho de investimento)/i;

/** Confere a resposta da IA. Retorna lista de problemas (vazia = aprovado). */
export function checkGenerated(g, story, existingSlugs = new Set()) {
  const problems = [];
  const str = (v) => typeof v === 'string' && v.trim().length > 0;
  if (!str(g.title) || g.title.length < 15 || g.title.length > 120) problems.push('título ausente ou fora do tamanho');
  if (!str(g.description) || g.description.length < 50 || g.description.length > 260) problems.push('resumo fora do tamanho');
  if (g.seoTitle && g.seoTitle.length > 70) g.seoTitle = g.seoTitle.slice(0, 70).replace(/\s+\S*$/, '');
  if (g.seoDescription && (g.seoDescription.length < 50 || g.seoDescription.length > 160)) delete g.seoDescription;
  if (!CATEGORIES.includes(g.category)) g.category = CATEGORIES.includes(story.category) ? story.category : 'bitcoin';
  if (!Array.isArray(g.tags)) g.tags = story.tags ?? [];
  g.tags = [...new Set(g.tags.filter((t) => typeof t === 'string' && t.length >= 2).map((t) => t.trim()))].slice(0, 8);
  if (!str(g.body)) problems.push('corpo vazio');
  else {
    const words = g.body.split(/\s+/).length;
    if (words < 220) problems.push(`corpo curto (${words} palavras)`);
    if (FORBIDDEN.test(g.body) || FORBIDDEN.test(g.title)) problems.push('linguagem de recomendação/promessa');
    const sourceText = story.items.map((i) => `${i.title} ${i.summary} ${i.fullText ?? ''}`).join(' ');
    const copied = longestCopiedRun(g.body, sourceText);
    if (copied >= 12) problems.push(`trecho copiado da fonte (${copied} palavras seguidas)`);
    // Links: só internos existentes ou URLs das próprias fontes.
    const allowed = new Set(story.items.map((i) => i.url));
    for (const m of g.body.matchAll(/\]\(([^)]+)\)/g)) {
      const href = m[1];
      if (href.startsWith('/noticias/')) {
        if (!existingSlugs.has(href.replace('/noticias/', '').replace(/\/$/, ''))) problems.push(`link interno inexistente: ${href}`);
      } else if (!allowed.has(href)) problems.push(`link externo não autorizado: ${href}`);
    }
    if (/^#\s/m.test(g.body)) g.body = g.body.replace(/^#\s.*$/m, '').trim();
  }
  return problems;
}

const q = (s) => JSON.stringify(String(s));

/** Monta o arquivo Markdown com frontmatter no formato da coleção "articles". */
export function toMarkdown(g, story, { now = new Date(), draft, reviewed, model }) {
  const iso = new Date(now.getTime() - 3 * 36e5).toISOString().replace(/\.\d{3}Z$/, '-03:00');
  const sources = story.items
    .map(
      (i) =>
        `  - title: ${q(i.title)}\n    url: ${q(i.url)}\n    publisher: ${q(i.publisher)}\n    accessed: ${now.toISOString().slice(0, 10)}`,
    )
    .join('\n');
  const fm = [
    '---',
    `title: ${q(g.title)}`,
    `description: ${q(g.description)}`,
    g.seoTitle ? `seoTitle: ${q(g.seoTitle)}` : null,
    g.seoDescription ? `seoDescription: ${q(g.seoDescription)}` : null,
    `pubDate: ${iso}`,
    'author: redacao',
    `category: ${g.category}`,
    `tags: [${g.tags.map(q).join(', ')}]`,
    'type: noticia',
    'sources:',
    sources,
    `draft: ${draft}`,
    `generatedBy: ${q(model)}`,
    `reviewed: ${reviewed}`,
    '---',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n');
  return `${fm}${g.body.trim()}\n`;
}

export function uniqueSlug(title, taken) {
  const base = slugify(title, 80) || 'noticia';
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
  return slug;
}
