---
title: "O que é blockchain e como a tecnologia funciona na prática"
description: "Blockchain é um registro compartilhado em que os dados ficam em blocos encadeados e difíceis de alterar. Veja como funciona, tipos de rede e onde faz sentido usar."
seoTitle: "O que é blockchain: explicação simples e completa"
seoDescription: "Entenda o que é blockchain, como blocos e hashes funcionam, a diferença entre redes públicas e privadas e os limites da tecnologia."
pubDate: 2026-09-30T09:20:00-03:00
author: redacao
generatedBy: "ia"
reviewed: false
category: blockchain
tags: ["blockchain", "tecnologia", "iniciantes"]
type: guia
image: "/images/noticias/o-que-e-blockchain.webp"
imageAlt: "Símbolo do bitcoin em verde no centro de um circuito eletrônico"
imageCredit: "Imagem por edwinchuen (CC BY 2.0), via Wikimedia Commons"
imageSource: "https://commons.wikimedia.org/w/index.php?curid=122799664"
imageLicenseUrl: "https://creativecommons.org/licenses/by/2.0/"
sources:
  - title: "Bitcoin: A Peer-to-Peer Electronic Cash System (whitepaper)"
    url: "https://bitcoin.org/bitcoin.pdf"
    publisher: "bitcoin.org"
  - title: "Introduction to Ethereum: what is a blockchain?"
    url: "https://ethereum.org/en/developers/docs/intro-to-ethereum/"
    publisher: "ethereum.org"
  - title: "Blockchain Technology Overview (NISTIR 8202)"
    url: "https://nvlpubs.nist.gov/nistpubs/ir/2018/NIST.IR.8202.pdf"
    publisher: "NIST (National Institute of Standards and Technology)"
---

**Blockchain é um banco de dados compartilhado em que as informações são agrupadas em blocos, e cada bloco fica "amarrado" ao anterior por criptografia.** Como várias pessoas mantêm cópias do mesmo registro e seguem as mesmas regras para acrescentar dados, fica muito difícil alterar o histórico sem que todos percebam.

A tecnologia ganhou fama com o [Bitcoin](/noticias/o-que-e-bitcoin), em 2009, mas hoje é usada por centenas de redes diferentes.

## As peças de uma blockchain

### Blocos

Um bloco é um pacote de registros (em criptomoedas, transações) com um cabeçalho que inclui data, uma referência ao bloco anterior e um resumo de todo o conteúdo.

### Hash

O hash é uma "impressão digital" dos dados: uma função matemática transforma qualquer conteúdo em uma sequência de tamanho fixo. Se um único caractere mudar, o hash muda completamente. Como cada bloco guarda o hash do anterior, mexer em um bloco antigo quebra toda a sequência depois dele.

### Rede de nós

Os nós são os computadores que guardam cópias da blockchain e conferem se os novos blocos respeitam as regras. Em redes públicas, qualquer pessoa pode rodar um nó.

### Consenso

É o método que a rede usa para decidir qual bloco entra a seguir. Os dois mais conhecidos:

| Mecanismo | Como escolhe quem propõe o bloco | Exemplo |
| --- | --- | --- |
| Prova de trabalho (PoW) | Quem resolve primeiro um problema computacional caro | Bitcoin |
| Prova de participação (PoS) | Validadores sorteados entre quem deixou moedas em garantia (*stake*) | Ethereum |

## Tipos de blockchain

- **Públicas e sem permissão:** qualquer um pode ler, transacionar e participar da validação. Exemplos: Bitcoin e Ethereum.
- **Permissionadas (privadas ou de consórcio):** só participantes autorizados validam blocos. São usadas por empresas e instituições que querem um registro compartilhado, mas controlado.

## O que a blockchain faz bem

- **Registro difícil de adulterar:** o histórico fica auditável por qualquer participante.
- **Coordenação sem dono único:** várias partes que não confiam totalmente umas nas outras podem usar o mesmo registro.
- **Programabilidade:** redes como o [Ethereum](/noticias/o-que-e-ethereum) executam contratos inteligentes, programas que rodam exatamente como foram escritos.

## Limites e mitos

- **Não garante que o dado seja verdadeiro.** A blockchain garante que o registro não foi alterado depois, mas se alguém registrar uma informação falsa, ela ficará lá, imutável.
- **Não é sempre a melhor solução.** Se existe uma entidade confiável que já controla os dados, um banco de dados comum costuma ser mais barato e rápido.
- **Escalabilidade tem custo.** Redes públicas limitam o tamanho dos blocos para que mais gente consiga rodar um nó, o que restringe a quantidade de transações por segundo. Soluções como a [Lightning Network](/noticias/o-que-e-lightning-network) e as camadas 2 do Ethereum tentam contornar isso.
- **Privacidade não é automática.** Em redes públicas, todas as transações são visíveis.

## Onde a tecnologia aparece

Além das criptomoedas, blockchains são usadas ou testadas em registro de ativos, rastreabilidade de cadeias de suprimentos, emissão de títulos tokenizados e sistemas de pagamento. Muitos projetos, porém, não passaram da fase de testes. Vale avaliar cada caso pelos resultados, e não pelo uso da palavra "blockchain".

## Resumo

Blockchain é uma forma de manter um registro compartilhado e resistente a adulterações, sem depender de um único administrador. É uma ferramenta poderosa para alguns problemas, mas não para todos.
