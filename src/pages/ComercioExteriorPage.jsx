import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/Pecuaria.css";
import PageHeader from "../components/ui/PageHeader";
import ComercioExterior from "../components/dashboard/comex/ComercioExterior";

// Página nativa "/dashboard/comercio-exterior" — dados do Comex Stat/MDIC em CSV
// versionado no repositório. Reaproveita o visual .pec-* do Agronegócio.
export default function ComercioExteriorPage() {
  return (
    <>
      <div className="pec-back-wrap">
        <Link to="/dashboard" className="pec-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar aos indicadores
        </Link>
      </div>

      <PageHeader
        title="Comércio exterior"
        subtitle="Exportações e importações de empresas com domicílio fiscal em Campo Grande - MS (Comex Stat/MDIC)"
      />

      <ComercioExterior />
    </>
  );
}
