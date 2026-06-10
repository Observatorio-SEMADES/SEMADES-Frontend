import React from "react";
import "../../styles/ui.css";

// Indicador resumido: ícone + rótulo + valor. Com `href` vira link externo.
// Unifica os antigos .resumo-card (DadosCentro) e .economic-item (EconomicSection).
export default function StatCard({ icon: Icon, label, value, href }) {
  const body = (
    <>
      <span className="stat-card-icon">
        {Icon && <Icon size={20} strokeWidth={2} aria-hidden="true" />}
      </span>
      <span className="stat-card-text">
        <span className="stat-card-label">{label}</span>
        <span className="stat-card-value">{value}</span>
      </span>
    </>
  );

  if (!href) {
    return <div className="stat-card">{body}</div>;
  }

  return (
    <a className="stat-card" href={href} target="_blank" rel="noopener noreferrer">
      {body}
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
