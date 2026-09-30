import { SITE } from '../config/site';

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: SITE.timezone,
});
const longFmt = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: SITE.timezone,
});
const timeFmt = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: SITE.timezone,
});

export const formatDate = (d: Date) => dateFmt.format(d).replace(/\./g, '');
export const formatLongDate = (d: Date) => longFmt.format(d);
export const formatTime = (d: Date) => timeFmt.format(d).replace(':', 'h');

/** Minutos de leitura estimados (≈ 200 palavras por minuto em português). */
export function readingTime(markdown = ''): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`[\]()|-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const TYPE_LABEL = { noticia: 'Notícia', guia: 'Guia', analise: 'Análise' } as const;
