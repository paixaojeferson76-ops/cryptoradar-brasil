import type { APIRoute } from 'astro';
import { ENV } from '../config/site';

/**
 * ads.txt oficial do AdSense: "google.com, pub-XXXX, DIRECT, f08c47fec0942fa0".
 * Gerado a partir de PUBLIC_ADSENSE_CLIENT (ca-pub-XXXX). Observação: o ads.txt só
 * é lido pelo Google na raiz do domínio — veja ADSENSE_SETUP.md.
 */
export const GET: APIRoute = () => {
  const pub = ENV.adsenseClient.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense ainda não configurado (defina PUBLIC_ADSENSE_CLIENT).\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
