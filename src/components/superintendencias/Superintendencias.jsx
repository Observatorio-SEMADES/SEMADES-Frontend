import React from "react";
import "../../styles/Superintendencias.css";
import HeaderNavTabs from "../navigation/HeaderNavTabs";
import AuthMenuItems from "../auth/AuthMenuItems";
import Footer from "../navigation/Footer";

export default function Superintendencias() {
  const loggedUser = (() => {
    if (typeof window === "undefined") return "";
    const raw = localStorage.getItem("authUser");
    if (!raw) return "";
    try {
      const parsed = JSON.parse(raw);
      return parsed?.name || parsed?.email || "";
    } catch {
      return "";
    }
  })();

  const toggleMenu = () => {
    document.body.classList.toggle("menu-open");
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
  };

  const handleExport = () => {
    const header = document.getElementById("print-header");
    if (header) {
      header.innerHTML = `<div class="print-center"></div>`;
    }
    setTimeout(() => window.print(), 180);
  };

  const indi = [
    {
      icone: "📃",
      cor: "economia",
      titulo: "SUAF",
      fonte: "Superintendência de Administração e Finanças",
      subtitulo: "Eficiência de máquina pública, tecnologia, governança e gestão",
      posicao: "1º",
      //link: "https://lookerstudio.google.com/u/0/reporting/793fb8dd-2c20-4e4f-942a-5514a8f3278b/page/p_hx3lm2fzvd",
    },
    {
      icone: "📈",
      cor: "economia",
      titulo: "SUDE",
      fonte: "Superintendência de Desenvolvimento",
      subtitulo: "Desenvolvimento e Projeto Estratégico",
      posicao: "2º",
      //link: "https://lookerstudio.google.com/u/0/reporting/98cfa20e-88ec-40c9-b852-5d9b110b3053/page/p_icrs9bcrvd",
    },
    {
      icone: "🏙️",
      cor: "sustentabilidade",
      titulo: "SURB",
      fonte: "Superintendência de Urbanismo",
      subtitulo: "Gestão de Recursos Humanos e Benefícios",
      posicao: "3º",
      //link: "https://lookerstudio.google.com/u/0/reporting/84f2b6a0-bf49-4780-a8e1-2d238609cc32/page/p_3ph3aoy2vd",
    },
    {
      icone: "👜",
      cor: "sustentabilidade",
      titulo: "SCAR",
      fonte: "Superintendência de Contratos e Processos de Aquisições",
      subtitulo: "Gestão de Contratos, Licitações e Compras",
      posicao: "4º",
      //link: "https://lookerstudio.google.com/u/0/reporting/586f8938-4a46-4d78-8e0a-72ddfc556ca0/page/p_8b28ovfzvd",
    },
  ];

  return (
    <div className="dashboard-container">
      {loggedUser ? (
        <div className="login-status">Logado como {loggedUser}</div>
      ) : null}
      {/* NAVBAR SUPERIOR */}
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
        <button
          onClick={() => {
            handleExport();
            closeMenu();
          }}
        >
          Exportar
        </button>
        {/* Login / sessão dentro do menu das três listras */}
        <AuthMenuItems />
      </div>

      {/* OVERLAY (fundo escurecido) */}
      <div className="menu-overlay no-print" onClick={closeMenu}></div>

      {/* usado apenas na impressão */}
      <div id="print-header" className="print-header no-print" aria-hidden="true"></div>

      <header className="dashboard-header">
        <h1 className="titulo-degrade">Central das Superintendências</h1>
        <p>Clique no card que deseja para mais informações sobre a superintendencia solicitada</p>

        <div className="legenda">
          <span className="tag economia">SUAF</span>
          <span className="tag sustentabilidade">SUDE</span>
          <span className="tag inovacao">SURB</span>
          <span className="tag economia">SCAR</span>
        </div>
      </header>

      <div className="super-container">
        <div className="card-grid">
          {indi.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className={`card ${item.cor}`}
            >
              <div className="icone">{item.icone}</div>
              <div className="posicao">{item.posicao}</div>
              <h2>{item.titulo}</h2>
              <div className="fonte">{item.fonte}</div>
              <div className="subtitulo">{item.subtitulo}</div>
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
