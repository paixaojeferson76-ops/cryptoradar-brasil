---
title: "Vitalik Buterin defende proposta leanPCS para acelerar proteção quântica no Ethereum"
description: "Cofundador do Ethereum declarou apoio ao uso de leanPCS e agregação de provas na EIP-8288 para viabilizar criptografia pós-quântica sem sobrecarregar a rede."
seoTitle: "Vitalik apoia leanPCS contra ameaça quântica no Ethereum"
seoDescription: "Vitalik Buterin defendeu o leanPCS para acelerar a proteção do Ethereum contra computadores quânticos com agregação de provas criptográficas."
pubDate: 2026-11-17T05:30:50-03:00
author: redacao
category: ethereum
tags: ["vitalik buterin", "ethereum", "computação quântica", "criptografia", "eip-8288"]
type: noticia
image: "/images/noticias/vitalik-buterin-defende-proposta-leanpcs-para-acelerar-protecao-quantica-no.webp"
imageAlt: "Imagem ilustrativa: Lattice Quantum Chromodynamics (LQCD) cluster"
imageCredit: "Imagem por U.S. Department of Energy (CC0), via Rawpixel"
imageSource: "https://www.rawpixel.com/image/3325544/free-photo-image-server-network"
imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
sources:
  - title: "Vitalik Buterin flips to ‘total bull’ on a faster route to quantum-safe Ethereum"
    url: "https://coindesk.com/tech/2026/11/16/vitalik-buterin-flips-to-total-bull-on-a-faster-route-to-quantum-safe-ethereum"
    publisher: "CoinDesk"
    accessed: 2026-11-17
  - title: "Vitalik Buterin Now ‘a Total Bull’ on leanPCS as Fast Track to Quantum-Safe Ethereum"
    url: "https://decrypt.co/383294/vitalik-buterin-now-a-total-bull-on-leanpcs-as-fast-track-to-quantum-safe-ethereum"
    publisher: "Decrypt"
    accessed: 2026-11-17
draft: false
generatedBy: "gemini:gemini-3.8-flash"
reviewed: true
---
Vitalik Buterin, cofundador da rede [Ethereum](/noticias/o-que-e-ethereum), manifestou apoio nesta segunda-feira (16) ao uso do leanPCS para acelerar a proteção do protocolo contra o avanço dos computadores quânticos. De acordo com informações publicadas pelo CoinDesk e pelo Decrypt, Buterin afirmou que a proposta viabiliza a compactação de dados pesados antes do registro definitivo na [blockchain](/noticias/o-que-e-blockchain).

Segundo Buterin, computadores quânticos futuros terão capacidade de quebrar os algoritmos de curvas elípticas (ECDSA), que garantem a segurança das contas atuais do ecossistema cripto. Contudo, os modelos criptográficos resistentes a ataques quânticos exigem muito mais espaço: assinaturas digitais saltariam de 65 bytes para um intervalo entre 1 e 6 kilobytes, enquanto provas de conhecimento zero passariam de poucas centenas de bytes para aproximadamente 128 kilobytes. O desenvolvedor destacou que armazenar esse volume diretamente nos blocos é inviável para o funcionamento da rede.

## Agregação com a proposta EIP-8288

A saída detalhada por Buterin baseia-se na EIP-8288 (sigla em inglês para Proposta de Melhoria do Ethereum), rascunho desenvolvido em parceria com o pesquisador Thomas Coratger em junho. A iniciativa propõe a junção de múltiplas assinaturas e provas antes que elas cheguem à camada principal de execução.

De acordo com o Decrypt, o processo funciona por meio de nós da rede que agrupam as informações recebidas em uma única prova STARK — uma tecnologia matemática de validação sem exposição de dados sigilosos. Essas provas são combinadas de forma recursiva até gerarem uma única prova mestre para o bloco inteiro. Dessa maneira, apenas atestados resumidos são gravados na cadeia, dispensando o armazenamento dos dados completos de cada assinatura individual.

## A escolha pelo leanPCS frente a outras alternativas

Buterin comparou três caminhos técnicos possíveis para viabilizar essa estrutura. O primeiro, chamado leanSPHINCS, focaria em um formato único de assinatura baseada em hash, com baixo custo computacional (gás), mas sem flexibilidade para outras funções. No extremo oposto, a abordagem leanSTARK traria suporte amplo a contratos complexos e privacidade, porém exigiria definir uma nova linguagem de programação além da EVM (a Máquina Virtual do Ethereum), o que demandaria debates mais longos.

A alternativa intermediária, batizada de leanPCS, utiliza esquemas de compromisso polinomial (PCS) e se tornou a preferida de Buterin. Segundo o cofundador, esse modelo entrega a flexibilidade do leanSTARK com prazos de implementação menores, pois exige menos decisões de design no momento inicial.

Pesquisas recentes do fórum Ethereum Research indicam que uma assinatura pós-quântica otimizada consome cerca de 150.000 de gás para ser verificada atualmente, frente a 3.000 de gás gastos pelas assinaturas ECDSA convencionais, o que mantém a busca por agregação de provas como foco dos desenvolvedores.
