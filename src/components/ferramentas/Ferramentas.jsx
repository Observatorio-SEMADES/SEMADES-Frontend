import React from "react";
import "../../styles/Ferramentas.css";
import PageHeader from "../ui/PageHeader";
import DashboardCard from "../ui/DashboardCard";

export default function Ferramentas() {
  return (
    <>
      <PageHeader
        title="Ferramentas"
        subtitle="Acesse a ferramenta disponível para comparação externa"
      />

      <div className="ferramentas-container">
        <div className="card-grid">
          <DashboardCard
            imageSrc="https://aqr-comparador.vercel.app/brand/aqr-logo1.svg"
            imageAlt="AQR Comparador"
            category="inovacao"
            title="Arquivo Comparador"
            description="Abra o comparador AQR em uma nova aba para analisar dados externos."
            href="https://aqr-comparador.vercel.app/"
          />
        </div>
      </div>
    </>
  );
}
