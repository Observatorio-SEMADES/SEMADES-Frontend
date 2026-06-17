import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../../styles/superintendencias/PlanoGestao.css";
import PageHeader from "../../components/ui/PageHeader";
import PlanoGestao from "../../components/superintendencias/PlanoGestao";
import { sudeAcoes, sudeAnos, sudeFonte } from "../../data/superintendencias/sude";

// Página nativa "/superintendencias/sude" — substitui o dashboard externo do
// Looker. Proteção (feature "superintendencias") fica no FeatureRoute em main.jsx.
export default function SudePage() {
  return (
    <>
      <div className="pg-back-wrap">
        <Link to="/superintendencias" className="pg-back">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar às superintendências
        </Link>
      </div>

      <PageHeader
        title="SUDE — Superintendência de Desenvolvimento Econômico"
        subtitle="Plano de Gestão: metas, projetos, entregas e ações"
      />

      <PlanoGestao acoes={sudeAcoes} anos={sudeAnos} fonte={sudeFonte} />
    </>
  );
}
