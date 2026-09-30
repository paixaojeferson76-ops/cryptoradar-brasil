export const SITE = {
  name: 'CryptoRadar Brasil',
  shortName: 'CryptoRadar',
  tagline: 'Bitcoin e criptomoedas explicados com fontes',
  description:
    'Notícias, guias e análises sobre Bitcoin, Ethereum, blockchain, DeFi e regulação cripto no Brasil — sempre com as fontes à vista.',
  locale: 'pt_BR',
  lang: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  foundingYear: 2026,
  repo: 'https://github.com/paixaojeferson76-ops/cryptoradar-brasil',
} as const;

export const ENV = {
  gaId: import.meta.env.PUBLIC_GA_ID?.trim() || '',
  adsenseClient: import.meta.env.PUBLIC_ADSENSE_CLIENT?.trim() || '',
  adSlots: {
    home: import.meta.env.PUBLIC_ADSENSE_SLOT_HOME?.trim() || '',
    article: import.meta.env.PUBLIC_ADSENSE_SLOT_ARTICLE?.trim() || '',
    sidebar: import.meta.env.PUBLIC_ADSENSE_SLOT_SIDEBAR?.trim() || '',
  },
  googleVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || '',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL?.trim() || '',
};

export const CATEGORY_IDS = [
  'bitcoin',
  'ethereum',
  'altcoins',
  'blockchain',
  'defi',
  'regulacao',
  'mineracao',
  'seguranca',
  'mercado',
  'tecnologia',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  /** Matiz (0–360) usado nas capas geradas e na marca de cor da categoria. */
  hue: number;
}

export const CATEGORIES: Record<CategoryId, Category> = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    description: 'Notícias e guias sobre Bitcoin: rede, preço, adoção, halving e Lightning.',
    hue: 32,
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    description: 'Ethereum, contratos inteligentes, atualizações da rede e camadas 2.',
    hue: 232,
  },
  altcoins: {
    id: 'altcoins',
    name: 'Altcoins',
    description: 'Outras criptomoedas e stablecoins: projetos, riscos e o que observar.',
    hue: 280,
  },
  blockchain: {
    id: 'blockchain',
    name: 'Blockchain',
    description: 'Como funcionam as blockchains e onde a tecnologia está sendo usada.',
    hue: 195,
  },
  defi: {
    id: 'defi',
    name: 'DeFi',
    description: 'Finanças descentralizadas: empréstimos, corretoras descentralizadas e riscos.',
    hue: 160,
  },
  regulacao: {
    id: 'regulacao',
    name: 'Regulação',
    description: 'Regras para criptoativos no Brasil e no mundo: Banco Central, CVM, SEC e mais.',
    hue: 350,
  },
  mineracao: {
    id: 'mineracao',
    name: 'Mineração',
    description: 'Mineração de Bitcoin: hashrate, dificuldade, energia e recompensas.',
    hue: 48,
  },
  seguranca: {
    id: 'seguranca',
    name: 'Segurança',
    description: 'Como proteger suas criptomoedas: carteiras, autocustódia e golpes comuns.',
    hue: 5,
  },
  mercado: {
    id: 'mercado',
    name: 'Mercado',
    description: 'Mercado cripto: preços, ETFs, fluxos institucionais e como ler os indicadores.',
    hue: 140,
  },
  tecnologia: {
    id: 'tecnologia',
    name: 'Tecnologia',
    description: 'Protocolos, atualizações de software e inovações nas redes cripto.',
    hue: 210,
  },
};

/** Menu principal (ordem de exibição). */
export const NAV: { label: string; href: string }[] = [
  { label: 'Notícias', href: '/noticias' },
  { label: 'Bitcoin', href: '/bitcoin' },
  { label: 'Ethereum', href: '/ethereum' },
  { label: 'Altcoins', href: '/altcoins' },
  { label: 'DeFi', href: '/defi' },
  { label: 'Regulação', href: '/regulacao' },
  { label: 'Mercado', href: '/mercado' },
  { label: 'Guias', href: '/guias' },
];

export const MORE_NAV: { label: string; href: string }[] = [
  { label: 'Blockchain', href: '/blockchain' },
  { label: 'Mineração', href: '/mineracao' },
  { label: 'Segurança', href: '/seguranca' },
  { label: 'Tecnologia', href: '/tecnologia' },
];

export const LEGAL_NAV = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
  { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
  { label: 'Termos de Uso', href: '/termos-de-uso' },
  { label: 'Política de Cookies', href: '/politica-de-cookies' },
];
