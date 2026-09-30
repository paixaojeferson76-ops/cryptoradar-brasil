import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Carrega o arquivo .env da raiz do projeto em process.env (sem sobrescrever
 * variáveis já definidas — no GitHub Actions elas vêm dos Secrets).
 */
export function loadEnv() {
  const path = fileURLToPath(new URL('../../.env', import.meta.url));
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return;
  }
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const value = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (process.env[m[1]] === undefined || process.env[m[1]] === '') process.env[m[1]] = value;
  }
}
