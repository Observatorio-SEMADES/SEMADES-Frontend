import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderNavTabs from "./HeaderNavTabs";
import AuthMenuItems from "../auth/AuthMenuItems";
import { MenuContext } from "./menuContext";

// Topbar única e estática, renderizada FORA do SlideRoutes (main.jsx): nas
// trocas de rota só o conteúdo abaixo dela desliza. Antes cada página
// renderizava o próprio <nav>, o que fazia a barra deslizar junto.

// Páginas com conteúdo imprimível mostram o botão "Exportar" no menu lateral.
const EXPORT_PATHS = ["/dashboard", "/dados-centro", "/superintendencias"];

// A tela de login tem layout próprio, sem topbar.
const HIDDEN_PATHS = ["/login"];

export default function TopBar() {
  const location = useLocation();
  const navRef = useRef(null);
  // Estado do menu lateral em React (antes vivia só em document.body.classList).
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Mantém a classe global usada pelas regras de CSS (.menu-open ...) em sincronia
  // com o estado React, sem que os componentes filhos precisem tocar no body.
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  // Fecha o menu ao trocar de rota e ao apertar Esc.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Publica a altura real da navbar em --navbar-h para que o menu lateral e o
  // overlay se posicionem sem números mágicos (antes: top 96px/104px chumbados).
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;
    const apply = () =>
      document.documentElement.style.setProperty("--navbar-h", `${nav.offsetHeight}px`);
    apply();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", apply);
      return () => window.removeEventListener("resize", apply);
    }
    const ro = new ResizeObserver(apply);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [location.pathname]);

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  const showExport = EXPORT_PATHS.includes(location.pathname);

  // impressão (o #print-header vive dentro da página atual)
  const handleExport = () => {
    const header = document.getElementById("print-header");
    if (header) {
      header.innerHTML = `<div class="print-center"></div>`;
    }
    setTimeout(() => window.print(), 180);
  };

  return (
    <MenuContext.Provider value={{ closeMenu }}>
      <nav className="navbar no-print" ref={navRef}>
        <div className="navbar-left">
          <img src="/logo/prefcg1.png" alt="Prefeitura" className="navbar-logo" />
        </div>

        <HeaderNavTabs />

        <button
          type="button"
          className="navbar-burger"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="side-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* MENU LATERAL */}
      <div className="side-menu no-print" id="side-menu">
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
    </MenuContext.Provider>
  );
}
