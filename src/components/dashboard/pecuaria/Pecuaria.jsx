import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Beef, Layers, Scale, CalendarDays } from "lucide-react";
import StatCard from "../../ui/StatCard";
import FilterDropdown from "../../ui/FilterDropdown";
import SourceMeta from "../../ui/SourceMeta";
import { rebanhoRows, abateRows } from "../../../data/observatorio";
import { formatNumber, sumAvailable, unique, valueOf } from "../../../data/observatorioCsv";

const years = unique(rebanhoRows.map((row) => row.periodo));
const species = unique(rebanhoRows.map((row) => row.categoria));
const abateYears = unique(abateRows.map((row) => row.periodo.slice(0, 4)));
const abateSpecies = unique(abateRows.map((row) => row.categoria));
const monthBR = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
const monthLabel = (period) => monthBR.format(new Date(`${period}-01T00:00:00Z`));
const ton = (kg) => kg == null ? null : kg / 1000;
const formatTon = (kg) => kg == null ? "Sem dado" : `${formatNumber(ton(kg))} t`;
const axis = { fill: "#6b7280", fontSize: 11 };

function Chips({ options, value, onChange, allLabel }) {
  return <div className="pec-filter"><span className="pec-filter-label">Espécie:</span><div className="pec-chips">
    {[null, ...options].map((item) => <button key={item || "all"} type="button" className={`pec-chip${value === item ? " active" : ""}`} aria-pressed={value === item} onClick={() => onChange(item)}>{item || allLabel}</button>)}
  </div></div>;
}

