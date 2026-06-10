import React from "react";
import "../../styles/ui.css";

// Cabeçalho de página: título + subtítulo + legenda opcional (children,
// normalmente uma lista de <Badge>). Substitui .dashboard-header.
export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      {children && <div className="page-header-legend">{children}</div>}
    </header>
  );
}
