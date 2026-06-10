import React from "react";
import { useLocation } from "react-router-dom";
import "./styles/Root.css";
import "./styles/DadosCentro.css";
import "./styles/Print.css";
import EnvironmentCards from "./components/dashboard/EnvironmentCards";
import EconomicSection from "./components/dashboard/EconomicSection";
import DadosCentro from "./components/dados-centro/DadosCentro";
import Footer from "./components/navigation/Footer";
import PageHeader from "./components/ui/PageHeader";
import Badge from "./components/ui/Badge";
import DashboardCard from "./components/ui/DashboardCard";
import { indicadores } from "./data/indicadores";
import MetroVerseButton from "./components/Metroverse/MetroVerse";

export default function Root() {
  const location = useLocation();
  const isDadosCentro = location.pathname === "/dados-centro";

  // A topbar/menu lateral vivem no TopBar global (main.jsx), fora da transição.
  return (
    <div className="dashboard-container">
      {/* usado apenas na impressão */}
      <div
        id="print-header"
        className="print-header no-print"
        aria-hidden="true"
      ></div>

      <PageHeader
        title={
          isDadosCentro
            ? "Dados Centro de Campo Grande - MS"
            : "Observatório de Desenvolvimento Econômico"
        }
        subtitle={
          isDadosCentro
            ? "Visão Geral do Cadastro Imobiliário  • Fonte Municipal"
            : "SEMADES - Secretaria Municipal de Meio Ambiente, Gestão Urbana e Desenvolvimento Econômico, Turístico e Sustentável"
        }
      >
        {!isDadosCentro && (
          <>
            <Badge category="economia" />
            <Badge category="sustentabilidade" />
            <Badge category="inovacao" />
          </>
        )}
      </PageHeader>

      {isDadosCentro && <DadosCentro />}

      {!isDadosCentro && (
        <>
          <div className="dashboard-content">
            <main className="card-grid">
              {indicadores.map((item) => (
                <DashboardCard
                  key={item.titulo}
                  icon={item.icone}
                  category={item.cor}
                  title={item.titulo}
                  source={item.fonte}
                  description={item.subtitulo}
                  href={item.link}
                />
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
