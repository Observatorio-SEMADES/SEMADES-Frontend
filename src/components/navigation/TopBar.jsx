import React from "react";
import { useLocation } from "react-router-dom";
import HeaderNavTabs from "./HeaderNavTabs";
import AuthMenuItems from "../auth/AuthMenuItems";

// Topbar única e estática, renderizada FORA do SlideRoutes (main.jsx): nas
// trocas de rota só o conteúdo abaixo dela desliza. Antes cada página
// renderizava o próprio <nav>, o que fazia a barra deslizar junto.

// Páginas com conteúdo imprimível mostram o botão "Exportar" no menu lateral.
const EXPORT_PATHS = ["/dashboard", "/dados-centro", "/superintendencias"];

// A tela de login tem layout próprio, sem topbar.
const HIDDEN_PATHS = ["/login"];

export default function TopBar() {
  const location = useLocation();

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  const showExport = EXPORT_PATHS.includes(location.pathname);

  const toggleMenu = () => {
    document.body.classList.toggle("menu-open");
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
  };

  // impressão (o #print-header vive dentro da página atual)
  const handleExport = () => {
    const header = document.getElementById("print-header");
    if (header) {
      header.innerHTML = `<div class="print-center"></div>`;
    }
    setTimeout(() => window.print(), 180);
  };

  return (
    <>
      <nav className="navbar no-print">
        <div className="navbar-left">
          <img src="/logo/prefcg1.png" alt="Prefeitura" className="navbar-logo" />
        </div>

        <HeaderNavTabs />

        <div className="navbar-burger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* MENU LATERAL */}
      <div className="side-menu no-print">
        {showExport && (
          <button
            onClick={() => {
              handleExport();
              closeMenu();
            }}
          >
            Exportar
          </button>
        )}

        {/* Login / sessão dentro do menu das três listras */}
        <AuthMenuItems />
      </div>

      {/* OVERLAY (fundo escurecido) */}
      <div className="menu-overlay no-print" onClick={closeMenu} />
    </>
  );
}
