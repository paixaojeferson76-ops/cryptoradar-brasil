# Configuração local

## Requisitos

- Node.js 22.12 ou mais novo (testado com Node 24)
- Git
- Opcional: VS Code, Microsoft Edge ou Google Chrome (para `npm run test:mobile`)

## Primeira vez

```bash
git clone https://github.com/paixaojeferson76-ops/cryptoradar-brasil.git
cd cryptoradar-brasil
npm install
cp .env.example .env      # opcional: só se for usar chaves (veja API_SETUP.md)
npm run dev
```

Abra http://localhost:4321/cryptoradar-brasil/.

No `npm run dev`, os espaços de anúncio aparecem como caixas tracejadas para você ver o layout. No site publicado, eles só aparecem quando o AdSense estiver configurado.

> A busca só funciona depois de `npm run build` (use `npm run preview` para testar).

## Publicar um texto novo à mão

1. Crie `src/content/articles/meu-slug.md`. O nome do arquivo vira o endereço: `/noticias/meu-slug`.
2. Use este modelo:

```markdown
---
title: "Título com 10 a 120 caracteres"
description: "Resumo de 50 a 260 caracteres, usado nos cards e no Google."
seoTitle: "Opcional: título para o Google (até 70)"
seoDescription: "Opcional: descrição para o Google (50 a 160)."
pubDate: 2026-10-01T09:30:00-03:00
author: redacao
category: bitcoin        # bitcoin, ethereum, altcoins, blockchain, defi, regulacao, mineracao, seguranca, mercado, tecnologia
tags: ["Bitcoin", "mercado"]
type: noticia            # noticia, guia ou analise
featured: false          # true = pode ir para a manchete da home
sources:                 # obrigatório para "noticia"
  - title: "Título da fonte"
    url: "https://..."
    publisher: "Nome do veículo ou órgão"
    accessed: 2026-10-01
---

Texto em Markdown. Links internos: [texto](/noticias/outro-slug) ou [Bitcoin](/bitcoin).
```

3. `npm run build && npm run verify` para conferir.
4. `git add . && git commit -m "noticia: ..." && git push`. O site é atualizado sozinho em ~2 minutos.

Campos opcionais: `image` + `imageAlt` + `imageCredit` (imagem própria ou com licença; sem ela o site gera a capa "radar" automaticamente), `updatedDate`, `draft: true` (esconde do site).

## Onde mudar as coisas

| Quero mudar | Arquivo |
| --- | --- |
| Nome, descrição, categorias, menu | `src/config/site.ts` |
| Cores e fontes | `src/styles/global.css` (variáveis no topo) |
| Texto das páginas Sobre, Contato e legais | `src/pages/*.astro` |
| Moedas da faixa de cotações | `automation/update-market.mjs` (lista `COINS`) |
| Feeds de notícias | `automation/config/sources.json` |

## Antes de enviar alterações

```bash
npm run ci
```

Roda lint, testes, build e a verificação completa. É o mesmo que o GitHub executa antes de publicar.
