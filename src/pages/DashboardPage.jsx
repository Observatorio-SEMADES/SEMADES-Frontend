import React from "react";
import EnvironmentCards from "../components/dashboard/EnvironmentCards";
import EconomicSection from "../components/dashboard/EconomicSection";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import DashboardCard from "../components/ui/DashboardCard";
import { indicadores } from "../data/indicadores";
import MetroVerseButton from "../components/Metroverse/MetroVerse";
import { Sprout } from "lucide-react";

// Página "/dashboard" — Observatório de Desenvolvimento Econômico.
// Saiu do antigo Root.jsx (que servia /dashboard e /dados-centro com um if).
// O container/main/rodapé agora vêm do AppShell.
export default function DashboardPage() {
  const handleArborizacaoClick = () => {
    // Filtro de assunto: leva o usuário até a seção de Arborização Urbana.
    document.getElementById("arborizacao-urbana")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <PageHeader
        title="Observatório de Desenvolvimento Econômico"
        subtitle="SEMADES - Secretaria Municipal de Meio Ambiente, Gestão Urbana e Desenvolvimento Econômico, Turístico e Sustentável"
      >
        <Badge category="economia" />
        <Badge category="sustentabilidade" onClick={handleArborizacaoClick}>
          Arborização
        </Badge>
        <Badge category="inovacao" />
      </PageHeader>

      <div className="dashboard-content">
        <div className="card-grid">
          {indicadores.map((item) => (
            <DashboardCard
              key={item.titulo}
              icon={item.icone}
              category={item.cor}
              title={item.titulo}
              source={item.fonte}
              description={item.subtitulo}
              href={item.link}
              to={item.to}
            />
          ))}
        </div>
      </div>

      <MetroVerseButton />

      <section className="economic-wrapper">
        <div className="treecity-floating-group">
          <a
            className="arbolink-external-link treecity-floating-button"
            href="https://cg-painel-publico.arbolink.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Sprout size={16} strokeWidth={1.75} className="arbolink-link-icon" aria-hidden="true" />
            <span>Painel Público de Arborização</span>
          </a>
          <a
            className="treecity-insignia-link"
            href="https://www.campogrande.ms.gov.br/cgnoticias/noticia/pela-7a-vez-seguida-campo-grande-conquista-titulo-cidade-arvore-do-mundo/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/imagens-cg/InsigniaCGTreeCity.png"
              alt="Insígnia Campo Grande Tree City 2020 a 2026"
            />
          </a>
        </div>
        <EconomicSection />
        <EnvironmentCards />
      </section>
    </>
  );
}
