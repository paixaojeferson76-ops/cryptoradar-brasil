import { describe, it, expect } from 'vitest';
import rehypeSiteLinks from '../src/lib/rehype-site-links.mjs';
import { coverSvg, wrapText, escapeXml } from '../src/lib/cover.ts';

const tree = (children) => ({ type: 'root', children });
const a = (href) => ({ type: 'element', tagName: 'a', properties: { href }, children: [] });

describe('rehype-site-links', () => {
  it('prefixa links internos com o base e protege links externos', () => {
    const t = tree([a('/bitcoin'), a('https://bitcoin.org'), a('#fontes')]);
    rehypeSiteLinks({ base: '/cryptoradar-brasil' })(t);
    expect(t.children[0].properties.href).toBe('/cryptoradar-brasil/bitcoin');
    expect(t.children[1].properties).toMatchObject({ target: '_blank', rel: ['noopener', 'noreferrer', 'external'] });
    expect(t.children[2].properties.href).toBe('#fontes');
  });
  it('não duplica prefixo nem altera com base raiz', () => {
    const t = tree([a('/cryptoradar-brasil/x'), a('/y')]);
    rehypeSiteLinks({ base: '/cryptoradar-brasil' })(t);
    expect(t.children[0].properties.href).toBe('/cryptoradar-brasil/x');
    const t2 = tree([a('/y')]);
    rehypeSiteLinks({ base: '/' })(t2);
    expect(t2.children[0].properties.href).toBe('/y');
  });
});

describe('capas', () => {
  it('é determinística e escapa texto', () => {
    const one = coverSvg({ slug: 'a', hue: 30, label: 'A&B', title: 'Título <x>', brand: 'CR' });
    expect(one).toBe(coverSvg({ slug: 'a', hue: 30, label: 'A&B', title: 'Título <x>', brand: 'CR' }));
    expect(one).toContain('A&amp;B');
    expect(one).toContain('Título &lt;x&gt;');
    expect(one).not.toBe(coverSvg({ slug: 'b', hue: 30, label: 'A&B' }));
  });
  it('quebra títulos longos em linhas', () => {
    const lines = wrapText('um dois tres quatro cinco seis sete oito nove dez onze doze', 10, 3);
    expect(lines).toHaveLength(3);
    expect(lines[2].endsWith('…')).toBe(true);
    expect(escapeXml(`"'`)).toBe('&quot;&apos;');
  });
});
