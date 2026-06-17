import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Agricultura.css";
import PageHeader from "../components/ui/PageHeader";
import Agricultura from "../components/dashboard/agricultura/Agricultura";

// Página nativa "/dashboard/agro-agricultura" — substitui o dashboard externo do Looker.
export default function AgroAgriculturaPage() {
  return (
    <>
      <div className="agr-back-wrap">
        <Link to="/dashboard" className="agr-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar aos indicadores
        </Link>
      </div>

      <PageHeader
        title="Agronegócio: Agricultura"
        subtitle="Lavoura de Campo Grande - MS · valor da produção e área plantada"
      />

      <Agricultura />
    </>
  );
}
