import React, { useEffect, useState } from "react";
import "../../styles/Noticias.css";
import SectionTitle from "../ui/SectionTitle";
import {
  noticias as noticiasIniciais,
  verTudoLink as verTudoLinkInicial,
} from "../../data/noticias";
import { fetchNoticias } from "../../services/noticiasApi";

// O backend usa fotos locais de rod\u00edzio (/imagens-cg/noticias/*) quando a
// not\u00edcia n\u00e3o tem imagem pr\u00f3pria. Nesses casos o card vira s\u00f3-texto, em vez de
// exibir uma foto gen\u00e9rica que parece ser da mat\u00e9ria.
const FALLBACK_IMG_PREFIX = "/imagens-cg/noticias/";
const temFotoReal = (noticia) =>
  Boolean(noticia.imagem) && !noticia.imagem.startsWith(FALLBACK_IMG_PREFIX);

function NoticiaCard({ noticia, variant = "side" }) {
  const comFoto = temFotoReal(noticia);
  return (
    <a
      className={`noticias-card noticias-card-${variant}${comFoto ? "" : " noticias-card-textonly"}`}
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ler not\u00edcia: ${noticia.titulo}`}
    >
      {comFoto && (
        <div className="noticias-card-image">
          <img src={noticia.imagem} alt={noticia.alt} loading="lazy" />
        </div>
      )}

      <div className="noticias-card-content">
        <span className="noticias-tag">CG Not&iacute;cias</span>
        <h3>{noticia.titulo}</h3>
        <p>{noticia.descricao}</p>
        <span className="noticias-read-link">Ler not&iacute;cia</span>
      </div>
    </a>
  );
}

export default function Noticias() {
  const [noticias, setNoticias] = useState(noticiasIniciais);
  const [verTudoLink, setVerTudoLink] = useState(verTudoLinkInicial);

  useEffect(() => {
    let ativo = true;
    fetchNoticias().then((data) => {
      if (!ativo) return;
      if (data.noticias?.length) setNoticias(data.noticias);
      if (data.verTudoLink) setVerTudoLink(data.verTudoLink);
    });
    return () => {
      ativo = false;
    };
  }, []);

  // A foto real (quando existe) ganha o destaque; sem nenhuma foto real,
  // mantém a ordem original do feed.
  const noticiaPrincipal =
    noticias.find(temFotoReal) ??
    noticias.find((noticia) => noticia.destaque) ??
    noticias[0];
  const noticiasLaterais = noticias.filter(
    (noticia) => noticia !== noticiaPrincipal
  );

  if (!noticiaPrincipal) return null;

  return (
    <section className="noticias-section" aria-labelledby="noticias-title">
      <div className="noticias-container">
        <div className="noticias-header">
          <SectionTitle id="noticias-title" align="left">
            Not&iacute;cias
          </SectionTitle>

          <a
            className="noticias-see-all"
            href={verTudoLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver tudo
          </a>
        </div>

        <div className="noticias-grid">
          <NoticiaCard noticia={noticiaPrincipal} variant="featured" />

          <div className="noticias-side-list" aria-label="Mais not\u00edcias">
            {noticiasLaterais.map((noticia) => (
              <NoticiaCard key={noticia.id} noticia={noticia} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
