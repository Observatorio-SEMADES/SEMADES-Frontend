import React, { useState } from "react";
import "../../styles/EnvironmentCards.css";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Leaf, TreePine, Scissors, Eye, ChevronDown, X } from "lucide-react";
import SectionTitle from "../ui/SectionTitle";
import StatCard from "../ui/StatCard";
import { useDialog } from "../../hooks/useDialog";
import {
  forestData, arbolinkTableData, arbolinkTotals,
} from "../../data/sustentabilidade";

const PERIOD = "Jan/2025 – Dez/2025";

// Modal com a tabela mensal completa — entra pela parte superior da tela.
function ArbolinkModal({ onClose }) {
  const dialogRef = useDialog(onClose);

  return (
    <div className="arbolink-overlay" onClick={onClose}>
      <div
        className="arbolink-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arbolink-dialog-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="arbolink-dialog-header">
          <div>
            <h3 id="arbolink-dialog-title" className="arbolink-dialog-title">
              Solicitações Mensais Arbolink
            </h3>
            <p className="arbolink-dialog-period">{PERIOD}</p>
          </div>
          <button
            className="arbolink-dialog-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="arbolink-dialog-body">
          <div className="table-wrapper">
            <table className="arbolink-table">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Solicitações de Avaliação Arbórea</th>
                  <th>Árvores Avaliadas</th>
                  <th>Autorizações de Supressão Expedidas</th>
                </tr>
              </thead>
              <tbody>
                {arbolinkTableData.map((row, idx) => (
                  <tr key={row.month} className={idx % 2 === 0 ? "even-row" : "odd-row"}>
                    <td className="month-cell">{row.month}</td>
                    <td>{row.pruning.toLocaleString("pt-BR")}</td>
                    <td>{row.evaluated.toLocaleString("pt-BR")}</td>
                    <td>{row.suppression.toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td className="month-cell">Total</td>
                  <td>{arbolinkTotals.pruning.toLocaleString("pt-BR")}</td>
                  <td>{arbolinkTotals.evaluated.toLocaleString("pt-BR")}</td>
                  <td>{arbolinkTotals.suppression.toLocaleString("pt-BR")}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="arbolink-dialog-footer">
          <p className="arbolink-source">
            Fonte:{" "}
            <a
              href="https://cg-painel-publico.arbolink.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arbolink (SEMADES)
            </a>
            {" "}— {PERIOD}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EnvironmentCards() {
  const [showModal, setShowModal] = useState(false);

  const chartData = arbolinkTableData.map((row) => ({
    month: row.month.slice(0, 3),
    "Solicitações de Avaliação Arbórea": row.pruning,
    "Avaliadas": row.evaluated,
    "Autorizações de Supressão Expedidas": row.suppression,
  }));

  return (
    <section className="env-container">
      <div className="env-header">
        <SectionTitle icon={TreePine} align="left">
          Sustentabilidade e Meio Ambiente
        </SectionTitle>
        <p className="env-period">{PERIOD}</p>
      </div>

      {/* ── Mudas ── */}
      <div className="env-stats-row">
        <StatCard
          icon={forestData[0].icon}
          label={forestData[0].label}
          value={forestData[0].value.toLocaleString("pt-BR")}
        />
        <StatCard
          icon={forestData[1].icon}
          label={forestData[1].label}
          value={forestData[1].value.toLocaleString("pt-BR")}
        />
      </div>

      {/* ── Arbolink: totais + gráfico + trigger ── */}
      <div className="arbolink-block">
        <h3 className="arbolink-block-title">Arbolink — Totais 2025</h3>

        <div className="env-stats-row">
          <StatCard
            icon={Scissors}
            label="Solicitações de Avaliação Arbórea (Total)"
            value={arbolinkTotals.pruning.toLocaleString("pt-BR")}
          />
          <StatCard
            icon={Eye}
            label="Árvores Avaliadas (Total)"
            value={arbolinkTotals.evaluated.toLocaleString("pt-BR")}
          />
          <StatCard
            icon={Leaf}
            label="Autorizações de Supressão Expedidas (Total)"
            value={arbolinkTotals.suppression.toLocaleString("pt-BR")}
          />
        </div>

        <div className="env-chart-wrap">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} width={36} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }}
                formatter={(v) => v.toLocaleString("pt-BR")}
              />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 8, fontSize: 11 }} />
              <Bar dataKey="Solicitações de Avaliação Arbórea" fill="#2e7d32" radius={[3,3,0,0]} isAnimationActive={false} />
              <Bar dataKey="Avaliadas"    fill="#66bb6a" radius={[3,3,0,0]} isAnimationActive={false} />
              <Bar dataKey="Autorizações de Supressão Expedidas" fill="#a5d6a7" radius={[3,3,0,0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Botão que abre o modal da tabela mensal */}
        <button
          type="button"
          className="arbolink-table-trigger"
          onClick={() => setShowModal(true)}
          aria-haspopup="dialog"
        >
          <ChevronDown size={16} aria-hidden="true" className="trigger-chevron" />
          <span>Ver solicitações mensais completas</span>
          <span className="trigger-period">{PERIOD}</span>
        </button>
      </div>

      {showModal && <ArbolinkModal onClose={() => setShowModal(false)} />}
    </section>
  );
}
