import React from "react";
import Footer from "../navigation/Footer";
import "../../styles/Root.css";
import "../../styles/Ferramentas.css";

export default function Ferramentas() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="titulo-degrade">Ferramentas</h1>
        <p>SEMADES - Secretaria Municipal de Meio Ambiente, Gestão Urbana e Desenvolvimento Econômico, Turístico e Sustentável</p>
      </header>

      <main className="ferramentas-content">
        <a
          className="ferramentas-tool-card"
          href="https://aqr-comparador.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir Arquivo Comparador"
        >
         <span className="ferramentas-logo-wrap" aria-hidden="true">
            <img 
              className="ferramentas-aqr-logo" 
              src="https://aqr-comparador.vercel.app/brand/aqr-logo1.svg" 
              alt="Logo Arquivo Comparador" 
            />
          </span>
          <span className="ferramentas-tool-copy">
            <span className="ferramentas-tool-title">Arquivo Comparador</span>
            <span className="ferramentas-tool-action">Abrir ferramenta</span>
          </span>
        </a>
      </main>

      <Footer />
    </div>
  );
}
