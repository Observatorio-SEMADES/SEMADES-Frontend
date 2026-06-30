import { apiRequest, hasApiUrl } from './api';
import {
  noticias as noticiasFallback,
  verTudoLink as verTudoLinkFallback,
} from '../data/noticias';

// Busca as notícias no backend (que por sua vez busca, em tempo real e com
// cache, no portal CG Notícias). Se o backend não estiver configurado ou a
// requisição falhar, cai para a lista estática em src/data/noticias.js — assim
// a seção da Home nunca fica vazia.
export async function fetchNoticias() {
  const fallback = {
    noticias: noticiasFallback,
    verTudoLink: verTudoLinkFallback,
  };

  if (!hasApiUrl()) return fallback;

  try {
    const data = await apiRequest('/noticias');
    const noticias = Array.isArray(data?.noticias) ? data.noticias : [];
    if (!noticias.length) return fallback;
    return {
      noticias,
      verTudoLink: data?.verTudoLink || verTudoLinkFallback,
    };
  } catch {
    return fallback;
  }
}
