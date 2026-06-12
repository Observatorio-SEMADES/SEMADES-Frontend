import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Empregos.css";
import PageHeader from "../components/ui/PageHeader";
import Empregos from "../components/dashboard/empregos/Empregos";

// Página nativa "/dashboard/empregos" — substitui o dashboard externo do Looker.
export default function EmpregosPage() {
  return (
    <>
      <div className="emg-back-wrap">
        <Link to="/dashboard" className="emg-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar aos indicadores
        </Link>
      </div>

      <PageHeader
        title="Empregos"
        subtitle="Empregos formais de Campo Grande - MS (CAGED)"
      />

      <Empregos />
    </>
  );
}
