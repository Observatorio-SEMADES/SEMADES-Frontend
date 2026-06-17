import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Empresas.css";
import PageHeader from "../components/ui/PageHeader";
import Empresas from "../components/dashboard/empresas/Empresas";

// Página nativa "/dashboard/empresas" — substitui o dashboard externo do Looker.
export default function EmpresasPage() {
  return (
    <>
      <div className="emp-back-wrap">
        <Link to="/dashboard" className="emp-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar aos indicadores
        </Link>
      </div>

      <PageHeader
        title="Empresas"
        subtitle="Panorama Empresarial de Campo Grande - MS"
      />

      <Empresas />
    </>
  );
}
