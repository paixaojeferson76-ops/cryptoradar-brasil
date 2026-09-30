// Gera os ícones PNG a partir de public/favicon.svg (rodar só quando o logo mudar).
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const out = (n) => new URL(`../public/${n}`, import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['logo-192.png', 192], ['logo-512.png', 512]]) {
  await sharp(svg, { density: 1200 }).resize(size, size).png().toFile(out(name));
  console.log('gerado', name);
}
