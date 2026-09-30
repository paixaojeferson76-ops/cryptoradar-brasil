# CryptoRadar Brasil

Portal estático de notícias e guias sobre Bitcoin e criptomoedas, em português, com as fontes sempre à vista.

- **Site:** https://paixaojeferson76-ops.github.io/cryptoradar-brasil/
- **Stack:** [Astro 7](https://astro.build) (site estático) + TypeScript + Markdown, CSS próprio, busca com [Pagefind](https://pagefind.app), hospedagem gratuita no GitHub Pages.
- **Custo:** zero. Sem banco de dados, sem servidor.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run dev` | Site local em http://localhost:4321/cryptoradar-brasil/ (com recarga automática) |
| `npm run build` | Gera o site final em `dist/` e o índice de busca |
| `npm run preview` | Serve o `dist/` localmente |
| `npm run lint` | ESLint + checagem de tipos do Astro |
| `npm test` | Testes unitários (Vitest) |
| `npm run verify` | Confere o `dist/`: rotas, SEO, links internos, sitemap, robots, RSS, busca, segredos. Use `-- --external` para testar os links das fontes |
| `npm run test:mobile` | Abre as páginas no Edge/Chrome (375px e 1280px), procura rolagem horizontal e erros de JS e salva capturas em `screenshots/` (precisa do `preview` rodando) |
| `npm run ci` | lint + testes + build + verify (o mesmo que o GitHub roda) |
| `npm run market:update` | Atualiza `src/data/market.json` (CoinGecko, mempool.space, alternative.me) |
| `npm run news:fetch` | Coleta e valida pautas dos feeds → `automation/data/pauta.md` |
| `npm run news:generate` | Gera notícias com IA a partir da pauta (precisa de `AI_API_KEY`) |

## Estrutura

```
src/
  config/site.ts          nome, categorias, menu, variáveis públicas
  content/articles/*.md   notícias e guias (um arquivo por texto)
  content/authors/*.json  autores
  content.config.ts       formato obrigatório dos textos (validado no build)
  components/             cabeçalho, rodapé, cards, SourceList, Advertisement, MarketStrip...
  layouts/                BaseLayout (SEO, Analytics, AdSense), PageLayout
  pages/                  rotas (home, categorias, notícias, legais, RSS, robots, ads.txt, capas)
  lib/                    SEO/JSON-LD, capas geradas, links, datas
  data/market.json        retrato do mercado usado no build
automation/               pipeline de notícias (coleta → validação → IA → revisão)
scripts/                  verificação do build, teste mobile, ícones
tests/                    testes unitários
.github/workflows/        deploy, CI e notícias automáticas
```

## Documentação

- [SETUP.md](SETUP.md): rodar no seu computador e publicar um texto novo
- [DEPLOY.md](DEPLOY.md): como o site vai ao ar e como usar domínio próprio
- [NEWS_AUTOMATION.md](NEWS_AUTOMATION.md): pipeline de notícias automáticas
- [API_SETUP.md](API_SETUP.md): chaves e variáveis (IA gratuita, CoinGecko)
- [ADSENSE_SETUP.md](ADSENSE_SETUP.md): monetização com Google AdSense
- [GOOGLE_SEARCH_CONSOLE.md](GOOGLE_SEARCH_CONSOLE.md): indexação no Google e Analytics

## Regras editoriais (resumo)

1. Nunca copiar textos de outros sites: fontes servem para descobrir e confirmar fatos.
2. Toda notícia tem a seção **Fontes** com links para as fontes consultadas (o build falha se faltar).
3. Nada de rumor, previsão de preço ou recomendação de investimento.
4. Textos gerados com IA mostram um aviso e passam por revisão (Pull Request) antes de publicar, salvo a opção `AUTO_PUBLISH`, que só vale para pautas confirmadas por fonte oficial ou 3+ veículos.

## Segurança

- Nenhuma chave vai para o Git: `.env` está no `.gitignore`; no GitHub as chaves ficam em *Secrets*.
- `npm run verify` falha se encontrar algo parecido com chave de API no HTML gerado.
- Nenhum script de terceiros é carregado enquanto Analytics/AdSense não forem configurados.
