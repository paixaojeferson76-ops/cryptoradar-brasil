# Google Search Console e Google Analytics

O site já entrega o que o Google precisa: `sitemap-index.xml`, `robots.txt` apontando para o sitemap, canonical em todas as páginas, dados estruturados (NewsArticle, BreadcrumbList, WebSite, Organization), RSS e meta tag de verificação configurável.

- Sitemap: https://paixaojeferson76-ops.github.io/cryptoradar-brasil/sitemap-index.xml
- Robots: https://paixaojeferson76-ops.github.io/cryptoradar-brasil/robots.txt

> Com o site em `github.io/cryptoradar-brasil`, o `robots.txt` fica numa subpasta e o Google não o lê (ele só lê o da raiz do domínio). Isso não impede a indexação: basta enviar o sitemap no Search Console. Com domínio próprio, tudo fica na raiz.

## 1. Criar a propriedade

1. Acesse https://search.google.com/search-console e entre com sua conta Google.
2. Clique em **Adicionar propriedade**.
3. Escolha:
   - **Prefixo do URL**, para o endereço atual: `https://paixaojeferson76-ops.github.io/cryptoradar-brasil/`;
   - ou **Domínio**, quando tiver domínio próprio (ex.: `cryptoradar.com.br`; cobre www, http e https).

## 2. Verificar a propriedade

**Prefixo do URL, pela meta tag (recomendado aqui):**

1. Em **Outros métodos de verificação → Tag HTML**, copie só o valor de `content`, por exemplo `abc123XYZ...` em `<meta name="google-site-verification" content="abc123XYZ..." />`.
2. Salve e publique:
   ```bash
   gh variable set PUBLIC_GOOGLE_SITE_VERIFICATION --body "abc123XYZ..."
   gh workflow run deploy.yml
   ```
3. Espere o deploy terminar (~2 min) e clique em **Verificar**.

**Domínio:** o Google mostra um registro **TXT**. Crie esse registro no painel de DNS do seu domínio (Registro.br: **DNS → Editar zona → Nova entrada → TXT**) e clique em **Verificar** (pode levar algumas horas).

## 3. Enviar o sitemap

1. Menu **Sitemaps**.
2. Em "Adicionar um novo sitemap", digite `sitemap-index.xml` e clique em **Enviar**.
3. Status esperado: **Sucesso**, com cerca de 40 URLs descobertas.

## 4. Acompanhar a indexação

- **Páginas**: mostra quantas foram indexadas e por que outras não foram. "Rastreada, mas não indexada" é comum nas primeiras semanas.
- **Inspeção de URL**: cole o endereço de uma notícia nova e clique em **Solicitar indexação** para acelerar.
- **Desempenho**: cliques, impressões e buscas que trouxeram visitantes.
- **Aprimoramentos / Resultados avançados**: confere os dados estruturados (breadcrumbs, artigos).

Novas notícias entram no sitemap automaticamente a cada deploy; não é preciso reenviar.

### O que não dá para automatizar

A criação e a verificação da propriedade exigem login na sua conta Google. A API do Search Console permite enviar sitemaps e consultar dados, mas precisa de autorização OAuth sua; para um site deste porte, o envio manual único do sitemap basta.

### Google Notícias (opcional)

Para aparecer no Google Notícias, cadastre o site no https://publishercenter.google.com (exige domínio próprio e publicação regular). O site já usa o schema NewsArticle, datas e autoria que o Google considera.

## Google Analytics 4

1. Acesse https://analytics.google.com → **Administrador → Criar → Propriedade**. Fuso: Brasília; moeda: real.
2. Crie um **fluxo de dados da Web** com o endereço do site.
3. Copie o **ID da métrica** (formato `G-XXXXXXXXXX`).
4. Salve e publique:
   ```bash
   gh variable set PUBLIC_GA_ID --body "G-XXXXXXXXXX"
   gh workflow run deploy.yml
   ```
5. Abra o site, aceite os cookies e confira em **Relatórios → Tempo real**.

O Analytics só grava cookies depois do aceite no aviso (Consent Mode). Recusando, o site funciona normalmente.

Dica: em Search Console → **Configurações → Associações**, vincule a propriedade do Analytics para ver as buscas dentro dele.
