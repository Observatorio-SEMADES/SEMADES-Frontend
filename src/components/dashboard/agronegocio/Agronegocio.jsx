import React, { useState } from "react";
import { RebanhoTab, AbateTab } from "../pecuaria/Pecuaria";
import Agricultura from "../agricultura/Agricultura";

// Painel único de Agronegócio: uma só barra de abas reunindo o que antes eram
// duas páginas (/dashboard/agro-pecuaria e /dashboard/agro-agricultura).
//
// As duas metades têm arquiteturas diferentes e isso é proposital:
//  · Pecuária — cada aba é auto-contida (traz seus próprios filtros e cartões),
//    então troca entre Rebanho/Abate remonta e zera os filtros, como antes.
//  · Agricultura — filtros (Produto/Ano) e cartões são compartilhados pelas
//    duas abas, então o componente é o mesmo nas duas e só recebe `tab`, o que
//    mantém o filtro escolhido ao alternar entre elas, como antes.
const TABS = [
  { id: "rebanho", dominio: "Pecuária", label: "Rebanho" },
  { id: "abate", dominio: "Pecuária", label: "Abate" },
  { id: "lavoura", dominio: "Agricultura", label: "Por produto" },
  { id: "evolucao", dominio: "Agricultura", label: "Evolução anual" },
];

// Abas que caem no componente de Agricultura → qual aba interna acionam.
const ABAS_AGRICULTURA = { lavoura: "produto", evolucao: "evolucao" };

export default function Agronegocio() {
  const [tab, setTab] = useState("rebanho");
  const abaAgricultura = ABAS_AGRICULTURA[tab];

  return (
    <div className="agro-page">
      <div className="agro-tabs" role="tablist" aria-label="Seções do painel de Agronegócio">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`agro-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="agro-panel"
            className={`agro-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span className="agro-tab-dom">{t.dominio} · </span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="agro-panel" id="agro-panel" role="tabpanel" aria-labelledby={`agro-tab-${tab}`}>
        {abaAgricultura ? (
          <Agricultura tab={abaAgricultura} />
        ) : tab === "rebanho" ? (
          <RebanhoTab />
        ) : (
          <AbateTab />
        )}
      </div>
    </div>
  );
}
