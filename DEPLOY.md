# Deploy

## Como funciona hoje

O site é publicado no **GitHub Pages** pelo workflow `.github/workflows/deploy.yml`:

- a cada `git push` na branch `main`;
- a cada 6 horas (atualiza o retrato do mercado e republica);
- manualmente: aba **Actions → Deploy (GitHub Pages) → Run workflow**.

O workflow instala as dependências, atualiza o mercado, roda lint, testes, build e a verificação, e só então publica. Se algo falhar, o site anterior continua no ar.

Endereço atual: https://paixaojeferson76-ops.github.io/cryptoradar-brasil/

### Por que GitHub Pages

| Opção | Resultado da avaliação |
| --- | --- |
| **GitHub Pages** | Escolhido. Gratuito, sem cartão, publicação automática pelo próprio repositório, HTTPS e domínio próprio grátis. Limites (1 GB de site, 100 GB/mês de tráfego) sobram para um blog. |
| Cloudflare Pages | Excelente alternativa: tráfego ilimitado, permite cabeçalhos de segurança (`public/_headers`) e repositório privado. Exige conta Cloudflare. Recomendado se o tráfego crescer muito. |
| Netlify | Plano grátis passou a ter créditos; o site pode ser pausado ao estourar. |
| Vercel | Plano Hobby é só para uso **não comercial**, incompatível com AdSense. |

## Variáveis no GitHub

Em **Settings → Secrets and variables → Actions**:

- aba **Variables** (valores públicos): `SITE_URL`, `PUBLIC_GA_ID`, `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_ADSENSE_SLOT_HOME`, `PUBLIC_ADSENSE_SLOT_ARTICLE`, `PUBLIC_ADSENSE_SLOT_SIDEBAR`, `PUBLIC_GOOGLE_SITE_VERIFICATION`, `PUBLIC_CONTACT_EMAIL`, `AUTO_PUBLISH`, `AI_PROVIDER`, `AI_MODEL`, `AI_BASE_URL`;
- aba **Secrets** (privados): `AI_API_KEY`, `CRYPTO_API_KEY`.

Pelo terminal (com `gh` logado): `gh variable set PUBLIC_GA_ID --body "G-XXXX"` e `gh secret set AI_API_KEY`.

Depois de mudar uma variável, rode o deploy manualmente para ela valer.

## Domínio próprio (recomendado para o AdSense)

O AdSense só aceita sites em domínio próprio (não aceita `*.github.io`). Um domínio `.com.br` custa cerca de R$ 40 por ano no Registro.br.

1. Compre o domínio (ex.: `cryptoradar.com.br`) no [Registro.br](https://registro.br) ou outro registrador.
2. No painel de DNS do domínio, crie:
   - quatro registros **A** para `@` apontando para `185.199.108.153`, `185.199.109.153`, `185.199.110.153` e `185.199.111.153`;
   - um registro **CNAME** para `www` apontando para `paixaojeferson76-ops.github.io`.
3. No GitHub: **Settings → Pages → Custom domain**, digite o domínio e salve. Quando o certificado ficar pronto, marque **Enforce HTTPS**.
4. Atualize a variável: `gh variable set SITE_URL --body "https://cryptoradar.com.br"` (sem barra no final e sem `/cryptoradar-brasil`).
5. Rode o deploy. Todos os links, sitemap, RSS e canonical passam a usar o domínio novo.
6. No Search Console, adicione a nova propriedade e reenvie o sitemap (veja GOOGLE_SEARCH_CONSOLE.md).

Dica: verifique o domínio na sua conta do GitHub (**Settings → Pages → Verified domains**) para evitar que outra pessoa o use em outro repositório.

## Migrar para Cloudflare Pages (opcional)

1. Crie uma conta em https://dash.cloudflare.com e vá em **Workers & Pages → Create → Pages → Connect to Git**.
2. Escolha o repositório, comando de build `npm run build`, pasta `dist`, variável `NODE_VERSION=24` e as mesmas variáveis `SITE_URL`/`PUBLIC_*`.
3. O arquivo `public/_headers` já traz cabeçalhos de segurança que o Cloudflare aplica automaticamente.
4. Desative o workflow `deploy.yml` (ou apague-o) para não publicar em dois lugares.
