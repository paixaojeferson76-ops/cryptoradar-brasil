import { XMLParser } from 'fast-xml-parser';
import { stripHtml } from './text.mjs';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  processEntities: true,
});

const text = (v) => (v == null ? '' : typeof v === 'object' ? (v['#text'] ?? '') : String(v));

function pickLink(link) {
  if (!link) return '';
  if (typeof link === 'string') return link;
  const list = [].concat(link);
  const alt = list.find((l) => !l['@_rel'] || l['@_rel'] === 'alternate') ?? list[0];
  return alt['@_href'] ?? text(alt);
}

/** Converte o XML de um feed RSS 2.0 ou Atom em itens normalizados. */
export function parseFeed(xml, feed) {
  const doc = parser.parse(xml);
  const raw = doc?.rss?.channel?.item ?? doc?.feed?.entry ?? doc?.['rdf:RDF']?.item ?? [];
  return [].concat(raw).map((it) => {
    const date = new Date(text(it.pubDate) || text(it.published) || text(it.updated) || text(it['dc:date']));
    return {
      feed: feed.id,
      publisher: feed.name,
      type: feed.type,
      weight: feed.weight ?? 1,
      lang: feed.lang,
      title: stripHtml(text(it.title)),
      url: pickLink(it.link) || text(it.guid),
      date: Number.isNaN(date.getTime()) ? null : date.toISOString(),
      // Resumo curto: usado para classificar e dar contexto à IA — nunca é republicado.
      summary: stripHtml(text(it.description) || text(it.summary) || text(it.content)).slice(0, 700),
    };
  });
}

export async function fetchFeed(feed, { timeoutMs = 20000 } = {}) {
  const res = await fetch(feed.url, {
    headers: {
      'User-Agent': 'CryptoRadarBrasil/1.0 (+https://github.com/paixaojeferson76-ops/cryptoradar-brasil)',
      Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8',
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseFeed(await res.text(), feed);
}
