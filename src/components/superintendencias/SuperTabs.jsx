import React from "react";
import { NavLink } from "react-router-dom";
import { superintendencias } from "../../data/superintendencias";

// Abinhas de navegação entre as superintendências nativas, exibidas no topo de
// cada painel (acima dos filtros). Lê a lista do hub e mostra só as que já têm
// página interna (`to`); a ativa é destacada pela rota atual. Trocar de
// superintendência é um clique, sem voltar para a Central.
export default function SuperTabs() {
  const tabs = superintendencias.filter((s) => s.to);
  if (tabs.length < 2) return null;

  return (
    <nav className="pg-super-tabs" aria-label="Trocar de superintendência">
      {tabs.map((s) => (
        <NavLink
          key={s.to}
          to={s.to}
          title={s.fonte}
          className={({ isActive }) => `pg-super-tab${isActive ? " active" : ""}`}
        >
          {s.titulo}
        </NavLink>
      ))}
    </nav>
  );
}
