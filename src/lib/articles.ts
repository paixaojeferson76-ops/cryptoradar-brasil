import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES, type CategoryId } from '../config/site';

export type Article = CollectionEntry<'articles'>;

/** Artigos publicados (sem rascunhos), do mais recente para o mais antigo. */
export async function getPublished(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

/** Artigos de uma categoria: categoria principal ou marcados com a tag da categoria. */
export function inCategory(list: Article[], id: CategoryId): Article[] {
  const name = CATEGORIES[id].name.toLowerCase();
  return list.filter(
    (a) =>
      a.data.category === id ||
      a.data.tags.some((t) => t.toLowerCase() === id || t.toLowerCase() === name),
  );
}

/** Notícias relacionadas: mesma categoria e tags em comum, desempate pela data. */
export function related(article: Article, list: Article[], limit = 4): Article[] {
  const tags = new Set(article.data.tags.map((t) => t.toLowerCase()));
  return list
    .filter((a) => a.id !== article.id)
    .map((a) => {
      let score = a.data.category === article.data.category ? 3 : 0;
      for (const t of a.data.tags) if (tags.has(t.toLowerCase())) score += 1;
      if (tags.has(a.data.category)) score += 1;
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || y.a.data.pubDate.getTime() - x.a.data.pubDate.getTime())
    .slice(0, limit)
    .map((x) => x.a);
}

export const articleHref = (a: Article) => `/noticias/${a.id}`;

export function tagSlug(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
