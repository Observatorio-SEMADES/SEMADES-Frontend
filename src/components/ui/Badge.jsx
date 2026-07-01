import React from "react";
import "../../styles/ui.css";

// Mapa central de rótulos por categoria (cores em ui.css via --cat-*).
const CATEGORY_LABELS = {
  economia: "Economia",
  sustentabilidade: "Sustentabilidade",
  inovacao: "Inovação",
  externo: "Fonte externa",
};

export default function Badge({ category, children, onClick }) {
  const label = children ?? CATEGORY_LABELS[category];
  const className = `badge badge-${category}`;

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {label}
      </button>
    );
  }

  return <span className={className}>{label}</span>;
}
