import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sprout, Boxes, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import FilterDropdown from "../components/ui/FilterDropdown";
import SourceMeta from "../components/ui/SourceMeta";
import { mudasRows } from "../data/observatorio";
import { formatNumber, sumAvailable, unique, valueOf } from "../data/observatorioCsv";
import "../styles/Pecuaria.css";
import "../styles/AgriculturaFamiliar.css";

const months = unique(mudasRows.map((row) => row.periodo));
const monthBR = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
const monthLabel = (period) => monthBR.format(new Date(`${period}-01T00:00:00Z`));
const axis = { fill: "#6b7280", fontSize: 11 };

export default function AgriculturaFamiliarPage() {
  const [month, setMonth] = useState(null);
  const selected = month ? [month] : months;
  const rows = mudasRows.filter((row) => selected.includes(row.periodo));
  const byMonth = selected.map((period) => ({
    period, mes: monthLabel(period),
    entregas: valueOf(rows, "entregas_registradas", period, "Total"),
    bandejas: valueOf(rows, "bandejas_entregues", period, "Total"),
    mudas: valueOf(rows, "mudas_entregues", period, "Total"),
  }));
  const cultures = unique(rows.filter((row) => row.indicador === "bandejas_por_cultura").map((row) => row.categoria))
    .map((name) => ({ cultura: name, bandejas: sumAvailable(rows.filter((row) => row.indicador === "bandejas_por_cultura" && row.categoria === name).map((row) => row.valor)) }))
    .sort((a, b) => (b.bandejas ?? -1) - (a.bandejas ?? -1));
  const total = (key) => sumAvailable(byMonth.map((row) => row[key]));
  const periodText = month ? monthLabel(month) : "janeiro a julho de 2026";
  return <>
    <div className="pec-back-wrap"><Link to="/dashboard" className="pec-back"><ArrowLeft size={18} aria-hidden="true"/>Voltar aos indicadores</Link></div>
    <PageHeader title="Agricultura familiar" subtitle="Entregas de mudas em Campo Grande · registros conferidos de 2026"/>
    <div className="family-page">
      <div className="pec-filter"><span className="pec-filter-label">Mês:</span><FilterDropdown allLabel="Janeiro a julho de 2026" options={months} value={month} onChange={setMonth} formatOption={monthLabel}/></div>
      <SourceMeta rows={rows} period={periodText} unit="entregas registradas; bandejas; mudas" note="Registros conferidos das abas mensais. Entregas registradas não representam necessariamente pessoas únicas. O painel resumo da planilha diverge dos lançamentos mensais."/>
      <div className="pec-resumo-row">
        <StatCard icon={ClipboardList} label="Entregas registradas" value={formatNumber(total("entregas"))} detail={periodText}/>
        <StatCard icon={Boxes} label="Bandejas entregues" value={formatNumber(total("bandejas"))} detail={periodText}/>
        <StatCard icon={Sprout} label="Mudas entregues" value={formatNumber(total("mudas"))} detail={periodText}/>
      </div>
      <div className="pec-top-row">
        <section className="pec-card"><div className="pec-card-title">Entregas registradas por mês</div><div style={{ height: 300 }}><ResponsiveContainer><BarChart data={byMonth}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="mes" tick={axis}/><YAxis tick={axis}/><Tooltip formatter={formatNumber}/><Bar dataKey="entregas" fill="#0a4f9f" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
        <section className="pec-card"><div className="pec-card-title">Mudas e bandejas por mês</div><div style={{ height: 300 }}><ResponsiveContainer><BarChart data={byMonth}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="mes" tick={axis}/><YAxis yAxisId="mudas" tick={axis} tickFormatter={formatNumber} width={62}/><YAxis yAxisId="bandejas" orientation="right" tick={axis}/><Tooltip formatter={formatNumber}/><Bar yAxisId="mudas" dataKey="mudas" name="Mudas" fill="#0a4f9f" isAnimationActive={false}/><Bar yAxisId="bandejas" dataKey="bandejas" name="Bandejas" fill="#efbb07" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      </div>
      <div className="pec-top-row">
        <section className="pec-card"><div className="pec-card-title">Bandejas por cultura · {periodText}</div><div style={{ height: 340 }}><ResponsiveContainer><BarChart data={cultures} layout="vertical" margin={{ left: 20, right: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis type="number" tick={axis}/><YAxis type="category" dataKey="cultura" tick={axis} width={118}/><Tooltip formatter={formatNumber}/><Bar dataKey="bandejas" fill="#0a4f9f" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
        <section className="pec-card"><div className="pec-card-title">Resumo por mês · {periodText}</div><div className="pec-table-scroll"><table className="pec-table"><thead><tr><th>Mês</th><th className="num">Entregas registradas</th><th className="num">Bandejas</th><th className="num">Mudas</th></tr></thead><tbody>{byMonth.map((row) => <tr key={row.period}><td>{row.mes}</td><td className="num">{formatNumber(row.entregas)}</td><td className="num">{formatNumber(row.bandejas)}</td><td className="num">{formatNumber(row.mudas)}</td></tr>)}</tbody><tfoot><tr><td>Total</td><td className="num">{formatNumber(total("entregas"))}</td><td className="num">{formatNumber(total("bandejas"))}</td><td className="num">{formatNumber(total("mudas"))}</td></tr></tfoot></table></div></section>
      </div>
      <section className="pec-card"><div className="pec-card-title">Bandejas por cultura · detalhamento</div><div className="pec-table-scroll"><table className="pec-table"><thead><tr><th>Cultura</th><th className="num">Bandejas</th></tr></thead><tbody>{cultures.map((row) => <tr key={row.cultura}><td>{row.cultura}</td><td className="num">{formatNumber(row.bandejas)}</td></tr>)}</tbody><tfoot><tr><td>Total das culturas</td><td className="num">{formatNumber(sumAvailable(cultures.map((row) => row.bandejas)))}</td></tr></tfoot></table></div></section>
    </div>
  </>;
}
