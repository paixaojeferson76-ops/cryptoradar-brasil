import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const DATA_DIR = join(ROOT, 'automation', 'data');
export const ARTICLES_DIR = join(ROOT, 'src', 'content', 'articles');

export async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return fallback;
  }
}

export async function writeJson(path, data) {
  await mkdir(join(path, '..'), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + '\n');
}

/** Lê título e URLs de fontes de todos os artigos (sem depender do Astro). */
export async function listExistingArticles() {
  const files = (await readdir(ARTICLES_DIR)).filter((f) => f.endsWith('.md'));
  const out = [];
  for (const f of files) {
    const src = await readFile(join(ARTICLES_DIR, f), 'utf8');
    const fm = src.split(/^---$/m)[1] ?? '';
    const title = (fm.match(/^title:\s*"?(.*?)"?\s*$/m) ?? [])[1] ?? '';
    const sourceUrls = [...fm.matchAll(/url:\s*"?([^"\s]+)"?/g)].map((m) => m[1]);
    out.push({ slug: f.replace(/\.md$/, ''), title: title.replace(/\\"/g, '"'), sourceUrls });
  }
  return out;
}
