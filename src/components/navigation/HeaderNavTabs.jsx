import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { canAccessFeature, fetchMyPermissions } from "../../services/permissions";
import { hasApiUrl } from "../../services/api";
import { useAuthSession } from "../../hooks/useAuthSession";
import { useMenu } from "./menuContext";

const PUBLIC_TABS = [
  { label: "Início", path: "/home" },
  { label: "Indicadores Observatório", path: "/dashboard" },
  { label: "Dados Centro", path: "/dados-centro" },
];

const RESTRICTED_TABS = [
  { label: "Superintendências", path: "/superintendencias", feature: "superintendencias" },
];

function HeaderNavButton({ tab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { closeMenu } = useMenu();
  const isActive = location.pathname === tab.path;

  const handleClick = () => {
    closeMenu();
    navigate(tab.path);
  };

  return (
    <button
      type="button"
      className={`navbar-tab ${isActive ? "active" : ""}`}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      {tab.label}
    </button>
  );
}

// Abas da topbar. NÃO inclui Login/Sair — o controle de sessão vive dentro do
// menu das três listras (AuthMenuItems). Aqui só mostramos navegação pública e,
// quando o backend autoriza, a aba restrita (Superintendências).
export default function HeaderNavTabs() {
  // Reage a login/logout (sessionchange) para reavaliar as abas visíveis.
  const { isAuthenticated } = useAuthSession();
  const [, setPermsVersion] = useState(0);

  // Ao montar logado (reload) ou ao logar, valida permissões no backend e
  // força um re-render para refletir a visibilidade de Superintendências.
  useEffect(() => {
    let active = true;
    if (isAuthenticated && hasApiUrl()) {
      fetchMyPermissions().then(() => {
        if (active) setPermsVersion((v) => v + 1);
      });
    }
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const visibleRestrictedTabs = RESTRICTED_TABS.filter((tab) =>
    canAccessFeature(tab.feature)
  );
  const tabs = [...PUBLIC_TABS, ...visibleRestrictedTabs];

  return (
    <div className="navbar-tabs" aria-label="Navegação principal">
      {tabs.map((tab) => (
        <HeaderNavButton key={tab.path} tab={tab} />
      ))}
    </div>
  );
}
