# Automação de notícias

```text
FONTES (RSS) → COLETA → DEDUPLICAÇÃO → VALIDAÇÃO → GERAÇÃO (IA) → CHECAGEM → REVISÃO (PR) → PUBLICAÇÃO (merge + deploy)
```

Roda sozinha no GitHub Actions a cada 6 horas (`.github/workflows/news.yml`) e pode ser executada à mão (**Actions → Notícias automáticas → Run workflow**) ou no seu computador.

## 1. Fontes

Arquivo `automation/config/sources.json`. Os feeds servem **só para descobrir** acontecimentos. O texto publicado é sempre original e cita todas as fontes.

| Fonte | Tipo | Observação |
| --- | --- | --- |
| Banco Central do Brasil | oficial | Filtrado para temas de cripto/ativos virtuais |
| SEC (EUA) | oficial | Filtrado para cripto/ativos digitais |
| Ethereum Foundation Blog | oficial | Atualizações do protocolo |
| Bitcoin Core (GitHub) | oficial | Lançamentos do software |
| Bitcoin Optech | técnica | Boletim técnico do Bitcoin |
| CoinDesk, Cointelegraph, Decrypt, The Block, Bitcoin Magazine | veículos | Inglês |
| Livecoins, Portal do Bitcoin | veículos | Português |

**Por que RSS e não uma API de notícias paga:** os feeds são gratuitos, oficiais de cada veículo, não exigem chave e trazem título, link, data e um resumo curto. APIs de notícias foram avaliadas em setembro de 2026 e descartadas para manter custo zero com uso comercial: NewsAPI.org e GNews têm plano grátis de ~100 requisições/dia restrito a uso não comercial/desenvolvimento, e a CryptoPanic encerrou o plano gratuito da API no início de 2026. Confira os termos atuais antes de trocar de fonte. Para adicionar uma fonte, inclua uma linha no JSON com `type` (`official` ou `media`) e `weight` (1 a 3).

## 2. Coleta, deduplicação e validação (`npm run news:fetch`)

- Lê todos os feeds em paralelo; um feed fora do ar não interrompe os outros.
- Descarta itens com mais de 72 horas, URLs repetidas (inclusive com `utm_` diferente) e URLs vistas nos últimos 30 dias (`automation/data/seen.json`).
- **Agrupa o mesmo acontecimento** vindo de veículos diferentes (títulos parecidos) em uma única pauta com várias fontes.
- Ignora pautas que já viraram artigo no site (mesma URL de fonte ou título parecido).
- **Valida**: HTTPS, data (nem antiga nem no futuro), tema cripto, e descarta rumores ("reportedly", "segundo fontes"), previsões de preço, resumos diários e conteúdo patrocinado.
- **Confiança**: `alta` = fonte oficial ou 3+ veículos; `media` = 2 veículos; `baixa` = 1 veículo.
- Grava a fila em `automation/data/queue.json` e uma versão legível em `automation/data/pauta.md` (útil mesmo sem IA: é a pauta do dia para escrever à mão).

## 3. Geração (`npm run news:generate -- --limit 3`)

Para cada pauta pendente com confiança mínima `media` (ajuste com `--min alta`):

1. Envia à IA **apenas** título, resumo, data e URL de cada fonte, a lista de artigos do site (para links internos) e regras rígidas: só fatos das fontes, atribuição ("segundo a SEC"), nada de cópia, nada de previsão ou recomendação, e responder `skip` se as fontes forem insuficientes.
2. **Checagem automática** da resposta: tamanhos de título/resumo/SEO, corpo com 220+ palavras, nenhuma sequência de 12+ palavras copiada das fontes, nenhum link interno inexistente ou link externo fora das fontes, nenhuma linguagem de recomendação.
3. Gera slug único, SEO title/description, categoria, tags, links internos e a seção **Fontes** (com data de consulta).
4. Grava `src/content/articles/<slug>.md` com `generatedBy` (o site exibe o aviso de texto feito com IA).

Sem `AI_API_KEY`, a etapa apenas avisa e sai. Veja [API_SETUP.md](API_SETUP.md) para a chave gratuita.

## 4. Revisão e publicação

| Modo | Como ativar | O que acontece |
| --- | --- | --- |
| Local (padrão) | rodar no seu PC | Arquivos com `draft: true`: não aparecem no site até você trocar para `false` |
| **Pull Request (padrão no GitHub)** | automático no workflow | Abre um PR "Notícias para revisão" com os textos. **Você confere contra as fontes e faz o merge**: o site publica em ~2 min. Fechar o PR descarta |
| Publicação automática | variável `AUTO_PUBLISH=true` no GitHub | Só pautas de confiança **alta** vão direto ao ar (marcadas como não revisadas). As demais continuam em PR |

Por padrão nada é publicado sem revisão humana.

### Como revisar um PR

1. Abra o PR (você recebe e-mail do GitHub).
2. Em **Files changed**, leia cada texto e abra as fontes listadas.
3. Corrija direto no GitHub (ícone de lápis) se precisar. Remova o que não puder ser verificado.
4. **Merge pull request**. O deploy roda sozinho.

## 5. Mercado e build

- `npm run market:update` atualiza preços (CoinGecko), taxas da rede Bitcoin (mempool.space) e índice de medo e ganância (alternative.me). Se uma API cair, mantém o último retrato.
- No navegador, a faixa de cotações busca preços ao vivo na CoinGecko; se falhar, mostra o retrato do build.
- O deploy roda a cada 6 horas para renovar esse retrato.

## Rodar tudo no seu computador

```bash
npm run news:fetch                 # pauta em automation/data/pauta.md
npm run news:generate -- --limit 2 # precisa de AI_API_KEY no .env
npm run build && npm run verify
npm run preview                    # rascunhos (draft: true) não aparecem
```

## Limites e cuidados

- A IA pode errar. A revisão existe para isso: confira números, nomes e datas nas fontes.
- Feeds às vezes mudam de endereço. Se um sumir, o log mostra `✗ Nome: HTTP 404`; atualize `sources.json`.
- GitHub Actions é gratuito para repositórios públicos. Cron pode atrasar alguns minutos em horários de pico.
