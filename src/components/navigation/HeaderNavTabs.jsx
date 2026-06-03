import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "In\u00edcio", path: "/home" },
  { label: "Indicadores Observat\u00f3rio", path: "/dashboard" },
  { label: "Superintend\u00eancias", path: "/superintendencias" },
  { label: "Dados Centro", path: "/dados-centro" },
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
  return (
    <div className="navbar-tabs" aria-label="Navega\u00e7\u00e3o principal">
      {tabs.map((tab) => (
        <HeaderNavButton key={tab.path} tab={tab} />
      ))}
    </div>
  );
}
