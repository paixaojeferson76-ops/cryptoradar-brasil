---
title: "Fundação Ethereum e Open Anonymity Project lançam zkAPI para pagamentos anônimos em APIs"
description: "Ferramenta lançada na rede principal do Ethereum utiliza provas de conhecimento zero para desvincular transações financeiras da identidade do usuário em serviços de API."
seoTitle: "Ethereum lança zkAPI para pagamentos anônimos em APIs"
seoDescription: "Ferramenta na rede do Ethereum usa provas de conhecimento zero para separar pagamentos da identidade de usuários em serviços de API."
pubDate: 2026-10-01T22:01:59-03:00
author: redacao
category: ethereum
tags: ["ethereum", "zkapi", "provas de conhecimento zero", "privacidade", "contratos inteligentes"]
type: noticia
image: "/images/noticias/fundacao-ethereum-e-open-anonymity-project-lancam-zkapi-para-pagamentos.webp"
imageAlt: "Imagem ilustrativa: Cryptocurrency transaction"
imageCredit: "Imagem por Mikael Häggström (CC0), via Wikimedia Commons"
imageSource: "https://commons.wikimedia.org/w/index.php?curid=66043104"
imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.en/"
sources:
  - title: "Introducing zkAPI: private usage credits for any API"
    url: "https://blog.ethereum.org/en/2026/10/01/introducing-zkapi"
    publisher: "Ethereum Foundation Blog"
    accessed: 2026-10-02
draft: false
generatedBy: "gemini:gemini-3.6-flash"
reviewed: true
---
A Fundação Ethereum, em colaboração com o Open Anonymity Project, lançou em 1º de outubro de 2026 o zkAPI, uma ferramenta que permite pagar pelo uso de interfaces de programação de aplicações (APIs, na sigla em inglês) de forma anônima. Segundo a organização, a tecnologia já está em operação na rede principal do [Ethereum](/noticias/o-que-e-ethereum) e utiliza provas de conhecimento zero (zero-knowledge proofs) para desvincular os pagamentos da identidade do usuário.

## Separação entre pagamentos e requisições

De acordo com o blog oficial do Ethereum, os modelos tradicionais de acesso a APIs, especialmente em serviços de inteligência artificial, exigem chaves de acesso vinculadas a contas e métodos de pagamento. Esse formato permite que os provedores identifiquem todo o histórico de consultas de um mesmo perfil.

O zkAPI altera esse fluxo ao dividir o processo em duas etapas independentes. O usuário realiza um único depósito de ativos, como ETH ou [stablecoins](/noticias/o-que-sao-stablecoins) como USDC, em um contrato inteligente de cofre na [blockchain](/noticias/o-que-e-blockchain). Esse valor passa a existir como uma nota privada que autoriza o consumo sem expor o endereço de origem do pagador.

## Mecanismo técnico e provas de conhecimento zero

Conforme detalhado no anúncio, o software instalado no dispositivo do usuário gera uma prova de conhecimento zero baseada no protocolo Groth16 e na curva BN254. Essa demonstração matemática comprova ao servidor que há saldo suficiente para cobrir os custos sem revelar qual nota ou depósito foi utilizado. As informações de compromissos e anuladores (nullifiers) usam a função hash Poseidon e são organizadas em uma árvore de Merkle com 32 níveis de profundidade.

Os anuladores funcionam como números de série unidirecionais. Se o usuário tentar gastar o mesmo saldo mais de uma vez, um anulador duplicado é publicado, identificando a tentativa de fraude sem expor os dados do usuário. O servidor de pagamento realiza a verificação das provas fora da rede (off-chain), enquanto o contrato de cofre valida as comprovações nos momentos de depósito, encerramento e resgate de fundos.

## Modos de operação e verificação

De acordo com o projeto, a autorização de uso opera por meio de reservas de limite de gastos atreladas a chaves temporárias. Ao final da sessão, o provedor gera um recibo assinado com o consumo total, e o valor correspondente é deduzido da nota privada. O zkAPI também disponibiliza um modo proxy simplificado, no qual o servidor da ferramenta retransmite as requisições diretamente ao provedor, embora nessa opção intermediária o tráfego de dados fique visível para o relé.
