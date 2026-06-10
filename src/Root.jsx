import React from "react";
import { useLocation } from "react-router-dom";
import "./styles/Root.css";
import "./styles/DadosCentro.css";
import "./styles/Print.css";
import EnvironmentCards from "./components/dashboard/EnvironmentCards";
import EconomicSection from "./components/dashboard/EconomicSection";
import DadosCentro from "./components/dados-centro/DadosCentro";
import HeaderNavTabs from "./components/navigation/HeaderNavTabs";
import AuthMenuItems from "./components/auth/AuthMenuItems";
import Footer from "./components/navigation/Footer";
import MetroVerseButton from "./components/Metroverse/MetroVerse";

const indicadores = [
  {
    icone: "🏢",
    cor: "economia",
    titulo: "Empresas",
    fonte: "PLANURB, 2025",
    subtitulo: "Crescimento e número de estabelecimentos ativos",
    posicao: "1º",
    link: "https://lookerstudio.google.com/reporting/c2481516-de21-4653-af24-08c88b02cac5",
  },
  {
    icone: "💼",
    cor: "economia",
    titulo: "Empregos",
    fonte: "CAGED, 2026",
    subtitulo: "Geração de empregos formais e informais",
    posicao: "2º",
    link: "https://lookerstudio.google.com/reporting/38fdf9ca-ce21-4bb8-8c32-26a0cf7cbe86",
  },
  {
    icone: "🐄",
    cor: "sustentabilidade",
    titulo: "Agronegócio: Pecuária",
    fonte: "IBGE, 2024",
    subtitulo: "Produção e movimentação de rebanhos",
    posicao: "3º",
    link: "https://lookerstudio.google.com/reporting/ddb6fd56-6187-4941-adb5-def4eca70f70",
  },
  {
    icone: "🌾",
    cor: "sustentabilidade",
    titulo: "Agronegócio: Agricultura",
    fonte: "IBGE, 2024",
    subtitulo: "Produção e área plantada das principais culturas",
    posicao: "4º",
    link: "https://lookerstudio.google.com/reporting/07f206fd-4594-4ad6-a155-0303421cd099",
  },
  {
    icone: "🚢",
    cor: "inovacao",
    titulo: "Comércio Exterior Exportação",
    fonte: "COMEXTAT, 2025",
    subtitulo: "Principais produtos exportados pelo município",
    posicao: "5º",
    link: "https://lookerstudio.google.com/reporting/b726ca0c-1ace-468a-822f-4e6bca1a56d7",
  },
  {
    icone: "📦",
    cor: "inovacao",
    titulo: "Comércio Exterior Importação",
    fonte: "COMEXTAT, 2025",
    subtitulo: "Principais produtos importados pelo município",
    posicao: "6º",
    link: "https://lookerstudio.google.com/reporting/f63d1dd2-0f38-4580-a7b7-e50e17f4c8d1",
  },
  // {
   // icone: "📊",
    //cor: "economia",
    //titulo: "PRODES",
    //fonte: " ",
    //subtitulo:
      //"Programa de incentivos para o desenvolvimento econômico e social de Campo Grande",
    //posicao: "7º",
    //link: "https://lookerstudio.google.com/reporting/23713d3b-62be-4e85-bec0-49d87b8e4e43/page/rrOeF",
  //},
];

export default function Root() {
  const location = useLocation();
  const isDadosCentro = location.pathname === "/dados-centro";
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

  // abre/fecha o menu (classe no body)
  const toggleMenu = () => {
    document.body.classList.toggle("menu-open");
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
  };

  // impressão
  const handleExport = () => {
    const header = document.getElementById("print-header");
    if (header) {
      header.innerHTML = `
        <div class="print-center"></div>
      `;
    }
    setTimeout(() => window.print(), 180);
  };

  return (
    <div className="dashboard-container">
      {loggedUser ? (
        <div className="login-status">Logado como {loggedUser}</div>
      ) : null}
      {/* NAVBAR SUPERIOR */}
      <nav className="navbar no-print">
        <div className="navbar-left">
          <img
            src="/logo/prefcg1.png"
            alt="Prefeitura"
            className="navbar-logo"
          />
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
      <div className="menu-overlay no-print" onClick={closeMenu} />

      {/* usado apenas na impressão */}
      <div
        id="print-header"
        className="print-header no-print"
        aria-hidden="true"
      ></div>

      <header className="dashboard-header">
        <h1 className="titulo-degrade">{isDadosCentro ? "Dados Centro de Campo Grande - MS" : "Observatório de Desenvolvimento Econômico"}</h1>
        {isDadosCentro ? (
          <p>Visão Geral do Cadastro Imobiliário  • Fonte Municipal</p>
        ) : (
          <p>SEMADES - Secretaria Municipal de Meio Ambiente, Gestão Urbana e Desenvolvimento Econômico, Turístico e Sustentável</p>
        )}

        {!isDadosCentro && (
          <div className="legenda">
            <span className="tag economia">Economia</span>
            <span className="tag sustentabilidade">Sustentabilidade</span>
            <span className="tag inovacao">Inovação</span>
          </div>
        )}
      </header>

      {isDadosCentro && <DadosCentro />}

      {!isDadosCentro && (
        <>
          <div className="dashboard-content">
            <main className="card-grid">
              {indicadores.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div className={`card ${item.cor}`}>
                    <div className="icone">{item.icone}</div>
                    <div className="posicao">{item.posicao}</div>
                    <h2>{item.titulo}</h2>
                    <p className="fonte">{item.fonte}</p>
                    <p className="subtitulo">{item.subtitulo}</p>
                  </div>
                </a>
              ))}
            </main>
          </div>

          <MetroVerseButton />

          <section className="economic-wrapper">
            <EconomicSection />
            <EnvironmentCards />
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
