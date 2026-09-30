import { SITE } from '../config/site';
import { absolute } from './url';

type Site = URL | undefined;

export function organizationLd(site: Site) {
  return {
    '@type': 'NewsMediaOrganization',
    '@id': absolute('/#organization', site),
    name: SITE.name,
    url: absolute('/', site),
    logo: {
      '@type': 'ImageObject',
      url: absolute('/logo-512.png', site),
      width: 512,
      height: 512,
    },
    foundingDate: String(SITE.foundingYear),
    publishingPrinciples: absolute('/sobre', site),
    ethicsPolicy: absolute('/sobre', site),
  };
}

export function websiteLd(site: Site) {
  return {
    '@type': 'WebSite',
    '@id': absolute('/#website', site),
    name: SITE.name,
    url: absolute('/', site),
    inLanguage: SITE.lang,
    publisher: { '@id': absolute('/#organization', site) },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: absolute('/busca', site) + '?q={search_term_string}' },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[], site: Site) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.path, site),
    })),
  };
}

export function articleLd(
  a: {
    title: string;
    description: string;
    path: string;
    image: string;
    pubDate: Date;
    updatedDate?: Date;
    authorName: string;
    authorPath: string;
    section: string;
    tags: string[];
    type: 'noticia' | 'guia' | 'analise';
    sources: { url: string }[];
  },
  site: Site,
) {
  return {
    '@type': a.type === 'noticia' ? 'NewsArticle' : a.type === 'analise' ? 'AnalysisNewsArticle' : 'Article',
    '@id': absolute(a.path, site) + '#article',
    headline: a.title,
    description: a.description,
    image: [absolute(a.image, site)],
    datePublished: a.pubDate.toISOString(),
    dateModified: (a.updatedDate ?? a.pubDate).toISOString(),
    inLanguage: SITE.lang,
    mainEntityOfPage: absolute(a.path, site),
    articleSection: a.section,
    keywords: a.tags.join(', '),
    author: [{ '@type': 'Organization', name: a.authorName, url: absolute(a.authorPath, site) }],
    publisher: { '@id': absolute('/#organization', site) },
    isAccessibleForFree: true,
    citation: a.sources.map((s) => s.url),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
