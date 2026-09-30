import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS } from './config/site';

const source = z.object({
  title: z.string().min(3),
  url: z.url({ protocol: /^https?$/ }),
  publisher: z.string().min(2),
  /** Data em que a fonte foi consultada (AAAA-MM-DD). */
  accessed: z.coerce.date().optional(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string().min(10).max(120),
      /** Resumo exibido nos cards e usado como meta description padrão. */
      description: z.string().min(50).max(260),
      seoTitle: z.string().max(70).optional(),
      seoDescription: z.string().min(50).max(160).optional(),
      /** Data e hora de publicação (ISO, com fuso: 2026-09-30T10:00:00-03:00). */
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: reference('authors'),
      category: z.enum(CATEGORY_IDS),
      tags: z.array(z.string().min(2)).max(12).default([]),
      type: z.enum(['noticia', 'guia', 'analise']),
      /** Imagem de capa opcional (caminho em /public ou URL com licença de uso). Sem ela, gera-se a capa "radar". */
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      imageCredit: z.string().optional(),
      sources: z.array(source).default([]),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      /** Metadados da automação (quem gerou, revisão humana, etc.). */
      generatedBy: z.string().optional(),
      reviewed: z.boolean().default(true),
    })
    .refine((a) => a.type !== 'noticia' || a.sources.length > 0, {
      message: 'Toda notícia precisa de pelo menos uma fonte em "sources".',
      path: ['sources'],
    })
    .refine((a) => !a.image || !!a.imageAlt, {
      message: 'Imagem de capa exige "imageAlt".',
      path: ['imageAlt'],
    }),
});

const authors = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    url: z.url().optional(),
  }),
});

export const collections = { articles, authors };
