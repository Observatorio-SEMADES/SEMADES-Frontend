import React from "react";
import "../../styles/ui.css";

// Mapa central de rótulos por categoria (cores em ui.css via --cat-*).
const CATEGORY_LABELS = {
  economia: "Economia",
  sustentabilidade: "Sustentabilidade",
  inovacao: "Inovação",
  externo: "Fonte externa",
};

export default function Badge({ category, children }) {
  return (
    <span className={`badge badge-${category}`}>
      {children ?? CATEGORY_LABELS[category]}
    </span>
  );
}
