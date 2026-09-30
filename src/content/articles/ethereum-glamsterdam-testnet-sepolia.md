---
title: "Atualização Glamsterdam do Ethereum será ativada na testnet Sepolia em 6 de outubro"
description: "Fundação Ethereum marcou a ativação da Glamsterdam na rede de testes Sepolia. A atualização traz separação entre proponentes e construtores de blocos e listas de acesso por bloco; data na rede principal ainda não foi definida."
seoTitle: "Glamsterdam: Ethereum marca testnet Sepolia para 6/10"
seoDescription: "Ethereum ativa a atualização Glamsterdam na testnet Sepolia em 6 de outubro de 2026, com ePBS, listas de acesso por bloco e novos custos de gás."
pubDate: 2026-09-30T19:40:00-03:00
author: redacao
generatedBy: "ia"
reviewed: false
category: ethereum
tags: ["Ethereum", "tecnologia", "atualização", "escalabilidade"]
type: noticia
sources:
  - title: "Glamsterdam Testnet Announcement"
    url: "https://blog.ethereum.org/en/2026/09/17/glamsterdam-testnet-announcement"
    publisher: "Ethereum Foundation Blog"
    accessed: 2026-09-30
  - title: "EIP-7732: Enshrined Proposer-Builder Separation"
    url: "https://eips.ethereum.org/EIPS/eip-7732"
    publisher: "Ethereum Improvement Proposals"
  - title: "EIP-7928: Block-Level Access Lists"
    url: "https://eips.ethereum.org/EIPS/eip-7928"
    publisher: "Ethereum Improvement Proposals"
---

A próxima grande atualização do [Ethereum](/noticias/o-que-e-ethereum), chamada **Glamsterdam**, será ativada na rede de testes **Sepolia** em **6 de outubro de 2026, às 13h53 UTC (10h53 no horário de Brasília)**, segundo anúncio publicado no blog da Fundação Ethereum. A data para a rede principal ainda **não foi definida**, assim como a da outra rede de testes, a Hoodi.

## O que é a Glamsterdam

O nome junta duas atualizações: **Amsterdam**, na camada de execução (onde rodam as transações e os contratos), e **Gloas**, na camada de consenso (onde os validadores concordam sobre os blocos). A Glamsterdam vem depois da atualização Fusaka e, segundo a fundação, avança o plano de ampliar a capacidade da rede principal.

## As duas mudanças principais

### Separação entre proponentes e construtores (ePBS)

Hoje, a montagem dos blocos do Ethereum costuma ser feita por "construtores" especializados, que negociam com os validadores por meio de softwares intermediários. A proposta **EIP-7732** leva essa separação para dentro do próprio protocolo: o validador inclui um compromisso do construtor, que depois revela o conteúdo do bloco, e o pagamento é feito pelo protocolo. De acordo com a fundação, isso reduz a dependência de intermediários de confiança e dá aos validadores mais tempo para verificar a execução.

### Listas de acesso por bloco (BALs)

A **EIP-7928** passa a registrar, em cada bloco, quais contas e posições de armazenamento foram acessadas e as mudanças de estado. Com isso, os programas que rodam os nós podem ler dados e validar transações **em paralelo**, o que ajuda a processar blocos maiores sem tornar inviável manter um nó.

## Mudanças no gás

A Glamsterdam também ajusta o cálculo de [gás](/noticias/o-que-e-ethereum) para refletir melhor o uso de recursos. Criar novos dados de estado na rede fica mais caro (EIP-8037), e os custos de acesso a dados são revistos (EIP-8038). A fundação recomenda que desenvolvedores testem seus contratos: códigos que dependem de valores fixos de gás podem precisar de ajustes.

Outras novidades listadas incluem registro (*log*) automático de transferências de ETH, aumento do tamanho máximo de contratos e regras que impedem validadores punidos de propor blocos.

## O que muda para o usuário comum

Por enquanto, nada. A ativação de 6 de outubro acontece apenas em uma rede de testes, usada por desenvolvedores e operadores de nós. Quem apenas guarda ou usa ETH não precisa fazer nada. Operadores de nós na Sepolia precisam atualizar os clientes de execução e de consenso antes da ativação, segundo o anúncio.

Como em atualizações anteriores, a data na rede principal só deve ser marcada depois que os testes forem concluídos sem problemas. Para entender o contexto de escalabilidade, veja também [O que é blockchain](/noticias/o-que-e-blockchain).
