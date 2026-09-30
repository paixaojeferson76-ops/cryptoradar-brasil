#!/usr/bin/env node
/**
 * ETAPA 1 — COLETA, DEDUPLICAÇÃO E VALIDAÇÃO
 *
 * Lê os feeds de automation/config/sources.json, remove repetidos, agrupa o
 * mesmo acontecimento vindo de fontes diferentes, valida (data, tema, rumor,
 * confirmação) e grava a fila de pautas em automation/data/queue.json.
 * Também gera automation/data/pauta.md (legível por humanos).
 *
 * Não usa IA e não publica nada. Uso: npm run news:fetch
 */
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/env.mjs';
import { fetchFeed } from './lib/feeds.mjs';
import { isCryptoRelated } from './lib/classify.mjs';
import { dedupeItems, clusterStories, alreadyPublished } from './lib/stories.mjs';
import { validateStory, scoreStory } from './lib/validate.mjs';
import { DATA_DIR, ROOT, readJson, writeJson, listExistingArticles } from './lib/store.mjs';

loadEnv();

export async function collect({ now = new Date(), log = console.log } = {}) {
  const config = await readJson(join(ROOT, 'automation', 'config', 'sources.json'), { feeds: [] });
  const seen = await readJson(join(DATA_DIR, 'seen.json'), { urls: {} });
  const seenUrls = new Set(Object.keys(seen.urls));

  const results = await Promise.allSettled(config.feeds.map((f) => fetchFeed(f)));
  const items = [];
  results.forEach((r, i) => {
    const feed = config.feeds[i];
    if (r.status === 'rejected') return log(`  ✗ ${feed.name}: ${r.reason.message}`);
    const list = feed.filter ? r.value.filter(isCryptoRelated) : r.value;
    log(`  ✓ ${feed.name}: ${list.length} itens`);
    items.push(...list);
  });

  const maxAge = (config.maxAgeHours ?? 72) * 36e5;
  const recent = items.filter((i) => i.date && now.getTime() - new Date(i.date).getTime() <= maxAge);
  const fresh = dedupeItems(recent, seenUrls);
  const existing = await listExistingArticles();
  const stories = clusterStories(fresh, config.similarityThreshold)
    .filter((s) => !alreadyPublished(s, existing))
    .map((s) => {
      const validation = validateStory(s, { now, maxAgeHours: config.maxAgeHours });
      return { ...s, validation, score: scoreStory(s, validation, now), status: validation.ok ? 'pendente' : 'descartada' };
    })
    .sort((a, b) => b.score - a.score);

  // Mantém a fila anterior (itens ainda pendentes) e acrescenta as novas pautas.
  const previous = await readJson(join(DATA_DIR, 'queue.json'), { stories: [] });
  const byId = new Map(previous.stories.filter((s) => s.status === 'pendente').map((s) => [s.id, s]));
  for (const s of stories) if (!byId.has(s.id)) byId.set(s.id, s);
  const queue = [...byId.values()]
    .filter((s) => now.getTime() - new Date(s.firstSeen ?? 0).getTime() <= maxAge * 2)
    .sort((a, b) => b.score - a.score);

  for (const it of fresh) seen.urls[it.url] = now.toISOString();
  // Esquece URLs com mais de 30 dias para o arquivo não crescer para sempre.
  for (const [u, d] of Object.entries(seen.urls)) if (now.getTime() - new Date(d).getTime() > 30 * 864e5) delete seen.urls[u];

  await writeJson(join(DATA_DIR, 'queue.json'), { updatedAt: now.toISOString(), stories: queue });
  await writeJson(join(DATA_DIR, 'seen.json'), seen);
  await writeFile(join(DATA_DIR, 'pauta.md'), renderPauta(queue, now));
  return { items: items.length, fresh: fresh.length, stories, queue };
}

function renderPauta(queue, now) {
  const lines = [
    `# Pauta de notícias`,
    '',
    `Gerada em ${now.toISOString()}. Fontes servem só para descobrir o fato: escreva texto original e cite todas.`,
    '',
  ];
  for (const s of queue.filter((q) => q.status === 'pendente').slice(0, 30)) {
    lines.push(`## ${s.headline}`, '');
    lines.push(`- Categoria sugerida: ${s.category} | Confiança: ${s.validation.confidence} | Pontos: ${s.score}`);
    for (const i of s.items) lines.push(`- [${i.publisher}] ${i.title} — ${i.url} (${i.date})`);
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  console.log('Coletando feeds...');
  const { items, fresh, stories, queue } = await collect();
  const ok = stories.filter((s) => s.validation.ok);
  console.log(`\n${items} itens lidos, ${fresh} novos, ${stories.length} pautas novas (${ok.length} válidas).`);
  console.log(`Fila: ${queue.filter((q) => q.status === 'pendente').length} pautas pendentes → automation/data/pauta.md`);
  for (const s of ok.slice(0, 8)) {
    console.log(`  [${s.validation.confidence}] ${s.score.toString().padStart(3)}  ${s.headline}  (${s.publishers.join(', ')})`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
