import React from "react";
import "../../styles/Noticias.css";

const noticias = [
  {
    id: 1,
    titulo: "Campo Grande sedia encontro nacional sobre primeira inf\u00e2ncia",
    descricao:
      "Capital recebe encontro nacional com foco em pol\u00edticas p\u00fablicas, cuidado integral e desenvolvimento das crian\u00e7as.",
    imagem: "/imagens-cg/noticias/noticia1.jpg",
    alt: "Audit\u00f3rio lotado durante encontro nacional sobre primeira inf\u00e2ncia em Campo Grande",
    link: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/campo-grande-sedia-encontro-nacional-sobre-primeira-infancia/",
    destaque: true,
  },
  {
    id: 2,
    titulo: "PrefCG firma conv\u00eanio com maternidade para atender m\u00e3es at\u00edpicas",
    descricao:
      "Parceria amplia acolhimento e suporte especializado para m\u00e3es e fam\u00edlias que precisam de atendimento integrado.",
    imagem: "/imagens-cg/noticias/noticia2.jpg",
    alt: "Representantes da Prefeitura assinam conv\u00eanio em sala de reuni\u00e3o",
    link: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/prefcg-firma-convenio-com-maternidade-para-atender-maes-atipicas/",
  },
  {
    id: 3,
    titulo: "Sisep intensifica a\u00e7\u00f5es de limpeza e drenagem ap\u00f3s chuva intensa",
    descricao:
      "Equipes atuam em pontos estrat\u00e9gicos da cidade para recuperar vias, bocas de lobo e \u00e1reas afetadas.",
    imagem: "/imagens-cg/noticias/noticia3.jpg",
    alt: "Equipes da Sisep realizam limpeza de galhos e drenagem em via urbana",
    link: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/sisep-intensifica-acoes-de-limpeza-e-drenagem-apos-chuva-intensa/",
  },
  {
    id: 4,
    titulo: "Pra\u00e7a Ary Coelho virou ponto central da vacina\u00e7\u00e3o no Dia D na Capital",
    descricao:
      "A\u00e7\u00e3o levou atendimento a regi\u00e3o central e refor\u00e7ou a import\u00e2ncia da imuniza\u00e7\u00e3o para a popula\u00e7\u00e3o.",
    imagem: "/imagens-cg/noticias/noticia4.jpg",
    alt: "Unidade m\u00f3vel de vacina\u00e7\u00e3o atende moradores na Pra\u00e7a Ary Coelho",
    link: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/praca-ary-coelho-virou-ponto-central-da-vacinacao-no-dia-d-na-capital/",
  },
];

const verTudoLink = "https://www.campogrande.ms.gov.br/cgnoticias/noticias/";

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
  const noticiaPrincipal = noticias.find((noticia) => noticia.destaque);
  const noticiasLaterais = noticias.filter((noticia) => !noticia.destaque);

  return (
    <section className="noticias-section" aria-labelledby="noticias-title">
      <div className="noticias-container">
        <div className="noticias-header">
          <div className="noticias-heading">
            <h2 id="noticias-title">Not&iacute;cias</h2>
            <span className="noticias-heading-line" aria-hidden="true" />
          </div>

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
