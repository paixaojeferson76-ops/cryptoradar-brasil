import { normalizeUrl, similarity, slugify } from './text.mjs';
import { classify, suggestTags } from './classify.mjs';

/** Remove itens repetidos (mesma URL) e itens já vistos em execuções anteriores. */
export function dedupeItems(items, seenUrls = new Set()) {
  const out = [];
  const urls = new Set();
  for (const it of items) {
    if (!it.url || !it.title) continue;
    const key = normalizeUrl(it.url);
    if (urls.has(key) || seenUrls.has(key)) continue;
    urls.add(key);
    out.push({ ...it, url: key });
  }
  return out;
}

/**
 * Agrupa itens de fontes diferentes que falam do mesmo acontecimento
 * (títulos parecidos). Cada grupo vira uma "pauta" com várias fontes.
 */
export function clusterStories(items, threshold = 0.42) {
  const stories = [];
  const sorted = [...items].sort((a, b) => (b.weight ?? 1) - (a.weight ?? 1));
  for (const it of sorted) {
    let target = null;
    let best = 0;
    for (const s of stories) {
      const sim = Math.max(...s.items.map((x) => similarity(x.title, it.title)));
      if (sim >= threshold && sim > best) {
        best = sim;
        target = s;
      }
    }
    if (target) target.items.push(it);
    else stories.push({ items: [it] });
  }
  return stories.map((s) => {
    const lead = s.items[0];
    const publishers = [...new Set(s.items.map((i) => i.publisher))];
    const dates = s.items.map((i) => i.date).filter(Boolean).sort();
    return {
      id: slugify(lead.title, 70),
      headline: lead.title,
      category: classify(lead),
      tags: suggestTags({ title: s.items.map((i) => i.title).join(' '), summary: lead.summary }),
      firstSeen: dates[0] ?? null,
      publishers,
      official: s.items.some((i) => i.type === 'official'),
      items: s.items,
    };
  });
}

/** Detecta pautas que já viraram artigo no site (por URL de fonte ou título parecido). */
export function alreadyPublished(story, existing) {
  const urls = new Set(story.items.map((i) => normalizeUrl(i.url)));
  return existing.some(
    (a) =>
      a.sourceUrls.some((u) => urls.has(normalizeUrl(u))) ||
      story.items.some((i) => similarity(i.title, a.title) >= 0.5),
  );
}
