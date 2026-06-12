import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import "../../styles/ui.css";

// Card de dashboard. Três modos:
// - `to`: navega para uma página interna do site (ex.: /dashboard/empresas).
// - `href`: abre um dashboard externo (Looker Studio etc.) em nova aba.
// - nenhum dos dois: card estático com selo "Em breve".
// `icon` recebe um componente lucide; `imageSrc` troca o ícone por imagem.
export default function DashboardCard({
  icon: Icon,
  imageSrc,
  imageAlt = "",
  category,
  title,
  source,
  description,
  href,
  to,
}) {
  const isInternal = Boolean(to);
  const isAvailable = isInternal || Boolean(href);

  const content = (
    <>
      <div className="dash-card-top">
        {imageSrc ? (
          <img className="dash-card-img" src={imageSrc} alt={imageAlt} />
        ) : (
          <span className="dash-card-icon">
            {Icon && <Icon size={26} strokeWidth={1.8} aria-hidden="true" />}
          </span>
        )}
        {!isAvailable ? (
          <span className="dash-card-soon">Em breve</span>
        ) : isInternal ? (
          <ArrowRight className="dash-card-external" size={18} aria-hidden="true" />
        ) : (
          <ExternalLink className="dash-card-external" size={18} aria-hidden="true" />
        )}
      </div>
      <h2>{title}</h2>
      {source && <p className="dash-card-source">{source}</p>}
      {description && <p className="dash-card-desc">{description}</p>}
    </>
  );

  if (!isAvailable) {
    return (
      <div className={`dash-card dash-card-${category} dash-card-disabled`}>
        {content}
      </div>
    );
  }

  if (isInternal) {
    return (
      <Link className={`dash-card dash-card-${category}`} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <a
      className={`dash-card dash-card-${category}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
