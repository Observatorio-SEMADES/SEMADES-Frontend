import React from "react";
import "../../styles/Superintendencias.css";
import Footer from "../navigation/Footer";
import PageHeader from "../ui/PageHeader";
import Badge from "../ui/Badge";
import DashboardCard from "../ui/DashboardCard";
import { superintendencias } from "../../data/superintendencias";

// A topbar/menu lateral vivem no TopBar global (main.jsx), fora da transição.
export default function Superintendencias() {
  return (
    <div className="dashboard-container">
      {/* usado apenas na impressão */}
      <div id="print-header" className="print-header no-print" aria-hidden="true"></div>

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
      <Footer />
    </div>
  );
}