export function RebanhoTab() {
  const [year, setYear] = useState("2024");
  const [animal, setAnimal] = useState(null);
  const chosen = year || "2024";
  const current = rebanhoRows.filter((row) => row.periodo === chosen && (!animal || row.categoria === animal));
  const chart = current.map((row) => ({ animal: row.categoria, quantidade: row.valor }));
  const total = sumAvailable(current.map((row) => row.valor));
  const history = years.map((ano) => ({ ano, quantidade: sumAvailable(rebanhoRows.filter((row) => row.periodo === ano && (!animal || row.categoria === animal)).map((row) => row.valor)) }));
  const tableSpecies = animal ? [animal] : species;
  return <div className="pec-tab-panel">
    <div className="pec-filters"><Chips options={species} value={animal} onChange={setAnimal} allLabel="Cinco espécies" />
      <div className="pec-filter"><span className="pec-filter-label">Ano:</span><FilterDropdown allLabel="2024" options={years} value={year} onChange={setYear} /></div></div>
    <SourceMeta rows={current} period={chosen} unit="cabeças" note="Total: soma apenas de bovinos, suínos, caprinos, ovinos e galináceos da PPM. A evolução mostra a série histórica da seleção de espécie." />
    <div className="pec-resumo-row"><StatCard icon={Layers} label={`${animal || "Cinco espécies do painel"} · ${chosen}`} value={formatNumber(total)} detail="cabeças" />
      <StatCard icon={Beef} label="Espécies exibidas" value={formatNumber(current.length)} /><StatCard icon={CalendarDays} label="Série histórica" value={`${years[0]}–${years.at(-1)}`} /></div>
    <div className="pec-top-row">
      <section className="pec-card"><div className="pec-card-title">Rebanho por espécie · {chosen}</div><div style={{ height: 300 }}><ResponsiveContainer><BarChart data={chart} layout="vertical" margin={{ right: 32 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis type="number" tick={axis} tickFormatter={formatNumber}/><YAxis type="category" dataKey="animal" width={90} tick={axis}/><Tooltip formatter={(v) => `${formatNumber(v)} cabeças`}/><Bar dataKey="quantidade" fill="#0a4f9f" radius={[0, 4, 4, 0]} isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      <section className="pec-card"><div className="pec-card-title">Evolução histórica · {animal || "cinco espécies"}</div><div style={{ height: 300 }}><ResponsiveContainer><LineChart data={history} margin={{ right: 16 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="ano" tick={axis}/><YAxis tick={axis} tickFormatter={formatNumber} width={72}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} cabeças`}/><Line dataKey="quantidade" stroke="#0a4f9f" strokeWidth={2.5} isAnimationActive={false}/></LineChart></ResponsiveContainer></div></section>
    </div>
    <section className="pec-card"><div className="pec-card-title">Efetivo por espécie · {chosen} · cabeças</div><div className="pec-table-scroll"><table className="pec-table"><thead><tr><th>Espécie</th><th className="num">{chosen}</th></tr></thead><tbody>{tableSpecies.map((name) => <tr key={name}><td className="pec-td-name">{name}</td><td className="num">{formatNumber(valueOf(rebanhoRows, "efetivo_rebanho", chosen, name))}</td></tr>)}</tbody><tfoot><tr><td>Total da seleção</td><td className="num">{formatNumber(total)}</td></tr></tfoot></table></div></section>
  </div>;
}

export function AbateTab() {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState(null);
  const [animal, setAnimal] = useState(null);
  const chosen = year || "2025";
  const months = unique(abateRows.filter((row) => row.periodo.startsWith(`${chosen}-`)).map((row) => row.periodo));
  const period = month && months.includes(month) ? month : null;
  const scope = abateRows.filter((row) => row.periodo.startsWith(`${chosen}-`) && (!period || row.periodo === period) && (!animal || row.categoria === animal));
  const animals = animal ? [animal] : abateSpecies;
  const value = (indicator, name, rows = scope) => sumAvailable(rows.filter((row) => row.indicador === indicator && (!name || row.categoria === name)).map((row) => row.valor));
  const byAnimal = animals.map((name) => ({ animal: name, peso: ton(value("peso_carcacas", name)) }));
  const byMonth = (period ? [period] : months).map((m) => { const rows = scope.filter((row) => row.periodo === m); return { period: m, mes: monthLabel(m), peso: ton(value("peso_carcacas", null, rows)), unidades: value("animais_abatidos", null, rows) }; });
  const partial = scope.some((row) => row.situacao_periodo === "parcial_ate_junho");
  const periodText = period ? monthLabel(period) : partial ? `${chosen} · janeiro a junho (parcial_ate_junho)` : `${chosen} · ano completo`;
  const onYear = (next) => { setYear(next); setMonth(null); };
  return <div className="pec-tab-panel">
    <div className="pec-filters"><Chips options={abateSpecies} value={animal} onChange={setAnimal} allLabel="Três espécies" />
      <div className="pec-filter"><span className="pec-filter-label">Ano:</span><FilterDropdown allLabel="2025" options={abateYears} value={year} onChange={onYear}/></div>
      <div className="pec-filter"><span className="pec-filter-label">Mês:</span><FilterDropdown allLabel="Todos os meses disponíveis" options={months} value={period} onChange={setMonth} formatOption={monthLabel}/></div></div>
    <SourceMeta rows={scope} period={periodText} unit="cabeças; peso de carcaças em toneladas (CSV em kg)" note={partial ? "Situação: parcial_ate_junho. O acumulado de 2026 não é comparável diretamente aos anos completos. Local de abate em Mato Grosso do Sul." : "Local de abate em Mato Grosso do Sul; não representa apenas Campo Grande."}/>
    <div className="pec-resumo-row"><StatCard icon={Scale} label={`Peso de carcaças · ${periodText}`} value={formatTon(value("peso_carcacas"))} />
      <StatCard icon={Beef} label={`Animais abatidos · ${animal || "três espécies"}`} value={formatNumber(value("animais_abatidos"))} detail="cabeças" />
      <StatCard icon={CalendarDays} label="Meses no recorte" value={formatNumber(byMonth.length)} detail={partial ? "período parcial" : "período completo"}/></div>
    <div className="pec-top-row">
      <section className="pec-card"><div className="pec-card-title">Peso por espécie · Mato Grosso do Sul · t</div><div style={{ height: 300 }}><ResponsiveContainer><BarChart data={byAnimal} layout="vertical" margin={{ right: 32 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis type="number" tick={axis} tickFormatter={formatNumber}/><YAxis type="category" dataKey="animal" width={80} tick={axis}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} t`}/><Bar dataKey="peso" fill="#0a4f9f" radius={[0, 4, 4, 0]} isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      <section className="pec-card"><div className="pec-card-title">Abate mensal · {animal || "três espécies"} · t</div><div style={{ height: 300 }}><ResponsiveContainer><LineChart data={byMonth} margin={{ right: 16 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="mes" tick={axis}/><YAxis tick={axis} tickFormatter={formatNumber} width={70}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} t`}/><Line dataKey="peso" stroke="#0a4f9f" strokeWidth={2.5} isAnimationActive={false}/></LineChart></ResponsiveContainer></div></section>
    </div>
    <section className="pec-card"><div className="pec-card-title">Abate mês a mês · Mato Grosso do Sul · {periodText}</div><div className="pec-table-scroll"><table className="pec-table"><thead><tr><th>Mês</th><th className="num">Cabeças</th><th className="num">Peso (t)</th></tr></thead><tbody>{byMonth.map((row) => <tr key={row.period}><td>{row.mes}</td><td className="num">{formatNumber(row.unidades)}</td><td className="num">{row.peso == null ? "Sem dado" : formatNumber(row.peso)}</td></tr>)}</tbody><tfoot><tr><td>Total do recorte</td><td className="num">{formatNumber(value("animais_abatidos"))}</td><td className="num">{formatTon(value("peso_carcacas"))}</td></tr></tfoot></table></div></section>
  </div>;
}
