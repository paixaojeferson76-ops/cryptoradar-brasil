import { escapeXml, wrapText } from './cover';
import { SITE } from '../config/site';

const FONT = "'Bricolage Grotesque Variable','Bricolage Grotesque',Arial,Helvetica,sans-serif";

/** Camada com degradê, anéis de radar, categoria e título para a imagem social com foto. */
export function overlaySvg(title: string, label: string, hue: number) {
  const lines = wrapText(title, 32, 4);
  const size = lines.length > 3 ? 54 : 62;
  const lh = size * 1.1;
  const startY = 560 - (lines.length - 1) * lh - 80;
  const tspans = lines.map((l, i) => `<tspan x="64" dy="${i === 0 ? 0 : lh}">${escapeXml(l)}</tspan>`).join('');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.15" stop-color="#080c1c" stop-opacity="0"/>
      <stop offset="0.6" stop-color="#080c1c" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#080c1c" stop-opacity="0.96"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="2">
    <circle cx="1130" cy="70" r="70"/><circle cx="1130" cy="70" r="140" stroke-dasharray="4 10"/><circle cx="1130" cy="70" r="210"/>
  </g>
  <rect x="64" y="${startY - size - 38}" rx="18" width="${label.length * 15 + 40}" height="36" fill="hsl(${hue} 75% 45%)"/>
  <text x="84" y="${startY - size - 13}" font-family="${FONT}" font-size="22" font-weight="700" fill="#fff">${escapeXml(label)}</text>
  <text x="64" y="${startY}" font-family="${FONT}" font-size="${size}" font-weight="800" fill="#fff" letter-spacing="-1.5">${tspans}</text>
  <text x="64" y="590" font-family="${FONT}" font-size="26" font-weight="700" fill="#fff" opacity="0.9">${escapeXml(SITE.name)}</text>
</svg>`);
}

