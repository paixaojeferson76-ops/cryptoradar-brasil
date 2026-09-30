/**
 * Cliente de IA com dois provedores:
 *  - gemini (padrão): Google AI Studio, tem nível gratuito. Chave em AI_API_KEY.
 *  - openai-compatible: qualquer API no formato /chat/completions (ex.: Groq,
 *    OpenRouter, OpenAI). Defina AI_BASE_URL, AI_API_KEY e AI_MODEL.
 * A chave nunca é gravada em arquivo nem registrada no log.
 */

export function aiConfig(env = process.env) {
  return {
    provider: (env.AI_PROVIDER || 'gemini').trim(),
    key: (env.AI_API_KEY || '').trim(),
    model: (env.AI_MODEL || '').trim(),
    baseUrl: (env.AI_BASE_URL || '').trim().replace(/\/$/, ''),
  };
}

export const aiAvailable = (cfg = aiConfig()) => Boolean(cfg.key);

const GEMINI = 'https://generativelanguage.googleapis.com/v1beta';

/**
 * Ordena modelos "gemini-X.Y-flash" estáveis do mais novo para o mais antigo.
 * Exclui variantes lite/imagem/áudio/preview. Exportada para teste.
 */
export function rankGeminiModels(names) {
  const version = (n) => (n.match(/gemini-(\d+(?:\.\d+)?)-flash$/) ?? [])[1];
  const stable = names.filter((n) => version(n)).sort((a, b) => Number(version(b)) - Number(version(a)));
  if (names.includes('gemini-flash-latest')) stable.push('gemini-flash-latest');
  return stable;
}

let cachedModels = null;

async function geminiCandidates(cfg) {
  if (cfg.model) return [cfg.model];
  if (cachedModels) return cachedModels;
  // Sem AI_MODEL: usa a lista de modelos liberados para a chave.
  const res = await fetch(`${GEMINI}/models?pageSize=200`, { headers: { 'x-goog-api-key': cfg.key } });
  if (!res.ok) throw new Error(`Gemini: não foi possível listar modelos (HTTP ${res.status})`);
  const { models = [] } = await res.json();
  const names = models
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name.replace(/^models\//, ''));
  cachedModels = rankGeminiModels(names).slice(0, 4);
  if (!cachedModels.length) throw new Error('Gemini: nenhum modelo "flash" disponível para esta chave');
  return cachedModels;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callGemini(cfg, system, user) {
  const failures = [];
  for (const model of await geminiCandidates(cfg)) {
    // Até 3 tentativas por modelo quando o Google está sobrecarregado (503/429/500).
    for (let attempt = 1; attempt <= 3; attempt++) {
      const res = await fetch(`${GEMINI}/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cfg.key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
        }),
        signal: AbortSignal.timeout(120000),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';
        if (text) return { text, model: `gemini:${model}` };
        failures.push(`${model}: resposta vazia (${data.candidates?.[0]?.finishReason ?? '?'})`);
        break;
      }
      const detail = (await res.text()).slice(0, 160);
      if ([429, 500, 503].includes(res.status) && attempt < 3) {
        await sleep(attempt * 8000);
        continue;
      }
      failures.push(`${model}: HTTP ${res.status} ${detail}`);
      break; // 404/403 ou tentativas esgotadas: tenta o próximo modelo
    }
  }
  throw new Error(`Gemini indisponível. ${failures.join(' | ')}`);
}

async function callOpenAICompatible(cfg, system, user) {
  if (!cfg.baseUrl || !cfg.model) throw new Error('Defina AI_BASE_URL e AI_MODEL para o provedor openai-compatible');
  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
    body: JSON.stringify({
      model: cfg.model,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
    signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`IA HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return { text: data.choices?.[0]?.message?.content ?? '', model: cfg.model };
}

/** Envia o prompt e devolve o JSON já interpretado. */
export async function generateJson(system, user, cfg = aiConfig()) {
  if (!cfg.key) throw new Error('AI_API_KEY não definida');
  const call = cfg.provider === 'openai-compatible' ? callOpenAICompatible : callGemini;
  const { text, model } = await call(cfg, system, user);
  const json = text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  try {
    return { data: JSON.parse(json), model };
  } catch {
    throw new Error(`Resposta da IA não é JSON válido: ${json.slice(0, 200)}`);
  }
}
