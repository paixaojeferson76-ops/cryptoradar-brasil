/** Utilitários de texto: slug, normalização, similaridade e detecção de cópia. */

export function stripAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function slugify(s, max = 80) {
  const slug = stripAccents(String(s))
    .toLowerCase()
    .replace(/&/g, ' e ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= max) return slug;
  return slug.slice(0, max).replace(/-[^-]*$/, '');
}

export function stripHtml(s = '') {
  return String(s)
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&rsquo;|&#8217;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP = new Set(
  (
    'a o os as um uma de do da dos das e em no na nos nas para por com sem que se ao aos como mais menos sobre ' +
    'the a an of to in on for and or with by from at as is are was were be been its it this that after over into ' +
    'says said new will could would may might has have had not no than up out about'
  ).split(' '),
);

/** Palavras significativas de um título (sem acento, minúsculas, sem stopwords). */
export function keywords(s) {
  return stripAccents(String(s).toLowerCase())
    .replace(/[^a-z0-9$%.\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** Similaridade de Jaccard entre os conjuntos de palavras-chave de dois textos (0 a 1). */
export function similarity(a, b) {
  const A = new Set(keywords(a));
  const B = new Set(keywords(b));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Normaliza URL para detectar duplicatas (remove utm, âncora e barra final). */
export function normalizeUrl(u) {
  try {
    const url = new URL(u);
    url.hash = '';
    for (const k of [...url.searchParams.keys()]) if (/^(utm_|ref$|source$|fbclid|gclid)/i.test(k)) url.searchParams.delete(k);
    url.hostname = url.hostname.replace(/^www\./, '');
    return url.toString().replace(/\/$/, '');
  } catch {
    return String(u);
  }
}

/**
 * Maior sequência de palavras copiada literalmente de `source` em `text`.
 * Usado para barrar texto gerado que reproduz trechos das fontes.
 */
export function longestCopiedRun(text, source) {
  const t = keywordsAll(text);
  const s = keywordsAll(source);
  if (!t.length || !s.length) return 0;
  const index = new Map();
  s.forEach((w, i) => {
    if (!index.has(w)) index.set(w, []);
    index.get(w).push(i);
  });
  let best = 0;
  for (let i = 0; i < t.length; i++) {
    for (const j of index.get(t[i]) ?? []) {
      let k = 0;
      while (i + k < t.length && j + k < s.length && t[i + k] === s[j + k]) k++;
      if (k > best) best = k;
    }
  }
  return best;
}

function keywordsAll(s) {
  return stripAccents(String(s).toLowerCase())
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}
