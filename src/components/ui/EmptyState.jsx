import React from "react";
import "../../styles/ui.css";

// Estado vazio padronizado (ícone opcional + título + descrição + ação).
// Substitui os "estados vazios improvisados" espalhados pelas telas.
export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="empty-state">
      {Icon && (
        <span className="empty-state-icon" aria-hidden="true">
          <Icon size={28} />
        </span>
      )}
      {title && <p className="empty-state-title">{title}</p>}
      {description && <p className="empty-state-desc">{description}</p>}
      {children}
    </div>
  );
}
