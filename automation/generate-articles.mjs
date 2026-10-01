#!/usr/bin/env node
/**
 * ETAPA 2 — GERAÇÃO DE CONTEÚDO, SEO E DECISÃO DE PUBLICAÇÃO
 *
 * Pega as pautas pendentes mais relevantes de automation/data/queue.json,
 * pede à IA uma notícia ORIGINAL baseada só nas fontes, confere o resultado
 * (tamanho, cópia de trechos, links, linguagem de recomendação) e grava em
 * src/content/articles/<slug>.md com a seção de fontes preenchida.
 *
 * Publicação:
 *  - padrão (local): draft: true  → não aparece no site até alguém revisar;
 *  - REVIEW_VIA_PR=true (GitHub Actions): draft: false dentro de um Pull
 *    Request — o merge do PR é a revisão humana;
 *  - AUTO_PUBLISH=true: só pautas de confiança "alta" (fonte oficial ou 3+
 *    veículos) vão direto ao ar, marcadas como não revisadas.
 *
 * Uso: npm run news:generate -- --limit 3
 * Sem AI_API_KEY, apenas informa e sai (a pauta continua em automation/data/pauta.md).
 */
import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/env.mjs';
import { aiAvailable, aiConfig, generateJson } from './lib/ai.mjs';
import { SYSTEM_PROMPT, buildUserPrompt, checkGenerated, toMarkdown, uniqueSlug } from './lib/article.mjs';
import { fetchArticleText } from './lib/extract.mjs';
import { pickImageFor } from './lib/images.mjs';
import { readFile } from 'node:fs/promises';
import { ARTICLES_DIR, DATA_DIR, readJson, writeJson, listExistingArticles } from './lib/store.mjs';

loadEnv();

const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : def;
};

async function main() {
  const limit = Number(arg('limit', process.env.NEWS_LIMIT || 3));
  const minConfidence = arg('min', process.env.NEWS_MIN_CONFIDENCE || 'media');
  const autoPublish = process.env.AUTO_PUBLISH === 'true';
  const viaPr = process.env.REVIEW_VIA_PR === 'true';
  const cfg = aiConfig();
  const report = { auto: [], review: [], skipped: [], errors: [] };

  if (!aiAvailable(cfg)) {
    console.log('AI_API_KEY não definida: geração automática desligada.');
    console.log('A pauta está em automation/data/pauta.md. Veja API_SETUP.md para ativar a IA gratuita.');
    await writeJson(join(DATA_DIR, 'last-run.json'), { ...report, note: 'sem chave de IA' });
    return;
  }

  const rank = { baixa: 0, media: 1, alta: 2 };
  const queue = await readJson(join(DATA_DIR, 'queue.json'), { stories: [] });
  const candidates = queue.stories
    .filter((s) => s.status === 'pendente' && rank[s.validation.confidence] >= rank[minConfidence])
    .slice(0, limit);
  if (!candidates.length) console.log(`Nenhuma pauta pendente com confiança ≥ ${minConfidence}.`);

  const existing = await listExistingArticles();
  const slugs = new Set(existing.map((a) => a.slug));
  // Imagens já usadas no site (para não repetir foto entre matérias).
  const usedImages = new Set();
  for (const a of existing) {
    const src = await readFile(join(ARTICLES_DIR, `${a.slug}.md`), 'utf8').catch(() => '');
    const m = src.match(/^imageSource:\s*"?([^"\r\n]+)/m);
    if (m) usedImages.add(m[1]);
  }

  for (const story of candidates) {
    process.stdout.write(`→ ${story.headline}\n`);
    try {
      // Apuração: texto das páginas das fontes (não é publicado; usado pela IA e pela checagem anti-cópia).
      await Promise.all(story.items.map(async (i) => { i.fullText = await fetchArticleText(i.url); }));
      const { data, model } = await generateJson(SYSTEM_PROMPT, buildUserPrompt(story, existing), cfg);
      if (data.skip) {
        story.status = 'pulada';
        story.note = data.reason;
        report.skipped.push({ headline: story.headline, reason: data.reason });
        console.log(`  pulada pela IA: ${data.reason}`);
        continue;
      }
      const problems = checkGenerated(data, story, slugs);
      if (problems.length) {
        story.status = 'reprovada';
        story.note = problems.join('; ');
        report.skipped.push({ headline: story.headline, reason: story.note });
        console.log(`  reprovada: ${story.note}`);
        continue;
      }
      const auto = autoPublish && story.validation.confidence === 'alta';
      const draft = auto ? false : !viaPr;
      const reviewed = !auto && viaPr;
      const slug = uniqueSlug(data.title, slugs);
      slugs.add(slug);
      const queries = Array.isArray(data.imageQueries) ? data.imageQueries.slice(0, 3) : [];
      const image = await pickImageFor(slug, [...queries, 'cryptocurrency'], usedImages);
      const file = join(ARTICLES_DIR, `${slug}.md`);
      await writeFile(file, toMarkdown(data, story, { draft, reviewed, model, image }));
      existing.push({ slug, title: data.title, sourceUrls: story.items.map((i) => i.url) });
      story.items.forEach((i) => delete i.fullText);
      story.status = 'gerada';
      story.slug = slug;
      (auto ? report.auto : report.review).push({ slug, title: data.title, confidence: story.validation.confidence, sources: story.publishers });
      console.log(`  ${image ? 'imagem: ' + image.imageCredit : 'sem imagem (usa capa radar)'}`);
      console.log(`  ✓ ${auto ? 'publicação automática' : draft ? 'rascunho' : 'para revisão (PR)'}: src/content/articles/${slug}.md`);
    } catch (e) {
      report.errors.push({ headline: story.headline, error: e.message });
      console.error(`  erro: ${e.message}`);
    }
  }

  await writeJson(join(DATA_DIR, 'queue.json'), queue);
  await writeJson(join(DATA_DIR, 'last-run.json'), { at: new Date().toISOString(), ...report });
  console.log(`\nResumo: ${report.auto.length} automáticas, ${report.review.length} para revisão, ${report.skipped.length} puladas, ${report.errors.length} erros.`);
  if (report.errors.length && !report.auto.length && !report.review.length) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
