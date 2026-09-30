/**
 * Capas "radar": ilustrações SVG geradas a partir do slug e da categoria.
 * São 100% originais (sem imagens de terceiros) e determinísticas: o mesmo
 * artigo sempre recebe a mesma capa.
 */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

export function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;',
  );
}

export function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
    } else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const cut = lines.slice(0, maxLines);
    cut[maxLines - 1] = cut[maxLines - 1].replace(/\s*\S*$/, '') + '…';
    return cut;
  }
  return lines;
}

interface CoverOptions {
  slug: string;
  hue: number;
  label: string;
  /** Com título: versão para redes sociais (Open Graph). */
  title?: string;
  brand?: string;
}

export function coverSvg({ slug, hue, label, title, brand }: CoverOptions): string {
  const W = 1200;
  const H = 630;
  const r = rng(hash(slug));
  const social = Boolean(title);
  const cx = social ? 930 + r() * 120 : 640 + r() * 360;
  const cy = 160 + r() * 310;
  const sweep = r() * 360;
  const rings = [90, 180, 270, 360, 450, 540];
  const bg1 = `hsl(${hue} 58% 20%)`;
  const bg2 = `hsl(${(hue + 30) % 360} 62% 11%)`;
  const signal = `hsl(${hue} 95% 66%)`;

  const blips = Array.from({ length: 5 }, (_, i) => {
    const angle = r() * Math.PI * 2;
    const dist = 60 + r() * 380;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const size = i === 0 ? 11 : 4 + r() * 4;
    const op = i === 0 ? 1 : 0.35 + r() * 0.4;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}" fill="${signal}" opacity="${op.toFixed(2)}"/>${
      i === 0
        ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26" fill="none" stroke="${signal}" stroke-width="2" opacity="0.5"/>`
        : ''
    }`;
  }).join('');

  const ringEls = rings
    .map(
      (rad, i) =>
        `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad}" fill="none" stroke="#fff" stroke-opacity="${(0.16 - i * 0.02).toFixed(2)}" stroke-width="${i % 2 ? 1 : 2}"${i % 2 ? ' stroke-dasharray="4 10"' : ''}/>`,
    )
    .join('');

  const text = social
    ? (() => {
        const lines = wrapText(title!, 30, 4);
        const size = lines.length > 3 ? 58 : 66;
        const tspans = lines
          .map((l, i) => `<tspan x="72" dy="${i === 0 ? 0 : size * 1.12}">${escapeXml(l)}</tspan>`)
          .join('');
        const startY = 300 - ((lines.length - 1) * size * 1.12) / 2;
        return `
  <rect x="0" y="0" width="760" height="${H}" fill="url(#fade)"/>
  <text x="72" y="104" font-family="'Bricolage Grotesque Variable','Bricolage Grotesque',Arial,Helvetica,sans-serif" font-size="30" font-weight="600" fill="${signal}">${escapeXml(label)}</text>
  <text x="72" y="${startY.toFixed(0)}" font-family="'Bricolage Grotesque Variable','Bricolage Grotesque',Arial,Helvetica,sans-serif" font-size="${size}" font-weight="700" fill="#fff" letter-spacing="-1">${tspans}</text>
  <text x="72" y="566" font-family="'Bricolage Grotesque Variable','Bricolage Grotesque',Arial,Helvetica,sans-serif" font-size="30" font-weight="700" fill="#fff" opacity="0.92">${escapeXml(brand ?? '')}</text>`;
      })()
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${(cx / W).toFixed(3)}" cy="${(cy / H).toFixed(3)}" r="0.55">
      <stop offset="0" stop-color="${signal}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${signal}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${signal}" stop-opacity="0"/>
      <stop offset="1" stop-color="${signal}" stop-opacity="0.38"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${bg2}" stop-opacity="0.92"/>
      <stop offset="0.75" stop-color="${bg2}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${bg2}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g stroke="#fff" stroke-opacity="0.05">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${W}" y2="${i * 100}"/>`).join('')}
  </g>
  ${ringEls}
  <g transform="rotate(${sweep.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})">
    <path d="M${cx.toFixed(1)} ${cy.toFixed(1)} L${(cx + 560).toFixed(1)} ${cy.toFixed(1)} A560 560 0 0 0 ${(cx + 560 * Math.cos(-0.55)).toFixed(1)} ${(cy + 560 * Math.sin(-0.55)).toFixed(1)} Z" fill="url(#sweep)"/>
    <line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${(cx + 560).toFixed(1)}" y2="${cy.toFixed(1)}" stroke="${signal}" stroke-width="2" stroke-opacity="0.8"/>
  </g>
  <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="6" fill="#fff"/>
  ${blips}${text}
</svg>`;
}
