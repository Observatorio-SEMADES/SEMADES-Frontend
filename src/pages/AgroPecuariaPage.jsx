import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Pecuaria.css";
import PageHeader from "../components/ui/PageHeader";
import Pecuaria from "../components/dashboard/pecuaria/Pecuaria";

// Página nativa "/dashboard/agro-pecuaria" — substitui o dashboard externo do Looker.
export default function AgroPecuariaPage() {
  return (
    <>
      <div className="pec-back-wrap">
        <Link to="/dashboard" className="pec-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar aos indicadores
        </Link>
      </div>

      <PageHeader
        title="Agronegócio: Pecuária"
        subtitle="Rebanho de Campo Grande e abate de Mato Grosso do Sul"
      />

      <Pecuaria />
    </>
  );
}
