---
title: "Binance afirma que ataque de US$ 6,34 bilhões começou com falsa entrevista de emprego"
description: "Relatório da Binance detalha ofensiva de cinco meses que utilizou vagas fictícias, malware e exploração do padrão EIP-7702 para desviar US$ 6,34 bilhões em criptomoedas."
seoTitle: "Binance detalha ataque de US$ 6,34 bi com falsa entrevista"
seoDescription: "Binance divulga que invasão de US$ 6,34 bilhões começou com falso recrutamento e malware. Empresa congelou US$ 2,85 bi dos fundos."
pubDate: 2026-11-08T03:46:03-03:00
author: redacao
category: seguranca
tags: ["Binance", "segurança cibernética", "hack", "Ethereum", "Coreia do Norte"]
type: noticia
image: "/images/noticias/binance-afirma-que-ataque-de-us-6-34-bilhoes-comecou-com-falsa-entrevista-de.webp"
imageAlt: "Imagem ilustrativa: Close-up colorful lines code computer"
imageCredit: "Imagem (CC0), via Rawpixel"
imageSource: "https://www.rawpixel.com/image/3295877/free-photo-image-language-learning-code-technology-background-digital"
imageLicenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
sources:
  - title: "Binance's $6.3 billion hack began with a fake job interview, and a campaign 'built over many months'"
    url: "https://coindesk.com/business/2026/11/03/binance-s-usd6-3-billion-hack-began-with-a-fake-job-interview-exchange-says"
    publisher: "CoinDesk"
    accessed: 2026-11-08
  - title: "Binance Says $6.34 Billion Hack Began With Fake Job Interview"
    url: "https://bitcoinmagazine.com/news/binance-says-6-34-billion-hack-job"
    publisher: "Bitcoin Magazine"
    accessed: 2026-11-08
draft: false
generatedBy: "gemini:gemini-3.8-flash"
reviewed: true
---
A Binance divulgou na terça-feira (3) que o roubo de US$ 6,34 bilhões sofrido em 29 de outubro foi resultado de uma campanha de invasão de cinco meses estruturada a partir de um falso processo seletivo e softwares adulterados. A explicação constou no primeiro relatório oficial de incidentes da exchange e em entrevista coletiva conduzida pelo co-CEO Richard Teng e pelo diretor de segurança (CSO), Jimmy Su.

## Engenharia social e infiltração gradual

De acordo com a Binance, o ponto inicial da ofensiva ocorreu em junho, quando um engenheiro da área de DevOps de carteiras buscou uma ferramenta de inteligência artificial para programação e realizou o download de um instalador adulterado do gerenciador de pacotes Homebrew. Embora a equipe de segurança tenha detectado a anomalia e trocado as credenciais, os invasores identificaram os cargos e nomes dos membros responsáveis pela infraestrutura de custódia.

Em setembro, os invasores contataram um segundo engenheiro por meio de uma plataforma profissional de empregos, simulando o contato de um diretor de projetos. Após etapas de entrevistas por vídeo com supostos representantes de recursos humanos e um falso diretor-executivo, o profissional recebeu uma tarefa prática que continha um repositório de código malicioso. Esse arquivo substituiu um componente legítimo da ferramenta `pyenv` por um malware de dia zero — falha até então não catalogada —, contornando as ferramentas de detecção interna da máquina de trabalho.

Táticas que exploram a confiança de profissionais e investidores são comuns em incidentes do setor, conforme abordado no guia sobre [golpes com criptomoedas](/noticias/golpes-com-criptomoedas-como-se-proteger). Em 20 de outubro, os invasores utilizaram o computador comprometido e um assistente interno de inteligência artificial para alcançar outros funcionários, obtendo um token de implantação de contêineres.

## Drenagem dos fundos e uso do EIP-7702

No dia 29 de outubro, entre 14h15 e 16h56 (horário de Brasília), os cibercriminosos acessaram o terminal de um terceiro engenheiro e executaram um contêiner com as credenciais roubadas. A drenagem começou às 17h05 de Brasília, quando cinco carteiras quentes (*hot wallets*, conectadas à internet) transferiram 233,46 milhões de XRP em apenas quatro minutos.

Na sequência, carteiras nas redes Solana e Optimism transferiram 970.500 SOL e 44,2 milhões de OP, enquanto outra carteira quente enviou 18.270 unidades de [Bitcoin](/noticias/o-que-e-bitcoin). Para movimentar os fundos no ecossistema [Ethereum](/noticias/o-que-e-ethereum), os criminosos usaram a infraestrutura de assinatura da exchange para invocar a especificação técnica EIP-7702. O mecanismo permite delegar permissões de execução a contratos inteligentes sem revelar chaves privadas, concedendo controle parcial de uma das carteiras a um contrato sob domínio dos invasores.

## Recuperação de ativos e atribuição do ataque

A Binance declarou que congelou ou interceptou US$ 2,85 bilhões dos valores retirados e recompôs 98% dos saldos afetados com capital próprio, adquirindo o restante diretamente no mercado aberto. A empresa também afirmou ter neutralizado outras 57 tentativas parecidas ligadas a agentes norte-coreanos no decorrer do ano.

O Departamento Federal de Investigação dos Estados Unidos (FBI) atribuiu a autoria do crime à Coreia do Norte. A Binance registrou o apontamento do FBI em seu relatório, mas não realizou uma atribuição direta independente. Pyongyang rejeitou as acusações por meio de nota da irmã do líder Kim Jong Un, Kim Yo Jong, veiculada na mídia estatal do país, classificando a declaração norte-americana como uma provocação política.
