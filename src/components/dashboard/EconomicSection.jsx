import React, { useState, useRef, useEffect } from "react";
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
import { Building2, Users, ChevronDown } from "lucide-react";
import StatCard from "../ui/StatCard";
import { economicDataByYear } from "../../data/economia";

const nf = new Intl.NumberFormat("pt-BR");
const toInt = (s) => {
  const n = parseInt(String(s).replace(/\./g, "").replace(/[^\d-]/g, ""), 10);
  return Number.isNaN(n) ? null : n;
};
const fmtSaldo = (v) => `${v > 0 ? "+" : ""}${nf.format(v)}`;

// Cores do comparativo MS × CG (já na identidade: azul + amarelo; saldo negativo → vermelho).
const EMP_MS = "#062a78";
const EMP_CG = "#93c5fd";
const JOB_MS = "#efbb07";
const JOB_CG = "#f0d473";
const NEG = "#ef4444";

// Pequeno dropdown de ano (padrão visual .ui-dd-* do site, mas sem opção "todos").
function YearDropdown({ year, years, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);
  return (
    <div className="ui-dropdown" ref={ref}>
      <button type="button" className={`ui-dd-toggle${open ? " open" : ""}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{year}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul className="ui-dd-menu" role="listbox">
          {years.map((y) => (
            <li key={y}>
              <button type="button" className={`ui-dd-item${y === year ? " active" : ""}`} onClick={() => { onChange(y); setOpen(false); }}>
                {y}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function EconomicSection() {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState(null); // null = ano inteiro
  const years = Object.keys(economicDataByYear);
  const yd = economicDataByYear[year];
  const data = yd.chartData;
  const ind = yd.indicators;

  const sum = (k) => data.reduce((a, d) => a + (d[k] || 0), 0);
  const sel = month ? data.find((d) => d.month === month) : null;

  // Valores dos cards: mês clicado → aquele mês; senão → ano (empresas somadas;
  // empregos do valor oficial anual, que evita o ruído de Dez na fonte).
  const v = sel
    ? { empCG: sel.empCG, empMS: sel.empMS, jobCG: sel.jobCG, jobMS: sel.jobMS }
    : {
        empCG: sum("empCG"),
        empMS: toInt(ind.companies.value) ?? sum("empMS"),
        jobCG: sum("jobCG"),
        jobMS: toInt(ind.jobs.value) ?? sum("jobMS"),
      };

  const escopo = sel ? `${month}/${year}` : "no ano";
  const periodo = sel ? `${month}/${year}` : yd.period;

  const cards = [
    { icon: Building2, label: "Empresas abertas · Campo Grande", value: nf.format(v.empCG), detail: escopo },
    { icon: Building2, label: "Empresas abertas · Mato Grosso do Sul", value: nf.format(v.empMS), detail: escopo },
    { icon: Users, label: "Empregos · saldo · Campo Grande", value: fmtSaldo(v.jobCG), detail: escopo },
    { icon: Users, label: "Empregos · saldo · Mato Grosso do Sul", value: fmtSaldo(v.jobMS), detail: escopo },
  ];

  // Destaques anuais (Crescimento e Posição) — só quando há dado.
  const destaques = [
    ind.growth.value && ind.growth.value !== "-" && { label: "Crescimento", value: ind.growth.value, link: ind.growth.link },
    ind.nationalPosition.value && ind.nationalPosition.value !== "-" && { label: "Posição nacional", value: ind.nationalPosition.value, link: ind.nationalPosition.link },
  ].filter(Boolean);

  const onChartClick = (e) => {
    const m = e && e.activeLabel;
    if (m) setMonth((cur) => (cur === m ? null : m));
  };
  const dim = (m) => (month && m !== month ? 0.32 : 1);

  return (
    <section className="economic-section">
      {/* ── Desenvolvimento Econômico (em cima) ── */}
      <div className="econ-head">
        <div className="econ-head-text">
          <h3 className="economic-title">Desenvolvimento Econômico</h3>
          <p className="economic-period">
            {periodo}
            {sel && (
              <button type="button" className="econ-clear" onClick={() => setMonth(null)}>
                ver o ano inteiro
              </button>
            )}
          </p>
        </div>
        <div className="econ-year">
          <span className="econ-year-label">Ano:</span>
          <YearDropdown year={year} years={years} onChange={(y) => { setYear(y); setMonth(null); }} />
        </div>
      </div>

      <div className="econ-stats">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} detail={c.detail} />
        ))}
      </div>

      {destaques.length > 0 && (
        <p className="econ-summary">
          Destaques de {year}:
          {destaques.map((d) => (
            <span key={d.label} className="econ-summary-item">
              {" "}
              {d.label}:{" "}
              {d.link ? (
                <a href={d.link} target="_blank" rel="noopener noreferrer">{d.value}</a>
              ) : (
                <b>{d.value}</b>
              )}
            </span>
          ))}
        </p>
      )}

      {/* ── Visualização Econômica (embaixo, maior) ── */}
      <div className="economic-card chart-card">
        <div className="chart-header">
          <h3 className="economic-title">Visualização Econômica</h3>
          <p className="economic-subtitle">
            Comparativo mensal — Mato Grosso do Sul e Campo Grande · <em>clique num mês para filtrar os cards acima</em>
          </p>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }} barCategoryGap="20%" barGap={4} onClick={onChartClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#374151", fontSize: 11 }} />
              <YAxis tick={{ fill: "#374151", fontSize: 11 }} tickFormatter={(val) => nf.format(val)} />
              <Tooltip
                formatter={(value) => (value === null || value === undefined ? "-" : nf.format(value))}
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                cursor={{ fill: "rgba(10,79,159,0.05)" }}
              />
              <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 8 }} />

              <Bar dataKey="empMS" name="Empresas Abertas MS" barSize={12} fill={EMP_MS}>
                {data.map((d) => <Cell key={`eMS-${d.month}`} fill={EMP_MS} fillOpacity={dim(d.month)} />)}
              </Bar>
              <Bar dataKey="empCG" name="Empresas Abertas em CG" barSize={12} fill={EMP_CG}>
                {data.map((d) => <Cell key={`eCG-${d.month}`} fill={EMP_CG} fillOpacity={dim(d.month)} />)}
              </Bar>
              <Bar dataKey="jobMS" name="Empregos Formais MS (Saldo)" barSize={12} fill={JOB_MS}>
                {data.map((d) => <Cell key={`jMS-${d.month}`} fill={d.jobMS < 0 ? NEG : JOB_MS} fillOpacity={dim(d.month)} />)}
              </Bar>
              <Bar dataKey="jobCG" name="Empregos Formais em CG (Saldo)" barSize={12} fill={JOB_CG}>
                {data.map((d) => <Cell key={`jCG-${d.month}`} fill={d.jobCG < 0 ? NEG : JOB_CG} fillOpacity={dim(d.month)} />)}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-footer">
          <p className="economic-source">
            Fonte: <a href="https://www.funtrab.ms.gov.br" target="_blank" rel="noopener noreferrer">FUNTRAB / CAGED</a>
          </p>
        </div>
      </div>
    </section>
  );
}
