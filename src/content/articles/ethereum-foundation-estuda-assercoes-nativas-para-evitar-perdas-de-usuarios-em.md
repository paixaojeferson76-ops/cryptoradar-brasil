---
title: "Ethereum Foundation estuda 'asserções nativas' para evitar perdas de usuários em transações"
description: "A Fundação Ethereum apresentou uma proposta de asserções de transação nativas para combater falhas de segurança e assinaturas cegas que geram prejuízos milionários."
seoTitle: "Ethereum estuda asserções nativas contra perdas de usuários"
seoDescription: "Ethereum Foundation propõe asserções de transação nativas e a EIP-7906 para evitar prejuízos por assinaturas cegas e falhas de execução."
pubDate: 2026-10-05T22:01:51-03:00
author: redacao
category: ethereum
tags: ["ethereum", "segurança", "smart contracts", "eip-7906"]
type: noticia
image: "/images/noticias/ethereum-foundation-estuda-assercoes-nativas-para-evitar-perdas-de-usuarios-em.webp"
imageAlt: "Imagem ilustrativa: NFT diagram"
imageCredit: "Imagem por CactiStaccingCrane (CC0), via Wikimedia Commons"
imageSource: "https://commons.wikimedia.org/w/index.php?curid=117503004"
imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en/"
sources:
  - title: "How native transaction assertions could enforce a transaction's final outcome"
    url: "https://blog.ethereum.org/en/2026/10/05/transaction-assertions"
    publisher: "Ethereum Foundation Blog"
    accessed: 2026-10-06
draft: false
generatedBy: "gemini:gemini-3.5-flash"
reviewed: true
---
A Fundação Ethereum (Ethereum Foundation) revelou, em publicação realizada em 5 de outubro de 2026, que está explorando o conceito de "asserções de transação nativas" (native transaction assertions) para proteger usuários contra perdas financeiras. A iniciativa faz parte do projeto "Trillion Dollar Security" e busca enfrentar os riscos da "assinatura cega" (blind signing) e da incerteza no resultado das transações, oferecendo uma camada extra de segurança além do chamado "Clear Signing".

## O problema das assinaturas e a incerteza de execução
Atualmente, a rede [Ethereum](/noticias/o-que-e-ethereum) funciona executando exatamente o que o usuário autoriza, sem avaliar se o resultado final corresponde à intenção econômica de quem assinou. De acordo com a Fundação Ethereum, uma assinatura digital valida uma solicitação (alvo, valor e dados de chamada), mas o desfecho real depende do estado da rede e do código do contrato inteligente no momento exato da execução, que podem mudar após a assinatura.

Atualmente, a blockchain não possui um mecanismo geral para que o código na rede (on-chain) inspecione o conjunto completo de mudanças de estado e eventos gerados por uma transação. Isso expõe os usuários a dois tipos principais de falhas: a incompatibilidade de intenção e a incompatibilidade de resultado.

## Casos de incompatibilidade de intenção e resultado
A incompatibilidade de intenção ocorre quando uma interface de usuário (frontend) comprometida apresenta uma solicitação de assinatura diferente do que o usuário acredita estar aprovando. A Fundação Ethereum cita como exemplos o incidente da Bybit, no qual os signatários autorizaram a substituição do contrato de implementação de uma carteira Safe, e o ataque à BadgerDAO, onde os usuários concederam permissão para que um invasor gastasse seus tokens. Esses incidentes são categorizados como [golpes com criptomoedas](/noticias/golpes-com-criptomoedas-como-se-proteger) decorrentes de vulnerabilidades de interface.

Já a incompatibilidade de resultado acontece quando o usuário aprova exatamente o que visualiza, mas as condições de mercado ou os limites da transação geram um desfecho prejudicial. Um exemplo detalhado pela fundação envolveu uma troca de colateral entre Aave e CoW. Um usuário tentou trocar cerca de US$ 50,4 milhões de aEthUSDT por aEthAAVE. Devido à baixa liquidez e a limites de taxa de gás que rejeitaram cotações complexas, restou apenas uma cotação que resultou no recebimento de apenas US$ 36.000 em tokens. Embora a interface tenha exibido um alerta de 99,9% de impacto no preço, o usuário assinou a transação e perdeu quase todo o valor.

## Proposta de solução com a EIP-7906
Para mitigar esses cenários, a Fundação Ethereum estuda a implementação de asserções de transação nativas. Essa tecnologia permitiria definir regras confiáveis sobre o estado resultante da transação, independentemente do criador da transação, sendo aplicadas diretamente durante a execução.

Uma das abordagens em análise é a Proposta de Melhoria do Ethereum EIP-7906 (Transaction Assertions via State Diff Opcode). Essa proposta visa introduzir um código de operação (opcode) que permite inspecionar a diferença de estado gerada, garantindo que a transação seja revertida caso o resultado final não atenda aos critérios de segurança definidos pelo usuário.
