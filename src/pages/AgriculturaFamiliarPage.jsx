import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sprout, Boxes, ClipboardList, Wheat, CalendarDays, UsersRound, Store } from "lucide-react";
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
import SourceMeta from "../components/ui/SourceMeta";
import { mudasRows } from "../data/observatorio";
import { agriculturaFamiliarDemo } from "../data/agriculturaFamiliarDemo";
import { formatNumber, sumAvailable, unique, valueOf } from "../data/observatorioCsv";
import "../styles/Pecuaria.css";
import "../styles/AgriculturaFamiliar.css";

const months = unique(mudasRows.map((row) => row.periodo));
const monthBR = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
const monthLabel = (period) => monthBR.format(new Date(period + "-01T00:00:00Z"));
const axis = { fill: "#6b7280", fontSize: 11 };
const DEMO_BADGE = "Dados demonstrativos";

const DEMO_PANELS = {
  mecanizada: {
    title: "Patrulha Mecanizada",
    data: agriculturaFamiliarDemo.mecanizada,
    icons: [ClipboardList, Sprout, Boxes, Wheat],
    monthlyTitle: "Ordens de serviço por mês · 2026",
    monthlyKey: "services",
    monthlyCategory: "month",
    monthlyUnit: "ordens de serviço",
    breakdownTitle: "Atendimentos por tipo · 2026",
    breakdownKey: "count",
    breakdownCategory: "service",
    breakdownUnit: "atendimentos",
  },
  feira: {
    title: "Feira",
    data: agriculturaFamiliarDemo.feira,
    icons: [CalendarDays, UsersRound, Store, Sprout],
    monthlyTitle: "Visitas estimadas por mês · 2026",
    monthlyKey: "visits",
    monthlyCategory: "month",
    monthlyUnit: "visitas",
    breakdownTitle: "Feirantes por ponto · 2026",
    breakdownKey: "sellers",
    breakdownCategory: "fair",
    breakdownUnit: "feirantes",
  },
  agrosocial: {
    title: "Agrosocial",
    data: agriculturaFamiliarDemo.agrosocial,
    icons: [ClipboardList, UsersRound, Boxes, Wheat],
    monthlyTitle: "Ações acompanhadas por mês · 2026",
    monthlyKey: "actions",
    monthlyCategory: "month",
    monthlyUnit: "ações",
    breakdownTitle: "Ações por tema · 2026",
    breakdownKey: "count",
    breakdownCategory: "theme",
    breakdownUnit: "ações",
  },
};

function DemoMetric({ icon, label, value, detail }) {
  return (
    <div className="family-demo-stat">
      <span className="family-demo-badge">{DEMO_BADGE}</span>
      <StatCard icon={icon} label={label} value={value} detail={detail} />
    </div>
  );
}

