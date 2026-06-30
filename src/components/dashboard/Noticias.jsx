import React, { useEffect, useState } from "react";
import "../../styles/Noticias.css";
import SectionTitle from "../ui/SectionTitle";
import {
  noticias as noticiasIniciais,
  verTudoLink as verTudoLinkInicial,
} from "../../data/noticias";
import { fetchNoticias } from "../../services/noticiasApi";

function NoticiaCard({ noticia, variant = "side" }) {
  return (
    <a
      className={`noticias-card noticias-card-${variant}`}
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ler not\u00edcia: ${noticia.titulo}`}
    >
      <div className="noticias-card-image">
        <img src={noticia.imagem} alt={noticia.alt} loading="lazy" />
      </div>

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

  const noticiaPrincipal =
    noticias.find((noticia) => noticia.destaque) ?? noticias[0];
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
