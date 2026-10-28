import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sprout, Boxes, ClipboardList } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import FilterDropdown from "../components/ui/FilterDropdown";
import SourceMeta, { SourceDisclosure } from "../components/ui/SourceMeta";
import { mudasRows } from "../data/observatorio";
import { agriculturaFamiliarPublicos } from "../data/agriculturaFamiliarPublicos";
import { formatNumber, sumAvailable, unique, valueOf } from "../data/observatorioCsv";
import "../styles/Pecuaria.css";
import "../styles/AgriculturaFamiliar.css";

const months = unique(mudasRows.map((row) => row.periodo));
const monthBR = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
const monthLabel = (period) => monthBR.format(new Date(period + "-01T00:00:00Z"));
const axis = { fill: "#6b7280", fontSize: 11 };
const MUDAS_SOURCE = {
  label: "SEMADES · Planilha municipal de Agricultura Familiar · registros mensais",
  url: mudasRows[0]?.fonte_url,
};

const PUBLIC_PANELS = {
  mecanizada: {
    title: "Patrulha Mecanizada",
    sections: [
      { title: "Atuação da Patrulha Agrícola Mecanizada", metrics: agriculturaFamiliarPublicos.patrulha },
      { title: "Maquinário recebido", metrics: agriculturaFamiliarPublicos.maquinario },
    ],
  },
  feira: {
    title: "Feira",
    sections: [{ title: "Feiras livres", metrics: agriculturaFamiliarPublicos.feiras }],
  },
  agrosocial: {
    title: "Agrosocial",
    sections: [
      { title: "Programa de Aquisição de Alimentos (PAA) · municipal", metrics: agriculturaFamiliarPublicos.paa },
      { title: "Ação Agro Social", metrics: agriculturaFamiliarPublicos.agrosocial },
    ],
  },
};

function PublishedMetric({ metric }) {
  return (
    <div className="family-published-stat">
      <span className="family-published-badge">Dado publicado</span>
      <StatCard
        icon={metric.icon}
        label={metric.label}
        value={metric.value}
        detail={`${metric.period} · ${metric.unit}`}
      />
    </div>
  );
}

function PublishedSourceMeta({ metrics }) {
  const periods = [...new Set(metrics.map((metric) => metric.period))];
  const sources = [...new Map(metrics.map((metric) => [metric.source.url, metric.source])).values()];

  return (
    <div className="source-meta">
      <span><b>Território:</b> Campo Grande (MS)</span>
      <span><b>Período:</b> {periods.join(", ")}</span>
      <span><SourceDisclosure sources={sources} /></span>
    </div>
  );
}

