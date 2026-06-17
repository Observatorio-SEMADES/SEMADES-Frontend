import React from "react";
import "../styles/DadosCentro.css";
import PageHeader from "../components/ui/PageHeader";
import DadosCentro from "../components/dados-centro/DadosCentro";

// Página "/dados-centro" — Cadastro Imobiliário do Centro.
// Saiu do antigo Root.jsx (ramo isDadosCentro). Container/main/rodapé no AppShell.
export default function DadosCentroPage() {
  return (
    <>
      <PageHeader
        title="Dados Centro de Campo Grande - MS"
        subtitle="Visão Geral do Cadastro Imobiliário  • Fonte Municipal"
      />
      <DadosCentro />
    </>
  );
}
