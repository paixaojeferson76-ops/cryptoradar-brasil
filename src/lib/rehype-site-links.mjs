/**
 * Plugin rehype usado nos artigos em Markdown:
 * - links internos ("/bitcoin") recebem o prefixo `base` (necessário no GitHub Pages
 *   sem domínio próprio, onde o site fica em /cryptoradar-brasil/);
 * - links externos abrem em nova aba com rel="noopener noreferrer".
 * @param {{ base?: string }} options
 */
export default function rehypeSiteLinks(options = {}) {
  const base = (options.base ?? '/').replace(/\/$/, '');

  /** @param {any} node */
  function walk(node) {
    if (node.type === 'element') {
      const props = node.properties ?? {};
      const attr = node.tagName === 'a' ? 'href' : node.tagName === 'img' ? 'src' : null;
      const value = attr ? props[attr] : undefined;
      if (typeof value === 'string') {
        if (value.startsWith('/') && !value.startsWith('//')) {
          if (base && !value.startsWith(base + '/')) props[attr] = base + value;
        } else if (node.tagName === 'a' && /^https?:\/\//i.test(value)) {
          props.target = '_blank';
          props.rel = ['noopener', 'noreferrer', 'external'];
        }
      }
      if (node.tagName === 'img') {
        props.loading ??= 'lazy';
        props.decoding ??= 'async';
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  }

  return (/** @type {any} */ tree) => walk(tree);
}
