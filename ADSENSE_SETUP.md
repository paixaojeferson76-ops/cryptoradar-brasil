# Google AdSense

O site já está preparado: componente `Advertisement`, espaços na home, no artigo (depois do texto), na lateral do artigo (desktop) e na listagem de notícias, `ads.txt` gerado automaticamente, aviso de cookies com Consent Mode e política de privacidade com o texto exigido pelo Google.

Enquanto `PUBLIC_ADSENSE_CLIENT` estiver vazio, **nenhum script do Google é carregado** e nenhum espaço vazio aparece.

## Antes de pedir aprovação

O AdSense costuma exigir:

1. **Domínio próprio.** Sites em `*.github.io` não podem ser adicionados. Veja "Domínio próprio" em DEPLOY.md.
2. **Conteúdo original e suficiente.** O site já tem guias e notícias; continue publicando com regularidade. Revise os textos gerados com IA: o Google penaliza conteúdo em massa sem valor.
3. **Páginas obrigatórias:** Sobre, Contato, Política de Privacidade (já existem). Configure `PUBLIC_CONTACT_EMAIL` para ter um contato direto.
4. **Idade mínima de 18 anos** do titular da conta.

Nunca clique nos próprios anúncios, não peça cliques e não compre tráfego: isso leva a bloqueio da conta.

## Passo a passo

1. Acesse https://adsense.google.com e clique em **Começar**. Use a conta Google que vai receber os pagamentos.
2. Informe o endereço do site (o domínio próprio) e os dados de pagamento/país.
3. O painel mostra o **código do AdSense** com `ca-pub-` seguido de 16 dígitos. Esse é o **ID do editor**. Ele também aparece em **Conta → Informações da conta**.
4. Salve no GitHub (é público, vai no HTML):
   ```bash
   gh variable set PUBLIC_ADSENSE_CLIENT --body "ca-pub-0000000000000000"
   ```
5. Rode o deploy (**Actions → Deploy → Run workflow**). O site passa a:
   - carregar o script oficial `adsbygoogle.js?client=ca-pub-...` em todas as páginas;
   - publicar `/ads.txt` com `google.com, pub-..., DIRECT, f08c47fec0942fa0`;
   - mostrar o aviso de cookies.
6. No AdSense, escolha **verificação por snippet de código** (já instalado) e clique em **Verificar** e depois em **Solicitar revisão**. A análise leva de alguns dias a algumas semanas.

### Sobre o ads.txt

O Google procura o `ads.txt` na **raiz do domínio** (`https://seudominio.com.br/ads.txt`). Com domínio próprio apontado para este site, ele já fica no lugar certo.

## Depois da aprovação: blocos de anúncio

Opção A, mais simples: em **Anúncios → Por site → Anúncios automáticos**, ative e deixe o Google posicionar.

Opção B, espaços do site: em **Anúncios → Por bloco de anúncios → Anúncio de display**, crie três blocos responsivos (ex.: "home", "artigo", "lateral"). Cada bloco tem um `data-ad-slot` numérico. Salve:

```bash
gh variable set PUBLIC_ADSENSE_SLOT_HOME --body "1234567890"
gh variable set PUBLIC_ADSENSE_SLOT_ARTICLE --body "1234567891"
gh variable set PUBLIC_ADSENSE_SLOT_SIDEBAR --body "1234567892"
```

E rode o deploy. Os espaços que não tiverem ID continuam ocultos.

## Consentimento (LGPD)

- O aviso de cookies só aparece quando AdSense ou Analytics estão ativos.
- Sem aceite, o Google Consent Mode fica como "negado": os anúncios aparecem, mas não personalizados.
- Para visitantes da Europa/Reino Unido, o Google exige uma plataforma de consentimento certificada. Se o público de lá crescer, ative a mensagem de consentimento do próprio AdSense em **Privacidade e mensagens**.

## Onde está o código

- `src/components/Advertisement.astro`: bloco de anúncio.
- `src/layouts/BaseLayout.astro`: script do AdSense e Consent Mode.
- `src/components/Consent.astro`: aviso de cookies.
- `src/pages/ads.txt.ts`: `ads.txt`.
