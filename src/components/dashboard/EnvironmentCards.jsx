import React from "react";
// ...existing code...
import "../../styles/EnvironmentCards.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Sprout, Leaf, TreePine } from "lucide-react";
import SectionTitle from "../ui/SectionTitle";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const forestData = [
  { icon: Sprout, label: "Mudas Doadas/Distribuídas", value: 27153 },
  { icon: Leaf, label: "Mudas Plantadas", value: 9429 },
];

const plantingRate = 34.7;
const sectionTitle = "Sustentabilidade e Meio Ambiente";
const sectionPeriod = "Jan/2025 - Dez/2025";

const arbolinkTableData = [
  { month: "Janeiro", pruning: 92, evaluated: 184, suppression: 106 },
  { month: "Fevereiro", pruning: 122, evaluated: 376, suppression: 218 },
  { month: "Março", pruning: 110, evaluated: 290, suppression: 195 },
  { month: "Abril", pruning: 165, evaluated: 333, suppression: 200 },
  { month: "Maio", pruning: 144, evaluated: 289, suppression: 153 },
  { month: "Junho", pruning: 180, evaluated: 208, suppression: 113 },
  { month: "Julho", pruning: 261, evaluated: 272, suppression: 165 },
  { month: "Agosto", pruning: 149, evaluated: 292, suppression: 132 },
  { month: "Setembro", pruning: 227, evaluated: 302, suppression: 217 },
  { month: "Outubro", pruning: 193, evaluated: 388, suppression: 277 },
  { month: "Novembro", pruning: 134, evaluated: 272, suppression: 197 },
  { month: "Dezembro", pruning: 126, evaluated: 357, suppression: 199 },
];

export default function EnvironmentCards() {
  const pieData = {
    labels: forestData.map((d) => d.label),
    datasets: [
      {
        data: forestData.map((d) => d.value),
        backgroundColor: ["#66bb6a", "#a5d6a7"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((s, v) => s + v, 0);
            const pct = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value.toLocaleString("pt-BR")} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <section className="env-container">
      <div className="env-header">
        <SectionTitle icon={TreePine} className="env-title">
          {sectionTitle}
        </SectionTitle>
        <p>{sectionPeriod}</p>
      </div>

      <div className="env-card">
        <div className="card-list">
          {forestData.map((item) => (
            <div key={item.label} className="card-row">
              <div className="left">
                <span className="item-icon" aria-hidden="true">
                  <item.icon size={18} />
                </span>
                <span>{item.label}</span>
              </div>
              <span className="value">{item.value.toLocaleString("pt-BR")}</span>
            </div>
          ))}

          <div className="card-footer">
            <span className="taxa-titulo">Taxa de plantio:</span>{" "}
            <span className="taxa-texto">
              {plantingRate}% das mudas doadas foram plantadas
            </span>
          </div>
        </div>

        <div className="chart-container" aria-hidden="true">
          <Pie data={pieData} options={options} />
        </div>
      </div>

      <div className="arbolink-table-section">
        <div className="table-header">
          <h3 className="table-title">Solicitações Mensais Arbolink</h3>
        </div>
        <div className="table-wrapper">
          <table className="arbolink-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th>Solicitações de Poda/Remoção</th>
                <th>Número de Árvores Avaliadas</th>
                <th>Autorização de Supressão Expedidas</th>
              </tr>
            </thead>
            <tbody>
              {arbolinkTableData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                  <td className="month-cell">{row.month}</td>
                  <td>{row.pruning.toLocaleString("pt-BR")}</td>
                  <td>{row.evaluated.toLocaleString("pt-BR")}</td>
                  <td>{row.suppression.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <p className="arbolink-source">
            Fonte:{" "}
            <a
              href="https://cg-painel-publico.arbolink.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arbolink (SEMADES)
            </a>
            {" "} — {sectionPeriod}
          </p>
        </div>
      </div>
    </section>
  );
}