function DemoChart({ title, rows, categoryKey, valueKey, unit, horizontal = false, color }) {
  const height = Math.max(300, rows.length * 34 + 72);
  return (
    <section className="pec-card family-demo-chart">
      <div className="family-demo-card-head">
        <div className="pec-card-title">{title}</div>
        <span className="family-demo-badge">{DEMO_BADGE}</span>
      </div>
      <div className="pec-chart-context">Campo Grande (MS) · 2026 · Unidade: {unit} · Fonte: exemplo local</div>
      <div style={{ height }}>
        <ResponsiveContainer>
          <BarChart
            data={rows}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ left: horizontal ? 8 : 0, right: 20, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
            {horizontal ? (
              <>
                <XAxis type="number" tick={axis} tickFormatter={formatNumber} />
                <YAxis type="category" dataKey={categoryKey} tick={axis} width={134} />
              </>
            ) : (
              <>
                <XAxis dataKey={categoryKey} tick={axis} />
                <YAxis tick={axis} tickFormatter={formatNumber} width={74} />
              </>
            )}
            <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " " + unit} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey={valueKey} name={unit} fill={color} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function DemonstrativePanel({ panel }) {
  return (
    <section className="family-demo-panel" aria-label={panel.title}>
      <h2 className="family-section-heading">{panel.title}</h2>
      <p className="family-demo-note">
        Estes números são exemplos locais para demonstrar a organização do tema. Não são registros oficiais nem dados operacionais.
      </p>
      <div className="family-demo-metrics">
        {panel.data.metrics.map((metric, index) => (
          <DemoMetric
            key={metric.label}
            icon={panel.icons[index % panel.icons.length]}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
          />
        ))}
      </div>
      <div className="pec-top-row">
        <DemoChart
          title={panel.monthlyTitle}
          rows={panel.data.monthly}
          categoryKey={panel.monthlyCategory}
          valueKey={panel.monthlyKey}
          unit={panel.monthlyUnit}
          color="#0a4f9f"
        />
        <DemoChart
          title={panel.breakdownTitle}
          rows={panel.data.byService || panel.data.byFair || panel.data.byTheme}
          categoryKey={panel.breakdownCategory}
          valueKey={panel.breakdownKey}
          unit={panel.breakdownUnit}
          horizontal
          color="#16845b"
        />
      </div>
    </section>
  );
}

export default function AgriculturaFamiliarPage() {
  const [month, setMonth] = useState(null);
  const [theme, setTheme] = useState("hortas");
  const selected = month ? [month] : months;
  const rows = mudasRows.filter((row) => selected.includes(row.periodo));
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
                rows={rows}
                period={periodText}
                unit="entregas registradas; bandejas; mudas"
                note="Registros conferidos das abas mensais. Entregas registradas não representam necessariamente pessoas únicas. O painel resumo da planilha diverge dos lançamentos mensais."
              />
              <div className="pec-resumo-row">
                <StatCard icon={ClipboardList} label="Entregas registradas" value={formatNumber(total("entregas"))} detail={periodText} />
                <StatCard icon={Boxes} label="Bandejas entregues" value={formatNumber(total("bandejas"))} detail={periodText} />
                <StatCard icon={Sprout} label="Mudas entregues" value={formatNumber(total("mudas"))} detail={periodText} />
              </div>
              <div className="pec-top-row">
                <section className="pec-card">
                  <div className="pec-card-title">Entregas registradas por mês · {periodText}</div>
                  <div className="pec-chart-context">Unidade: entregas · Campo Grande (MS)</div>
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
                  <div className="pec-card-title">Mudas e bandejas por mês · {periodText}</div>
                  <div className="pec-chart-context">Escalas separadas: mudas (unidades) e bandejas (bandejas) · Campo Grande (MS)</div>
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={byMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis dataKey="mes" tick={axis} />
                        <YAxis yAxisId="mudas" tick={axis} tickFormatter={formatNumber} width={62} />
                        <YAxis yAxisId="bandejas" orientation="right" tick={axis} />
                        <Tooltip formatter={(value, name) => [value == null ? "Sem dado" : formatNumber(value), name]} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar yAxisId="mudas" dataKey="mudas" name="Mudas · unidades" fill="#0a4f9f" isAnimationActive={false} />
                        <Bar yAxisId="bandejas" dataKey="bandejas" name="Bandejas · bandejas" fill="#9b7100" isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>
              <div className="pec-top-row">
                <section className="pec-card">
                  <div className="pec-card-title">Bandejas por cultura · {periodText}</div>
                  <div className="pec-chart-context">Unidade: bandejas · Campo Grande (MS) · fonte municipal</div>
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
                <section className="pec-card">
                  <div className="pec-card-title">Resumo mensal · {periodText}</div>
                  <div className="pec-table-scroll">
                    <table className="pec-table">
                      <thead><tr><th>Mês</th><th className="num">Entregas</th><th className="num">Bandejas</th><th className="num">Mudas</th></tr></thead>
                      <tbody>{byMonth.map((row) => <tr key={row.period}><td>{row.mes}</td><td className="num">{formatNumber(row.entregas)}</td><td className="num">{formatNumber(row.bandejas)}</td><td className="num">{formatNumber(row.mudas)}</td></tr>)}</tbody>
                      <tfoot><tr><td>Total</td><td className="num">{formatNumber(total("entregas"))}</td><td className="num">{formatNumber(total("bandejas"))}</td><td className="num">{formatNumber(total("mudas"))}</td></tr></tfoot>
                    </table>
                  </div>
                </section>
              </div>
              <section className="pec-card">
                <div className="pec-card-title">Bandejas por cultura · detalhamento · {periodText}</div>
                <div className="pec-table-scroll">
                  <table className="pec-table">
                    <thead><tr><th>Cultura</th><th className="num">Bandejas</th></tr></thead>
                    <tbody>{cultures.map((row) => <tr key={row.cultura}><td>{row.cultura}</td><td className="num">{formatNumber(row.bandejas)}</td></tr>)}</tbody>
                    <tfoot><tr><td>Total das culturas</td><td className="num">{formatNumber(sumAvailable(cultures.map((row) => row.bandejas)))}</td></tr></tfoot>
                  </table>
                </div>
              </section>
            </div>
          ) : (
            <DemonstrativePanel panel={DEMO_PANELS[theme]} />
          )}
        </div>
      </div>
    </>
  );
}