function PublishedPanel({ panel }) {
  return (
    <div className="family-published-panel" aria-label={panel.title}>
      {panel.sections.map((section) => (
        <section className="family-published-group" key={section.title}>
          <h2 className="family-section-heading">{section.title}</h2>
          <PublishedSourceMeta metrics={section.metrics} />
          <div className="family-published-metrics">
            {section.metrics.map((metric) => (
              <PublishedMetric key={metric.label} metric={metric} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function AgriculturaFamiliarPage() {
  const [month, setMonth] = useState(null);
  const [theme, setTheme] = useState("hortas");
  const selected = month ? [month] : months;
  const rows = mudasRows.filter((row) => selected.includes(row.periodo));
  const sourceRows = rows.map((row) => ({ ...row, fonte: MUDAS_SOURCE.label }));
  const byMonth = selected.map((period) => ({
    period,
    mes: monthLabel(period),
    entregas: valueOf(rows, "entregas_registradas", period, "Total"),
    bandejas: valueOf(rows, "bandejas_entregues", period, "Total"),
    mudas: valueOf(rows, "mudas_entregues", period, "Total"),
  }));
  const cultures = unique(rows.filter((row) => row.indicador === "bandejas_por_cultura").map((row) => row.categoria))
    .map((name) => ({
      cultura: name,
      bandejas: sumAvailable(rows.filter((row) => row.indicador === "bandejas_por_cultura" && row.categoria === name).map((row) => row.valor)),
    }))
    .sort((a, b) => (b.bandejas ?? -1) - (a.bandejas ?? -1));
  const total = (key) => sumAvailable(byMonth.map((row) => row[key]));
  const periodText = month
    ? monthLabel(month)
    : months.length
      ? monthLabel(months[0]) + " a " + monthLabel(months.at(-1))
      : "Sem período disponível";
  const tabItems = [
    { id: "hortas", label: "Hortas Urbanas" },
    { id: "mecanizada", label: "Patrulha Mecanizada" },
    { id: "feira", label: "Feira" },
    { id: "agrosocial", label: "Agrosocial" },
  ];

  return (
    <>
      <div className="pec-back-wrap">
        <Link to="/dashboard" className="pec-back"><ArrowLeft size={18} aria-hidden="true" />Voltar aos indicadores</Link>
      </div>
      <PageHeader title="Agricultura familiar" subtitle="Hortas, serviços e iniciativas de apoio à agricultura familiar em Campo Grande" />
      <p className="family-publication-note" role="note">
        Indicadores reproduzem dados publicados e registros da fonte indicada em cada item; não são atualizados em tempo real.
      </p>
      <div className="family-page">
        <div className="family-theme-tabs" role="tablist" aria-label="Temas da agricultura familiar">
          {tabItems.map((item) => (
            <button
              key={item.id}
              id={"family-tab-" + item.id}
              type="button"
              role="tab"
              aria-selected={theme === item.id}
              aria-controls="family-theme-panel"
              className={"family-theme-tab" + (theme === item.id ? " active" : "")}
              tabIndex={theme === item.id ? 0 : -1}
              onClick={() => setTheme(item.id)}
              onKeyDown={(event) => {
                const currentIndex = tabItems.findIndex((tab) => tab.id === item.id);
                let nextIndex = currentIndex;
                if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabItems.length;
                if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabItems.length) % tabItems.length;
                if (event.key === "Home") nextIndex = 0;
                if (event.key === "End") nextIndex = tabItems.length - 1;
                if (nextIndex !== currentIndex) {
                  event.preventDefault();
                  const next = tabItems[nextIndex];
                  setTheme(next.id);
                  document.getElementById("family-tab-" + next.id)?.focus();
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div id="family-theme-panel" role="tabpanel" aria-labelledby={"family-tab-" + theme}>
          {theme === "hortas" ? (
            <div className="family-hortas">
              <h2 className="family-section-heading">Hortas Urbanas</h2>
              <div className="pec-filter">
                <span className="pec-filter-label">Mês:</span>
                <FilterDropdown
                  allLabel={months.length ? monthLabel(months[0]) + " a " + monthLabel(months.at(-1)) : "Todos os meses"}
                  options={months}
                  value={month}
                  onChange={setMonth}
                  formatOption={monthLabel}
                />
              </div>
              <SourceMeta
                rows={sourceRows}
                period={periodText}
                unit="entregas registradas; bandejas; mudas"
                note="Registros conferidos das abas mensais. Entregas registradas não representam necessariamente pessoas únicas. O painel resumo da planilha diverge dos lançamentos mensais."
                collapsibleSources
              />
              <div className="family-published-metrics">
                <PublishedMetric metric={{ icon: ClipboardList, label: "Entregas registradas", value: formatNumber(total("entregas")), unit: "entregas", period: periodText, source: MUDAS_SOURCE }} />
                <PublishedMetric metric={{ icon: Boxes, label: "Bandejas entregues", value: formatNumber(total("bandejas")), unit: "bandejas", period: periodText, source: MUDAS_SOURCE }} />
                <PublishedMetric metric={{ icon: Sprout, label: "Mudas entregues", value: formatNumber(total("mudas")), unit: "mudas", period: periodText, source: MUDAS_SOURCE }} />
              </div>
              <PublishedPanel
                panel={{
                  title: "Irrigação",
                  sections: [{ title: "Programa Irriga Forte", metrics: agriculturaFamiliarPublicos.irrigacao }],
                }}
              />
              <div className="pec-top-row">
                <section className="pec-card">
                  <div className="pec-card-title">Entregas registradas por mês · {periodText}</div>
                  <div className="pec-chart-context">Campo Grande (MS) · Unidade: entregas</div>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={byMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis dataKey="mes" tick={axis} />
                        <YAxis tick={axis} />
                        <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " entregas"} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="entregas" name="Entregas registradas" fill="#0a4f9f" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                <section className="pec-card">
                  <div className="pec-card-title">Mudas entregues por mês · {periodText}</div>
                  <div className="pec-chart-context">Campo Grande (MS) · Unidade: mudas (unidades)</div>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={byMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis dataKey="mes" tick={axis} />
                        <YAxis tick={axis} tickFormatter={formatNumber} />
                        <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " mudas"} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="mudas" name="Mudas (unidades)" fill="#16845b" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>
              <div className="pec-top-row">
                <section className="pec-card">
                  <div className="pec-card-title">Bandejas entregues por mês · {periodText}</div>
                  <div className="pec-chart-context">Campo Grande (MS) · Unidade: bandejas</div>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={byMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis dataKey="mes" tick={axis} />
                        <YAxis tick={axis} tickFormatter={formatNumber} />
                        <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " bandejas"} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="bandejas" name="Bandejas" fill="#9b7100" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                <section className="pec-card">
                  <div className="pec-card-title">Bandejas por cultura · {periodText}</div>
                  <div className="pec-chart-context">Campo Grande (MS) · Unidade: bandejas</div>
                  <div style={{ height: Math.max(340, cultures.length * 30 + 72) }}>
                    <ResponsiveContainer>
                      <BarChart data={cultures} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis type="number" tick={axis} />
                        <YAxis type="category" dataKey="cultura" tick={axis} width={132} />
                        <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " bandejas"} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="bandejas" name="Bandejas" fill="#0a4f9f" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>
              <div className="pec-top-row">
                <section className="pec-card">
                  <div className="pec-card-title">Resumo mensal · {periodText}</div>
                  <div className="pec-chart-context">Campo Grande (MS) · Unidades: entregas, bandejas e mudas</div>
                  <div className="pec-table-scroll">
                    <table className="pec-table">
                      <thead><tr><th>Mês</th><th className="num">Entregas</th><th className="num">Bandejas</th><th className="num">Mudas (unidades)</th></tr></thead>
                      <tbody>{byMonth.map((row) => <tr key={row.period}><td>{row.mes}</td><td className="num">{formatNumber(row.entregas)}</td><td className="num">{formatNumber(row.bandejas)}</td><td className="num">{formatNumber(row.mudas)}</td></tr>)}</tbody>
                      <tfoot><tr><td>Total</td><td className="num">{formatNumber(total("entregas"))}</td><td className="num">{formatNumber(total("bandejas"))}</td><td className="num">{formatNumber(total("mudas"))}</td></tr></tfoot>
                    </table>
                  </div>
                </section>
                <section className="pec-card">
                  <div className="pec-card-title">Bandejas por cultura · detalhamento · {periodText}</div>
                  <div className="pec-chart-context">Campo Grande (MS) · Unidade: bandejas</div>
                  <div className="pec-table-scroll">
                    <table className="pec-table">
                      <thead><tr><th>Cultura</th><th className="num">Bandejas</th></tr></thead>
                      <tbody>{cultures.map((row) => <tr key={row.cultura}><td>{row.cultura}</td><td className="num">{formatNumber(row.bandejas)}</td></tr>)}</tbody>
                      <tfoot><tr><td>Total das culturas</td><td className="num">{formatNumber(sumAvailable(cultures.map((row) => row.bandejas)))}</td></tr></tfoot>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <PublishedPanel panel={PUBLIC_PANELS[theme]} />
          )}
        </div>
      </div>
    </>
  );
}
