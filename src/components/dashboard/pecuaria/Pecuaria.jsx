import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Beef, Layers, Scale, CalendarDays } from "lucide-react";
import StatCard from "../../ui/StatCard";
import FilterDropdown from "../../ui/FilterDropdown";
import SourceMeta from "../../ui/SourceMeta";
import { ppmRows as ppmSource, abateRows, metaIbge } from "../../../data/observatorio";
import { PPM_CINCO_ESPECIES, PPM_SUBCATEGORIAS } from "../../../data/fontesOficiais";
import { formatNumber, sumAvailable, unique } from "../../../data/observatorioCsv";

// PPM/IBGE 2015–2024 no formato usado pelo painel (periodo/categoria/valor).
const ppmRows = ppmSource.map((row) => ({ periodo: row.ano, categoria: row.especie, valor: row.cabecas, marcador: row.marcador_ibge }));
const years = unique(ppmRows.map((row) => row.periodo));
const latestYear = years.at(-1);
const mainSpecies = unique(ppmSource.filter((row) => !row.subcategoria_de).map((row) => row.especie));
const markerText = (row) => row?.marcador ? `${row.marcador} (IBGE)` : "Sem dado";
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
  const [year, setYear] = useState(null);
  const [animal, setAnimal] = useState(null);
  const chosen = year || latestYear;
  const inYear = ppmRows.filter((row) => row.periodo === chosen);
  const selection = animal ? [animal] : PPM_CINCO_ESPECIES;
  const current = inYear.filter((row) => selection.includes(row.categoria));
  const chart = current.map((row) => ({ animal: row.categoria, quantidade: row.valor }));
  const total = sumAvailable(current.map((row) => row.valor));
  const history = years.map((ano) => ({ ano, quantidade: sumAvailable(ppmRows.filter((row) => row.periodo === ano && selection.includes(row.categoria)).map((row) => row.valor)) }));
  // Tabela: espécies principais e, logo abaixo da espécie-mãe, as subcategorias (nunca somadas).
  const tableRows = (animal ? [animal] : mainSpecies).flatMap((name) => [
    { name, row: inYear.find((row) => row.categoria === name), sub: false },
    ...Object.entries(PPM_SUBCATEGORIAS).filter(([, parent]) => parent === name).map(([child]) => ({ name: child, row: inYear.find((row) => row.categoria === child), sub: true })),
  ]);
  return <div className="pec-tab-panel">
    <div className="pec-filters"><Chips options={mainSpecies} value={animal} onChange={setAnimal} allLabel="Cinco espécies" />
      <div className="pec-filter"><span className="pec-filter-label">Ano:</span><FilterDropdown allLabel={latestYear} options={years} value={year} onChange={setYear} /></div></div>
    <SourceMeta rows={metaIbge(ppmSource.filter((row) => row.ano === chosen), "IBGE PPM · SIDRA 3939")} period={chosen} unit="cabeças" note={`Total “cinco espécies”: bovino, suíno (total), caprino, ovino e galináceos (total). Galinhas estão contidas em galináceos e matrizes em suínos; essas subcategorias aparecem na tabela, mas não entram em somas. Bubalino, equino e codornas podem ser vistos individualmente. PPM disponível até ${latestYear}; símbolos do IBGE são exibidos como na fonte.`} />
    <div className="pec-resumo-row"><StatCard icon={Layers} label={`${animal || "Cinco espécies do painel"} · ${chosen}`} value={total == null ? markerText(current[0]) : formatNumber(total)} detail="cabeças" />
      <StatCard icon={Beef} label="Espécies exibidas" value={formatNumber(current.length)} /><StatCard icon={CalendarDays} label="Série histórica" value={`${years[0]}–${years.at(-1)}`} /></div>
    <div className="pec-top-row">
      <section className="pec-card"><div className="pec-card-title">Rebanho por espécie · {chosen}</div><div style={{ height: 300 }}><ResponsiveContainer><BarChart data={chart} layout="vertical" margin={{ right: 32 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis type="number" tick={axis} tickFormatter={formatNumber}/><YAxis type="category" dataKey="animal" width={120} tick={axis}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} cabeças`}/><Bar dataKey="quantidade" fill="#0a4f9f" radius={[0, 4, 4, 0]} isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      <section className="pec-card"><div className="pec-card-title">Evolução histórica · {animal || "cinco espécies"}</div><div style={{ height: 300 }}><ResponsiveContainer><LineChart data={history} margin={{ right: 16 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="ano" tick={axis}/><YAxis tick={axis} tickFormatter={formatNumber} width={72}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} cabeças`}/><Line dataKey="quantidade" stroke="#0a4f9f" strokeWidth={2.5} isAnimationActive={false}/></LineChart></ResponsiveContainer></div></section>
    </div>
    <section className="pec-card"><div className="pec-card-title">Efetivo por espécie · {chosen} · cabeças</div><div className="pec-table-scroll"><table className="pec-table"><thead><tr><th>Espécie</th><th className="num">{chosen}</th></tr></thead><tbody>{tableRows.map(({ name, row, sub }) => <tr key={name}><td className="pec-td-name">{sub ? `↳ ${name} (contido no total acima; fora da soma)` : `${name}${!animal && !PPM_CINCO_ESPECIES.includes(name) ? " (fora da soma)" : ""}`}</td><td className="num">{row?.valor == null ? markerText(row) : formatNumber(row.valor)}</td></tr>)}</tbody><tfoot><tr><td>{animal ? "Total da seleção" : "Soma das cinco espécies"}</td><td className="num">{formatNumber(total)}</td></tr></tfoot></table></div></section>
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
