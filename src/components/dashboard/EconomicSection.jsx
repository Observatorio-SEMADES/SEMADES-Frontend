import React, { useState } from "react";
import "../../styles/EconomicSection.css";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Building2, Users, TrendingUp, Trophy } from "lucide-react";
import StatCard from "../ui/StatCard";
import { economicDataByYear } from "../../data/economia";

export default function EconomicSection() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
  const selectedEconomicData = economicDataByYear[selectedYear];
  const data = selectedEconomicData.chartData;
  const indicators = selectedEconomicData.indicators;

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearFilterOpen(false);
  };

  return (
    <section className="economic-section">
      <div className="economic-grid">
        {/* === CARD DE DADOS === */}
        <div className="economic-card info-card">
          <h3 className="economic-title">Desenvolvimento Econômico</h3>
          <p className="economic-period">{selectedEconomicData.period}</p>

          <StatCard icon={Building2} label="Empresas Abertas" value={indicators.companies.value} href={indicators.companies.link} />
          <StatCard icon={Users} label="Empregos Formais (Saldo)" value={indicators.jobs.value} href={indicators.jobs.link} />
          <StatCard icon={TrendingUp} label="Crescimento Percentual" value={indicators.growth.value} href={indicators.growth.link} />
          <StatCard icon={Trophy} label="Posição Nacional" value={indicators.nationalPosition.value} href={indicators.nationalPosition.link} />
        </div>

        {/* === CARD DO GRÁFICO === */}
        <div className="economic-card chart-card">
          <div className="chart-header">
            <div className="chart-title-row">
              <h3 className="economic-title">Visualização Econômica</h3>
              <div className="year-filter">
                <button
                  type="button"
                  className="year-filter-button"
                  onClick={() => setIsYearFilterOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={isYearFilterOpen}
                >
                  {selectedYear}
                </button>
                {isYearFilterOpen && (
                  <div className="year-filter-options" role="listbox" aria-label="Selecionar ano">
                    {Object.keys(economicDataByYear).map((year) => (
                      <button
                        key={year}
                        type="button"
                        className={`year-filter-option ${selectedYear === year ? "active" : ""}`}
                        onClick={() => handleYearSelect(year)}
                        role="option"
                        aria-selected={selectedYear === year}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="economic-subtitle">Comparativo de Indicadores — Mato Grosso do Sul e Campo Grande</p>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                barCategoryGap="20%"
                barGap={4}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fill: "#374151", fontSize: 11 }} />
                <YAxis tick={{ fill: "#374151", fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => {
                    if (value === null || value === undefined) return "-";
                    return value.toLocaleString();
                  }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }} />

                {/* Empresas Abertas MS (azul escuro) */}
                <Bar dataKey="empMS" name="Empresas Abertas MS" barSize={12} fill="#062a78" />

                {/* Empresas Abertas em CG (azul claro) */}
                <Bar dataKey="empCG" name="Empresas Abertas em CG" barSize={12} fill="#93c5fd" />

                {/* Empregos Formais MS (Saldo) - dark yellow, negative -> red per-cell */}
                <Bar dataKey="jobMS" name="Empregos Formais MS (Saldo)" barSize={12} fill="#EFBB07">
                  {data.map((entry, index) => (
                    <Cell
                      key={`jobMS-${index}`}
                      fill={entry.jobMS < 0 ? "#ef4444" : "#EFBB07"}
                    />
                  ))}
                </Bar>

                {/* Empregos Formais em CG (Saldo) - light yellow, negative -> red per-cell */}
                <Bar dataKey="jobCG" name="Empregos Formais em CG (Saldo)" barSize={12} fill="#f0d473">
                  {data.map((entry, index) => (
                    <Cell
                      key={`jobCG-${index}`}
                      fill={entry.jobCG < 0 ? "#ef4444" : "#f0d473"}
                    />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-footer">
            <p className="economic-source">
              Fonte:{" "}
              <a
                href="https://www.funtrab.ms.gov.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                FUNTRAB / CAGED
              </a>{" "}
              — {selectedYear === "2026" ? "Abril" : "Jan"}/2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
