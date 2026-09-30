import { isCryptoRelated } from './classify.mjs';
import { stripAccents } from './text.mjs';

const RUMOR = /(rumou?r|reportedly|unconfirmed|sources say|could soon|allegedly|speculat|leak|boato|especula|nao confirmad|supostamente|segundo fontes|price prediction|previsao de preco|could hit|poderia chegar|to the moon|\?$)/i;
const PREDICTION = /((sees|expects|predicts|forecasts?|targets?|preve|projeta)\b.*(\$\d|reach|hit|chegar|atingir))|(price (analysis|prediction|outlook))|(analise tecnica)/i;
const PROMO = /(sponsored|patrocinad|press release:|partner content|airdrop now|presale|pre-venda|giveaway|sorteio)/i;
const ROUNDUP = /(what happened in crypto|morning (briefing|minute)|daily (recap|brief)|newsletter|podcast|this week in|weekly (recap|roundup)|resumo (do dia|da semana)|live updates?|ao vivo)/i;

/**
 * Valida uma pauta antes de ela seguir para geração/publicação.
 * Retorna { ok, confidence: 'alta'|'media'|'baixa', reasons[] }.
 * Por padrão, só pautas de confiança "alta" podem ser publicadas sem revisão.
 */
export function validateStory(story, { now = new Date(), maxAgeHours = 72 } = {}) {
  const reasons = [];
  const lead = story.items[0];
  const text = stripAccents(story.items.map((i) => `${i.title} ${i.summary}`).join(' ').toLowerCase());

  if (!story.items.every((i) => /^https:\/\//.test(i.url))) reasons.push('fonte sem HTTPS');
  if (!story.firstSeen) reasons.push('sem data');
  else {
    const ageH = (now.getTime() - new Date(story.firstSeen).getTime()) / 36e5;
    if (ageH > maxAgeHours) reasons.push(`antiga (${Math.round(ageH)}h)`);
    if (ageH < -1) reasons.push('data no futuro');
  }
  if (!isCryptoRelated({ title: story.items.map((i) => i.title).join(' '), summary: text })) reasons.push('fora do tema cripto');
  if (PROMO.test(text)) reasons.push('conteúdo promocional');
  if (story.items.every((i) => ROUNDUP.test(stripAccents(i.title)))) reasons.push('resumo/boletim, não é notícia');
  if (story.items.every((i) => PREDICTION.test(stripAccents(i.title)))) reasons.push('previsão de preço');
  const rumor = story.items.every((i) => RUMOR.test(stripAccents(i.title)));
  if (rumor) reasons.push('parece rumor/especulação');
  if (lead.title.length < 15) reasons.push('título curto demais');

  const blocking = reasons.filter((r) => r !== 'parece rumor/especulação');
  const ok = blocking.length === 0 && !rumor;

  // Confirmação: fonte oficial OU 2+ veículos independentes.
  let confidence = 'baixa';
  if (ok && (story.official || story.publishers.length >= 3)) confidence = 'alta';
  else if (ok && story.publishers.length === 2) confidence = 'media';

  return { ok, confidence, reasons };
}

/** Pontuação para ordenar a fila de pautas (maior = mais relevante). */
export function scoreStory(story, validation, now = new Date()) {
  if (!validation.ok) return 0;
  const weight = story.items.reduce((s, i) => s + (i.weight ?? 1), 0);
  const ageH = story.firstSeen ? (now.getTime() - new Date(story.firstSeen).getTime()) / 36e5 : 72;
  const freshness = Math.max(0, 1 - ageH / 72);
  const br = /brasil|brazil|banco central|cvm|b3|real\b/i.test(story.items.map((i) => i.title).join(' ')) ? 2 : 0;
  return Math.round((weight * 10 + story.publishers.length * 8 + (story.official ? 15 : 0) + br * 5) * (0.4 + freshness));
}
