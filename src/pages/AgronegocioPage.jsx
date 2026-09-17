import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Pecuaria.css";
import "../styles/Agricultura.css";
import "../styles/Agronegocio.css";
import PageHeader from "../components/ui/PageHeader";
import Agronegocio from "../components/dashboard/agronegocio/Agronegocio";

// Página nativa "/dashboard/agronegocio" — unifica as antigas /dashboard/agro-pecuaria
// e /dashboard/agro-agricultura numa só, com as 4 abas na mesma barra.
// Os dois CSS antigos continuam sendo carregados porque os painéis internos
// seguem usando as classes .pec-* e .agr-*.
export default function AgronegocioPage() {
  return (
    <>
      <div className="pec-back-wrap">
        <Link to="/dashboard" className="pec-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar aos indicadores
        </Link>
      </div>

      <PageHeader
        title="Agronegócio"
        subtitle="Rebanho e lavoura de Campo Grande · abate em Mato Grosso do Sul"
      />

      <Agronegocio />
    </>
  );
}
