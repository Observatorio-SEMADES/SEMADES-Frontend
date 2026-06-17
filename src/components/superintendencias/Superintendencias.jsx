import React from "react";
import "../../styles/Superintendencias.css";
import PageHeader from "../ui/PageHeader";
import Badge from "../ui/Badge";
import DashboardCard from "../ui/DashboardCard";
import { superintendencias } from "../../data/superintendencias";

// Conteúdo da página restrita "/superintendencias". O container/main/rodapé e o
// #print-header vêm do AppShell (main.jsx); a proteção continua no FeatureRoute.
export default function Superintendencias() {
  return (
    <>
      <PageHeader
        title="Central das Superintendências"
        subtitle="Clique no card que deseja para mais informações sobre a superintendencia solicitada"
      >
        {superintendencias.map((item) => (
          <Badge key={item.titulo} category={item.cor}>
            {item.titulo}
          </Badge>
        ))}
      </PageHeader>

      <div className="super-container">
        <div className="card-grid">
          {superintendencias.map((item) => (
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
    </>
  );
}
