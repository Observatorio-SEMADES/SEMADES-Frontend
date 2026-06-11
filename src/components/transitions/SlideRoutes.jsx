import React, { useEffect, useRef, useState } from "react";
import { Routes, useLocation } from "react-router-dom";
import "../../styles/SlideRoutes.css";

// Transição curta entre rotas: a página que sai faz um fade + deslize leve, e a
// nova entra do lado oposto com o mesmo movimento. A direção segue a ordem das
// abas (ROUTE_ORDER): ir para uma aba mais à direita desliza para a esquerda, e
// vice-versa. Antes era um "empurrão" de 100vw em 800ms; agora é um movimento
// curto (24px) de ~250ms, mais discreto e rápido.
//
// Durante a animação a página antiga é re-renderizada com a location anterior
// (<Routes location={...}>) por cima, em position: absolute; a nova fica no
// fluxo normal, mantendo a altura/scroll do documento corretos.

const ROUTE_ORDER = ["/home", "/dashboard", "/dados-centro", "/superintendencias"];
const DURATION_MS = 250; // manter em sincronia com SlideRoutes.css

function routeIndex(pathname) {
  const i = ROUTE_ORDER.indexOf(pathname);
  return i === -1 ? 0 : i;
}

export default function SlideRoutes({ children }) {
  const location = useLocation();
  const [displayed, setDisplayed] = useState(location);
  const [leaving, setLeaving] = useState(null); // { location, dir }
  const timerRef = useRef(null);

  useEffect(() => {
    if (location.pathname === displayed.pathname) {
      setDisplayed(location);
      return undefined;
    }
    const dir =
      routeIndex(location.pathname) > routeIndex(displayed.pathname)
        ? "left"
        : "right";
    setLeaving({ location: displayed, dir });
    setDisplayed(location);
    window.scrollTo(0, 0);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setLeaving(null), DURATION_MS);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const dir = leaving?.dir;

  return (
    <div className={`slide-stage${leaving ? " is-animating" : ""}`}>
      {leaving && (
        <div className={`slide-page slide-out-${dir}`} aria-hidden="true">
          <Routes location={leaving.location}>{children}</Routes>
        </div>
      )}
      <div key={displayed.key} className={leaving ? `slide-in-${dir}` : undefined}>
        <Routes location={displayed}>{children}</Routes>
      </div>
    </div>
  );
}
