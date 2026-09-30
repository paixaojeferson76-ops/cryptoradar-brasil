# Chaves e variáveis

Nenhuma chave é obrigatória para o site funcionar. Elas ativam recursos extras.

| Variável | Onde fica | Obrigatória? | Para quê |
| --- | --- | --- | --- |
| `SITE_URL` | Variable | já configurada | Endereço público (muda ao usar domínio próprio) |
| `AI_API_KEY` | **Secret** | não | Gerar notícias automaticamente |
| `AI_PROVIDER` | Variable | não | `gemini` (padrão) ou `openai-compatible` |
| `AI_MODEL` | Variable | não | Vazio = escolhe o modelo "flash" mais novo do Gemini |
| `AI_BASE_URL` | Variable | só p/ `openai-compatible` | Ex.: `https://api.groq.com/openai/v1` |
| `AUTO_PUBLISH` | Variable | não | `true` publica sozinho pautas de confiança alta. Padrão: revisão por PR |
| `CRYPTO_API_KEY` | **Secret** | não | Chave Demo da CoinGecko (só se o limite público não bastar) |
| `PUBLIC_GA_ID` | Variable | não | Google Analytics (veja GOOGLE_SEARCH_CONSOLE.md) |
| `PUBLIC_ADSENSE_CLIENT` e `PUBLIC_ADSENSE_SLOT_*` | Variable | não | AdSense (veja ADSENSE_SETUP.md) |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Variable | não | Verificação do Search Console por meta tag |
| `PUBLIC_CONTACT_EMAIL` | Variable | não | E-mail exibido em /contato (sem ele, o contato é por chamado no GitHub) |

- **Local:** copie `.env.example` para `.env` e preencha. O `.env` nunca vai para o Git.
- **GitHub:** Settings → Secrets and variables → Actions. Ou pelo terminal: `gh secret set AI_API_KEY` (ele pede o valor sem mostrar na tela) e `gh variable set NOME --body "valor"`.

## IA gratuita: Google Gemini (recomendado)

O Google AI Studio tem nível gratuito com limite diário de requisições, suficiente para algumas notícias a cada 6 horas. Não pede cartão.

1. Acesse https://aistudio.google.com/apikey e entre com sua conta Google.
2. Aceite os termos e clique em **Create API key** (pode criar em um projeto novo).
3. Copie a chave (começa com `AIza`).
4. Guarde no GitHub: `gh secret set AI_API_KEY --repo paixaojeferson76-ops/cryptoradar-brasil` e cole quando pedir.
5. Teste: **Actions → Notícias automáticas → Run workflow**.

Observação: no nível gratuito, o Google pode usar os dados enviados para melhorar seus produtos. Enviamos apenas títulos e resumos públicos de notícias, nada pessoal.

## Alternativa: API compatível com OpenAI

Serviços como Groq ou OpenRouter têm modelos com uso gratuito limitado. Configure:

```
AI_PROVIDER=openai-compatible
AI_BASE_URL=https://api.groq.com/openai/v1
AI_MODEL=<nome do modelo no provedor>
AI_API_KEY=<sua chave>
```

## CoinGecko

Sem chave, o site usa o endpoint público (limite baixo, suficiente para o build a cada 6 horas). A atribuição "Dados: CoinGecko" já aparece no site, como exigem os termos. Se precisar de mais: crie a chave **Demo** gratuita em https://www.coingecko.com/en/api/pricing e salve em `CRYPTO_API_KEY`.

## Fontes de mercado usadas

| Dado | Fonte | Chave | Uso comercial |
| --- | --- | --- | --- |
| Preços e variação | CoinGecko API pública | não | sim, com atribuição |
| Taxas da rede Bitcoin | mempool.space API | não | sim |
| Índice de medo e ganância | alternative.me | não | sim, com atribuição da fonte |
