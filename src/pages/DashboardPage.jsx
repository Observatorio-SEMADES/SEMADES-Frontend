import React from "react";
import EnvironmentCards from "../components/dashboard/EnvironmentCards";
import EconomicSection from "../components/dashboard/EconomicSection";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import DashboardCard from "../components/ui/DashboardCard";
import { indicadores } from "../data/indicadores";
import MetroVerseButton from "../components/Metroverse/MetroVerse";

// Página "/dashboard" — Observatório de Desenvolvimento Econômico.
// Saiu do antigo Root.jsx (que servia /dashboard e /dados-centro com um if).
// O container/main/rodapé agora vêm do AppShell.
export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Observatório de Desenvolvimento Econômico"
        subtitle="SEMADES - Secretaria Municipal de Meio Ambiente, Gestão Urbana e Desenvolvimento Econômico, Turístico e Sustentável"
      >
        <Badge category="economia" />
        <Badge category="sustentabilidade" />
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
            />
          ))}
        </div>
      </div>

      <MetroVerseButton />

      <section className="economic-wrapper">
        <EconomicSection />
        <EnvironmentCards />
      </section>
    </>
  );
}
