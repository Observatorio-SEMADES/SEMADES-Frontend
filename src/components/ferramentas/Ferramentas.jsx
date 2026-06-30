import React from "react";
import { Columns2 } from "lucide-react";
import "../../styles/Ferramentas.css";
import PageHeader from "../ui/PageHeader";
import DashboardCard from "../ui/DashboardCard";

export default function Ferramentas() {
  return (
    <>
      <PageHeader
        title="Ferramentas"
        subtitle="Ferramentas de apoio para comparação e análise de dados."
      />

      <div className="ferramentas-container">
        <div className="card-grid">
          <DashboardCard
            icon={Columns2}
            category="inovacao"
            title="Arquivo Comparador"
            description="Compare arquivos e analise dados externos lado a lado. Abre em uma nova aba."
            href="https://aqr-comparador.vercel.app/"
          />
        </div>
      </div>
    </>
  );
}
