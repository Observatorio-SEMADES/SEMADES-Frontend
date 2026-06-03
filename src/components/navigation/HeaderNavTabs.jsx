import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { canAccessFeature } from "../../services/permissions";

const PUBLIC_TABS = [
  { label: "In\u00edcio", path: "/home" },
  { label: "Indicadores Observat\u00f3rio", path: "/dashboard" },
  { label: "Dados Centro", path: "/dados-centro" },
];

const RESTRICTED_TABS = [
  { label: "Superintend\u00eancias", path: "/superintendencias", feature: "superintendencias" },
];

function HeaderNavButton({ tab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === tab.path;

  const handleClick = () => {
    document.body.classList.remove("menu-open");
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

export default function HeaderNavTabs() {
  const visibleRestrictedTabs = RESTRICTED_TABS.filter((tab) =>
    canAccessFeature(tab.feature)
  );
  const tabs = [...PUBLIC_TABS, ...visibleRestrictedTabs];

  return (
    <div className="navbar-tabs" aria-label="Navega\u00e7\u00e3o principal">
      {tabs.map((tab) => (
        <HeaderNavButton key={tab.path} tab={tab} />
      ))}
    </div>
  );
}
