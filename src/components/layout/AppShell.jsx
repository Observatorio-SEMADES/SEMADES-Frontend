import React from "react";
import "../../styles/Root.css";
import "../../styles/Print.css";
import Footer from "../navigation/Footer";

// Casca comum de todas as páginas internas: o container central, UM <main>
// semântico e o rodapé. Antes cada página (Root, HomePageWrapper,
// Superintendencias) repetia .dashboard-container + <Footer />, e o <main> ficava
// invertido (era o .card-grid dentro de uma div). A TopBar/menu lateral vivem no
// TopBar global (main.jsx), fora da transição de rotas.
//
// `printable`: páginas com botão "Exportar" (dashboard, dados-centro,
// superintendências) precisam do #print-header que o TopBar preenche ao imprimir.
export default function AppShell({ children, printable = false }) {
  return (
    <div className="dashboard-container">
      {printable && (
        <div id="print-header" className="print-header no-print" aria-hidden="true" />
      )}
      <main>{children}</main>
      <Footer />
    </div>
  );
}
