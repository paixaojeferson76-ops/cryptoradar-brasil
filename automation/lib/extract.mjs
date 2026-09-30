import { stripHtml } from './text.mjs';

/**
 * Baixa a página de uma fonte e extrai os parágrafos de texto (<p>).
 * Serve só como material de APURAÇÃO para a IA e para a checagem anti-cópia:
 * nada deste texto é publicado. Falhas (paywall, bloqueio) retornam ''.
 */
export async function fetchArticleText(url, { maxChars = 3500, timeoutMs = 15000 } = {}) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CryptoRadarBrasil/1.0; +https://github.com/paixaojeferson76-ops/cryptoradar-brasil)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok || !/html/.test(res.headers.get('content-type') ?? '')) return '';
    return extractParagraphs(await res.text(), maxChars);
  } catch {
    return '';
  }
}

export function extractParagraphs(html, maxChars = 3500) {
  const body = html
    .replace(/<(script|style|nav|header|footer|aside|form|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const paragraphs = [...body.matchAll(/<p[\s>][\s\S]*?<\/p>/gi)]
    .map((m) => stripHtml(m[0]))
    .filter((p) => p.length > 60 && !/(cookie|subscribe|newsletter|sign up|all rights reserved|©)/i.test(p));
  let out = '';
  for (const p of paragraphs) {
    if (out.length + p.length > maxChars) break;
    out += p + '\n';
  }
  return out.trim();
}
