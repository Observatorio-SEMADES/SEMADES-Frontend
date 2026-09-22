import React, { useState } from "react";
import { FileSearch, TreePine, MessageSquareText, Globe2, BadgeCheck } from "lucide-react";
import "../../styles/Ferramentas.css";
import PageHeader from "../ui/PageHeader";
import DashboardCard from "../ui/DashboardCard";

export default function Ferramentas() {
  const [maintenanceMessage, setMaintenanceMessage] = useState("");

  const showMaintenanceMessage = () => {
    setMaintenanceMessage("Sistemas temporariamente indisponiveis, aguarde o fim da manutenção");
  };

  return (
    <>
      <PageHeader
        title="Ferramentas"
        subtitle="Ferramentas de apoio para comparação e análise de dados."
      />

      <div className="ferramentas-container">
        <div className="card-grid">
          <DashboardCard
            icon={FileSearch}
            category="inovacao"
            title="Arquivo Comparador"
            description="Compare arquivos e analise dados externos. Abre em uma nova aba."
            href="https://aqr-comparador.vercel.app/"
          />
          <DashboardCard
            icon={Globe2}
            category="inovacao"
            title="GeoMidia"
            description="Acesso ao sistema GeoMidia."
            onClick={showMaintenanceMessage}
          />
          <DashboardCard
            icon={BadgeCheck}
            category="inovacao"
            title="Compatibilidade"
            description="Acesso ao sistema de Compatibilidade."
            onClick={showMaintenanceMessage}
          />
          <DashboardCard
            icon={MessageSquareText}
            category="inovacao"
            title="Ouvidoria"
            description="Acesso ao sistema de Ouvidoria."
            onClick={showMaintenanceMessage}
          />
          <DashboardCard
            icon={TreePine}
            category="inovacao"
            title="Arborizaçao"
            description="Acesso ao sistema Arborizaçao."
            onClick={showMaintenanceMessage}
          />
        </div>
        {maintenanceMessage && (
          <p className="ferramentas-maintenance" role="alert">
            {maintenanceMessage}
          </p>
        )}
      </div>
    </>
  );
}
