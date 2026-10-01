---
title: "Como funciona o Bitcoin: transações, blocos e mineração passo a passo"
description: "Do clique em enviar até a confirmação na blockchain: veja o caminho de uma transação de Bitcoin, o papel das chaves, dos nós e dos mineradores."
seoTitle: "Como funciona o Bitcoin: transações, blocos e mineração"
seoDescription: "Entenda passo a passo como funciona o Bitcoin: chaves, endereços, mempool, blocos, prova de trabalho e confirmações."
pubDate: 2026-09-30T08:40:00-03:00
author: redacao
generatedBy: "ia"
reviewed: false
category: bitcoin
tags: ["Bitcoin", "tecnologia", "mineração", "iniciantes"]
type: guia
image: "/images/noticias/como-funciona-o-bitcoin.webp"
imageAlt: "Moedas de bitcoin prateadas sobre grânulos pretos"
imageCredit: "Imagem (CC0), via Rawpixel"
imageSource: "https://www.rawpixel.com/image/5974412/bitcoin-free-public-domain-cc0-image"
imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
featured: true
sources:
  - title: "Bitcoin: A Peer-to-Peer Electronic Cash System (whitepaper)"
    url: "https://bitcoin.org/bitcoin.pdf"
    publisher: "bitcoin.org"
  - title: "Bitcoin Developer Guide: Transactions"
    url: "https://developer.bitcoin.org/devguide/transactions.html"
    publisher: "developer.bitcoin.org"
  - title: "Bitcoin Developer Guide: Block Chain"
    url: "https://developer.bitcoin.org/devguide/block_chain.html"
    publisher: "developer.bitcoin.org"
---

**O Bitcoin funciona como um grande livro-razão público, copiado em milhares de computadores, em que só entra uma nova página (um bloco) depois que alguém prova ter feito um trabalho computacional caro.** Esse desenho permite que desconhecidos concordem sobre quem tem quanto, sem precisar confiar uns nos outros.

Para entender o mecanismo, vale seguir o caminho de uma transação do começo ao fim.

## 1. Chaves e endereços: quem pode gastar

Cada carteira de Bitcoin guarda um par de chaves criptográficas:

- **Chave privada:** um número secreto que funciona como a assinatura do dono. Quem tem a chave privada pode gastar as moedas.
- **Chave pública:** derivada da privada, permite que qualquer um confira a assinatura sem descobrir o segredo.

O **endereço** que você passa para receber pagamentos é gerado a partir da chave pública. Por isso é seguro compartilhá-lo, mas nunca a chave privada ou a frase de recuperação. Veja [O que é autocustódia](/noticias/o-que-e-autocustodia).

## 2. A transação: gastar saídas antigas, criar saídas novas

O Bitcoin não trabalha com "saldos" como uma conta bancária. Ele usa o modelo de **saídas não gastas** (UTXO, na sigla em inglês). Cada vez que você recebe bitcoins, surge uma saída associada ao seu endereço. Para pagar alguém, a carteira:

1. escolhe saídas suas que somem pelo menos o valor desejado;
2. cria uma saída para o destinatário e, se sobrar, uma saída de **troco** de volta para você;
3. assina tudo com a chave privada.

A diferença entre o que entra e o que sai na transação é a **taxa** paga ao minerador. Entenda como ela é calculada em [Como funcionam as taxas do Bitcoin](/noticias/como-funcionam-as-taxas-do-bitcoin).

## 3. A rede: nós conferem e espalham

A transação assinada é enviada para os **nós** da rede, computadores que rodam o software do Bitcoin e guardam uma cópia da blockchain. Cada nó confere, por conta própria, se:

- as assinaturas são válidas;
- as saídas usadas existem e ainda não foram gastas;
- a transação segue as regras do protocolo.

Se estiver tudo certo, a transação vai para a **mempool**, a fila de transações que aguardam confirmação, e é repassada aos outros nós.

## 4. O bloco: mineradores competem

Mineradores escolhem transações da mempool, normalmente as que pagam mais taxa por espaço, e montam um bloco candidato. Para que o bloco seja aceito, eles precisam encontrar um número (o *nonce*) que, combinado aos dados do bloco e passado pela função SHA-256, gere um resultado abaixo de um alvo definido pela rede.

Não existe atalho: a única forma é testar trilhões de possibilidades. Esse é o **proof of work**, ou prova de trabalho. O primeiro minerador que encontra uma solução divulga o bloco, e os nós conferem se ele é válido. Detalhes em [Como funciona a mineração de Bitcoin](/noticias/como-funciona-a-mineracao-de-bitcoin).

## 5. A corrente: por que é difícil falsificar

Cada bloco carrega o hash do bloco anterior. Alterar uma transação antiga mudaria o hash daquele bloco e quebraria a ligação com todos os seguintes. Um fraudador teria de refazer a prova de trabalho de todos esses blocos, mais rápido do que o resto da rede somada, o que exige um poder computacional enorme.

## 6. Confirmações: quando considerar o pagamento concluído

Quando sua transação entra em um bloco, ela tem **1 confirmação**. Cada novo bloco em cima dele soma mais uma. Quanto mais confirmações, mais improvável é reverter a transação. Para valores altos, muitas empresas esperam algo como 3 a 6 confirmações, o que leva cerca de 30 a 60 minutos.

## As regras que ninguém muda sozinho

- Um bloco novo surge, em média, a cada 10 minutos.
- A cada 2.016 blocos (cerca de duas semanas), a **dificuldade** é ajustada para manter esse ritmo, mesmo que entrem ou saiam mineradores.
- A recompensa por bloco cai pela metade a cada 210 mil blocos: o [halving](/noticias/o-que-e-halving).
- A oferta total nunca passa de 21 milhões de bitcoins.

Mudar essas regras exigiria que a maior parte dos usuários, nós e mineradores adotasse um software diferente, algo muito difícil de impor.

## Resumo

Chaves provam a posse, nós conferem as regras, mineradores ordenam as transações em blocos e a prova de trabalho torna o histórico caro de falsificar. Juntas, essas peças fazem o Bitcoin funcionar sem uma autoridade central.
