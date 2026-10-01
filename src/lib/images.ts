import type { Article } from './articles';
import { link } from './url';

export interface Cover {
  src: string;
  srcset?: string;
  photo: boolean;
}

/**
 * Imagem de capa de um artigo. Fotos em /images/noticias/ têm duas larguras
 * (<slug>.webp com 1600px e <slug>-800.webp); sem foto, usa a capa "radar" gerada.
 */
export function coverOf(a: Article): Cover {
  const img = a.data.image;
  if (!img) return { src: link(`/capas/${a.id}.svg`), photo: false };
  if (img.startsWith('/images/noticias/') && img.endsWith('.webp')) {
    const small = img.replace(/\.webp$/, '-800.webp');
    return { src: link(small), srcset: `${link(small)} 800w, ${link(img)} 1600w`, photo: true };
  }
  return { src: link(img), photo: true };
}
