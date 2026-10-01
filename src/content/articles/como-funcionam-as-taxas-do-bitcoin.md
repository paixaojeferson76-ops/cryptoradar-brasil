---
title: "Como funcionam as taxas do Bitcoin e como pagar menos"
description: "A taxa de uma transação de Bitcoin depende do tamanho dela em bytes e da disputa por espaço no próximo bloco, não do valor enviado. Veja como calcular e economizar."
seoTitle: "Taxas do Bitcoin: como funcionam e como pagar menos"
seoDescription: "Entenda sat/vB, mempool, por que a taxa não depende do valor enviado e dicas como SegWit, RBF e consolidação para pagar menos."
pubDate: 2026-09-30T12:00:00-03:00
author: redacao
generatedBy: "ia"
reviewed: false
category: bitcoin
tags: ["Bitcoin", "taxas", "tecnologia", "mercado"]
type: guia
image: "/images/noticias/como-funcionam-as-taxas-do-bitcoin.webp"
imageAlt: "Moeda de bitcoin dourada refletida sobre uma tela com cotações"
imageCredit: "Imagem (CC0), via Rawpixel"
imageSource: "https://www.rawpixel.com/image/5922925/free-public-domain-cc0-photo"
imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
sources:
  - title: "Bitcoin Developer Guide: Transaction fees and change"
    url: "https://developer.bitcoin.org/devguide/transactions.html#transaction-fees-and-change"
    publisher: "developer.bitcoin.org"
  - title: "Replace-by-fee (RBF)"
    url: "https://bitcoinops.org/en/topics/replace-by-fee/"
    publisher: "Bitcoin Optech"
  - title: "Child pays for parent (CPFP)"
    url: "https://bitcoinops.org/en/topics/cpfp/"
    publisher: "Bitcoin Optech"
  - title: "mempool.space — explorador e estimativa de taxas"
    url: "https://mempool.space/"
    publisher: "mempool.space"
---

**No Bitcoin, a taxa não depende de quanto dinheiro você envia, e sim de quanto espaço a transação ocupa no bloco e de quantas outras pessoas querem entrar no mesmo bloco.** Enviar R$ 50 ou R$ 5 milhões pode custar exatamente a mesma taxa.

## Por que existe taxa

Cada bloco tem espaço limitado. Quando há mais transações esperando do que cabe no próximo bloco, os mineradores priorizam as que pagam mais por espaço ocupado. A taxa funciona como um leilão: quem paga mais tende a ser confirmado antes. Além disso, as taxas são parte da remuneração dos mineradores, algo que ganha importância a cada [halving](/noticias/o-que-e-halving).

## A unidade: sat/vB

A taxa costuma ser expressa em **satoshis por byte virtual (sat/vB)**:

- **satoshi (sat):** a menor fração do bitcoin, 0,00000001 BTC;
- **byte virtual (vB):** medida do tamanho da transação que dá desconto para os dados de assinatura desde a atualização SegWit, de 2017.

**Taxa total = tamanho da transação (vB) × taxa (sat/vB)**

Exemplo: uma transação comum de cerca de 140 vB, com taxa de 5 sat/vB, paga 700 sats.

## O que deixa uma transação "maior"

O tamanho depende principalmente da quantidade de **entradas** e **saídas**. Se você recebeu muitos pagamentos pequenos, a carteira pode precisar juntar várias entradas para montar um envio, e a transação fica maior (e mais cara).

## A mempool: a sala de espera

Transações ainda não confirmadas ficam na **mempool**. Sites como o mempool.space mostram quanto se está pagando naquele momento para entrar no próximo bloco, em meia hora ou em algumas horas. A faixa de mercado no topo deste site exibe a taxa sugerida para cerca de 30 minutos.

Em dias calmos, taxas de 1 a 5 sat/vB costumam bastar. Em momentos de euforia, elas podem subir muito em poucas horas.

## Como pagar menos

1. **Use endereços modernos** (que começam com `bc1`). Formatos SegWit e Taproot ocupam menos espaço.
2. **Não tenha pressa quando não precisar.** Escolher uma confirmação mais lenta reduz a taxa.
3. **Consolide moedas pequenas em horários calmos.** Juntar várias entradas em uma só quando a taxa está baixa evita transações grandes em horários caros.
4. **Agrupe pagamentos.** Enviar para vários destinatários em uma única transação sai mais barato do que várias transações.
5. **Considere a Lightning Network** para pagamentos pequenos e frequentes. Veja [O que é Lightning Network](/noticias/o-que-e-lightning-network).

## Minha transação travou. E agora?

Se a taxa escolhida ficou baixa demais, existem duas saídas técnicas, dependendo da carteira:

- **RBF (Replace-by-Fee):** substitui a transação por outra igual, com taxa maior.
- **CPFP (Child Pays for Parent):** o destinatário (ou você, pelo troco) gasta a saída ainda não confirmada com uma taxa alta, o que incentiva o minerador a incluir as duas juntas.

Se nada for feito, a transação pode ser confirmada quando a demanda cair, ou acabar descartada da mempool, e os fundos voltam a ficar disponíveis na carteira de origem.

## Resumo

Taxa no Bitcoin é preço por espaço, cobrado em sat/vB. Endereços modernos, paciência e boa organização das moedas na carteira são as formas mais simples de pagar menos.
