---
title: "Como funciona a mineração de Bitcoin: máquinas, pools, dificuldade e energia"
description: "Mineradores protegem a rede Bitcoin e recebem novas moedas em troca. Entenda prova de trabalho, ASICs, pools, ajuste de dificuldade, hashrate e o debate sobre energia."
seoTitle: "Mineração de Bitcoin: como funciona e quanto custa"
seoDescription: "Guia sobre mineração de Bitcoin: prova de trabalho, ASICs, pools, hashrate, ajuste de dificuldade, custos de energia e riscos."
pubDate: 2026-09-30T13:20:00-03:00
author: redacao
generatedBy: "ia"
reviewed: false
category: mineracao
tags: ["mineração", "Bitcoin", "energia", "tecnologia"]
type: guia
sources:
  - title: "Bitcoin: A Peer-to-Peer Electronic Cash System (whitepaper)"
    url: "https://bitcoin.org/bitcoin.pdf"
    publisher: "bitcoin.org"
  - title: "Bitcoin Developer Guide: Mining"
    url: "https://developer.bitcoin.org/devguide/mining.html"
    publisher: "developer.bitcoin.org"
  - title: "Cambridge Digital Mining Industry Report / Cambridge Bitcoin Electricity Consumption Index"
    url: "https://ccaf.io/cbnsi/cbeci"
    publisher: "Cambridge Centre for Alternative Finance"
  - title: "Hashrate e dificuldade da rede"
    url: "https://mempool.space/graphs/mining/hashrate-difficulty"
    publisher: "mempool.space"
---

**Minerar Bitcoin é usar poder computacional para validar blocos de transações e, em troca, receber bitcoins novos mais as taxas pagas pelos usuários.** Os mineradores são o que torna o histórico da rede caro de falsificar.

## O trabalho do minerador

1. Juntar transações da mempool em um bloco candidato.
2. Calcular o hash SHA-256 do cabeçalho do bloco trocando um número chamado *nonce* até encontrar um resultado abaixo do alvo da rede.
3. Divulgar o bloco encontrado para que os nós o validem.

Encontrar um hash válido é questão de tentativa e erro, como uma loteria em que cada tentativa é um bilhete. Quanto mais tentativas por segundo, maior a chance de ganhar. Essa medida de tentativas é o **hashrate**. A rede toda soma centenas de exahashes por segundo (1 exahash equivale a 10¹⁸ tentativas).

## Ajuste de dificuldade

A cada 2.016 blocos, cerca de duas semanas, o protocolo recalcula a dificuldade para que os blocos continuem saindo em média a cada 10 minutos:

- se mais máquinas entram e os blocos saem rápido demais, a dificuldade sobe;
- se máquinas desligam, a dificuldade cai.

Esse mecanismo é o que mantém o cronograma de emissão previsível, inclusive depois de cada [halving](/noticias/o-que-e-halving).

## Máquinas: dos PCs aos ASICs

Nos primeiros anos, dava para minerar com o processador de um computador comum. Depois vieram as placas de vídeo e, a partir de 2013, os **ASICs**: equipamentos fabricados só para calcular SHA-256. Hoje, minerar Bitcoin com computador ou celular comum não gera retorno. Aplicativos que prometem isso costumam ser golpes.

## Pools de mineração

Como a chance de um minerador pequeno encontrar um bloco sozinho é mínima, a maioria participa de **pools**: grupos que somam hashrate e dividem as recompensas proporcionalmente ao trabalho de cada um. Isso torna a renda mais previsível. A concentração de hashrate em poucos pools é um tema acompanhado de perto pela comunidade.

## A conta da mineração

A receita depende de:

- recompensa por bloco (hoje 3,125 BTC) mais as taxas;
- preço do bitcoin;
- participação do minerador no hashrate total.

Os custos principais são **energia elétrica**, preço das máquinas, refrigeração e manutenção. O custo da energia é decisivo, por isso mineradores buscam regiões com eletricidade barata ou sobras de geração.

## Energia e meio ambiente

A mineração consome muita eletricidade, e esse é um dos principais pontos de crítica ao Bitcoin. O Centro de Finanças Alternativas da Universidade de Cambridge mantém um índice público que estima esse consumo. Defensores argumentam que parte relevante da mineração usa fontes renováveis ou energia que seria desperdiçada e que as máquinas podem ser desligadas rapidamente para aliviar a rede elétrica. O debate continua, e os números variam conforme a metodologia.

## Vale a pena minerar em casa no Brasil?

Para a maioria das pessoas, não. Com a tarifa residencial de energia no Brasil, o custo por máquina costuma superar a receita, e ainda há barulho, calor e a desvalorização rápida dos equipamentos. Quem considerar o assunto deve fazer as contas com a tarifa real, o preço da máquina e cenários de queda do bitcoin.

## Resumo

A mineração transforma energia em segurança para a rede Bitcoin. É um setor industrial, dominado por equipamentos especializados e energia barata, em que a dificuldade se ajusta sozinha para manter o ritmo de um bloco a cada 10 minutos.
