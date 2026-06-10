import React from "react";
import "../../styles/ui.css";

// h2 com linha de acento. tone="light" para faixas escuras (navy);
// align="left" para cabeçalhos laterais (ex.: Notícias).
export default function SectionTitle({
  id,
  tone = "dark",
  align = "center",
  icon: Icon,
  className = "",
  children,
}) {
  const classes = [
    "section-heading",
    align === "center" ? "section-heading-center" : "",
    tone === "light" ? "section-heading-light" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <h2 id={id} className={classes}>
      {Icon && (
        <span className="section-heading-icon" aria-hidden="true">
          <Icon size={28} strokeWidth={2} />
        </span>
      )}
      {children}
    </h2>
  );
}
