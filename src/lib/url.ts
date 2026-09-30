const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Caminho interno com o prefixo do site (necessário quando o site fica em subpasta). */
export function link(path = '/'): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#') || path.startsWith('mailto:')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}` || '/';
}

/** URL absoluta (para canonical, Open Graph, JSON-LD, RSS). */
export function absolute(path: string, site: URL | undefined): string {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(link(path), site).href;
}

/** Remove o prefixo `base` de um pathname (para comparar com rotas do menu). */
export function stripBase(pathname: string): string {
  return (BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname) || '/';
}
