# automation/

Scripts Node (sem dependências externas além de `fast-xml-parser`) que alimentam o site.

| Script | Comando | Função |
| --- | --- | --- |
| `fetch-news.mjs` | `npm run news:fetch` | Coleta feeds, deduplica, agrupa, valida → `data/queue.json` e `data/pauta.md` |
| `generate-articles.mjs` | `npm run news:generate -- --limit 3 [--min alta]` | IA escreve notícias originais das pautas; checa cópia, links e linguagem; grava em `src/content/articles/` |
| `update-market.mjs` | `npm run market:update` | Atualiza `src/data/market.json` (preços, taxas, sentimento) |
| build | `npm run build` | Gera o site em `dist/` |
| deploy | `git push` (ou `gh workflow run deploy.yml`) | Publica no GitHub Pages |

`config/sources.json` define os feeds. `data/` guarda o estado entre execuções (URLs já vistas, fila de pautas, relatório da última geração) e é versionado pelo workflow.

Agendamento gratuito (GitHub Actions):

- `news.yml`: a cada 6 horas: coleta → validação → geração → build de conferência → PR de revisão.
- `deploy.yml`: a cada 6 horas: atualiza o mercado e republica. Também roda em todo push na `main`.

Detalhes completos em [NEWS_AUTOMATION.md](../NEWS_AUTOMATION.md).
