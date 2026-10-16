---
title: "Ethereum agenda ativação da atualização Glamsterdam na rede de testes Hoodi para 26 de outubro"
description: "Após implementação na Sepolia, a atualização Glamsterdam do Ethereum será ativada na testnet Hoodi em 26 de outubro de 2026, trazendo ePBS e listas de acesso a nível de bloco."
seoTitle: "Ethereum agenda atualização Glamsterdam na testnet Hoodi"
seoDescription: "Atualização Glamsterdam do Ethereum chegará à testnet Hoodi em 26 de outubro com ePBS e novas regras de gás."
pubDate: 2026-10-16T18:45:13-03:00
author: redacao
category: ethereum
tags: ["ethereum", "glamsterdam", "testnet hoodi", "desenvolvimento", "hard fork"]
type: noticia
image: "/images/noticias/ethereum-agenda-ativacao-da-atualizacao-glamsterdam-na-rede-de-testes-hoodi.webp"
imageAlt: "Imagem ilustrativa: Laptop Keyboard"
imageCredit: "Imagem por One Idea LLC (CC0), via Stocksnap"
imageSource: "https://stocksnap.io/photo/laptop-keyboard-QGU10TMNPE"
imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
sources:
  - title: "Glamsterdam Hoodi Testnet Announcement"
    url: "https://blog.ethereum.org/en/2026/10/16/glamsterdam-hoodi-announcement"
    publisher: "Ethereum Foundation Blog"
    accessed: 2026-10-16
draft: false
generatedBy: "gemini:gemini-3.8-flash"
reviewed: true
---
A Fundação Ethereum anunciou que a atualização de rede Glamsterdam está agendada para ser ativada na rede de testes (testnet) Hoodi no dia 26 de outubro de 2026, às 14h42min48s no horário de Brasília (17:42:48 UTC). O procedimento ocorrerá na época 132.352, no slot 4.235.264. O anúncio oficial foi feito pela organização em 16 de outubro de 2026, após a implementação prévia da melhoria na rede de testes Sepolia, registrada em [atualização da testnet Sepolia](/noticias/ethereum-glamsterdam-testnet-sepolia).

Segundo os desenvolvedores, o limite de gás (gas limit) da Hoodi será ampliado para 200 milhões na mesma época de ativação. A fundação esclareceu que a data definitiva para a liberação da Glamsterdam na rede principal (mainnet) do [Ethereum](/noticias/o-que-e-ethereum) ainda não foi decidida.

## Separação entre proponentes e construtores de blocos

A Glamsterdam reúne duas frentes de desenvolvimento: a atualização da camada de execução (chamada Amsterdam) e a da camada de consenso (Gloas). Entre os principais pilares técnicos está a proposta EIP-7732, que implementa no próprio protocolo a separação entre proponentes e construtores de blocos (conhecida como ePBS, sigla em inglês para *enshrined proposer-builder separation*).

Com essa estrutura, o proponente inclui o compromisso de um construtor com a carga de execução, e o construtor revela essa carga em seguida. O próprio protocolo assume o processamento do pagamento ao proponente, reduzindo a necessidade de intermediários externos de confiança. O mecanismo também divide a validação de consenso da validação de execução, permitindo que os validadores disponham de mais tempo para analisar os blocos. Um comitê de pontualidade passa a atestar se a carga e os dados vinculados foram publicados dentro do prazo.

## Listas de acesso e mudanças nas taxas de gás

Outro componente central é a EIP-7928, que institui listas de acesso a nível de bloco (BALs). Essas listas registram as contas e posições de armazenamento consultadas durante um bloco, além das alterações de estado posteriores às transações. De acordo com a documentação oficial, a mudança permite que os clientes executem leituras em disco e validações em paralelo, acelerando o cálculo das raízes de estado na [blockchain](/noticias/o-que-e-blockchain).

O pacote também altera a contabilização do gás. A proposta EIP-8037 eleva e separa a tarifação para criação de novos estados, enquanto a EIP-8038 ajusta os custos de acesso a estados existentes. O upgrade inclui ainda registros de transferências de ETH, aumento do tamanho máximo de contratos inteligentes, novas instruções de manipulação de pilha e regras que impedem validadores penalizados (*slashed*) de propor blocos. Operadores de nós devem atualizar seus clientes de consenso e de execução antes do evento.
