import React, { useState } from "react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Banknote, Sprout, Wheat } from "lucide-react";
import FilterDropdown from "../../ui/FilterDropdown";
import StatCard from "../../ui/StatCard";
import SourceMeta from "../../ui/SourceMeta";
import { lavouraRows } from "../../../data/observatorio";
import { formatMoney, formatNumber, unique, valueOf, sumAvailable } from "../../../data/observatorioCsv";

const years = unique(lavouraRows.map((row) => row.periodo));
const products = unique(lavouraRows.filter((row) => row.categoria !== "Total").map((row) => row.categoria));
const axis = { fill: "#6b7280", fontSize: 11 };

export default function Agricultura({ tab = "produto" }) {
  const [year, setYear] = useState("2024");
  const [product, setProduct] = useState(null);
  const chosen = year || "2024";
  const current = lavouraRows.filter((row) => row.periodo === chosen && (row.categoria === "Total" || !product || row.categoria === product));
  const productRows = products.map((name) => ({
    produto: name,
    area: valueOf(lavouraRows, "area_plantada_ou_destinada_colheita", chosen, name),
    valor: valueOf(lavouraRows, "valor_producao", chosen, name),
  })).filter((row) => row.area != null || row.valor != null).filter((row) => !product || row.produto === product);
  const chartRows = [...productRows].sort((a, b) => (b.area ?? -1) - (a.area ?? -1)).slice(0, 12);
  const value = product ? valueOf(lavouraRows, "valor_producao", chosen, product) : valueOf(lavouraRows, "valor_producao", chosen, "Total");
  const area = product ? valueOf(lavouraRows, "area_plantada_ou_destinada_colheita", chosen, product) : valueOf(lavouraRows, "area_plantada_ou_destinada_colheita", chosen, "Total");
  const history = years.map((ano) => ({
    ano,
    valor: valueOf(lavouraRows, "valor_producao", ano, product || "Total"),
    area: valueOf(lavouraRows, "area_plantada_ou_destinada_colheita", ano, product || "Total"),
  }));
  const productTotal = sumAvailable(productRows.map((row) => row.valor));
  const productArea = sumAvailable(productRows.map((row) => row.area));
  return <div className="agr-page">
    <div className="agr-filters">
      <div className="agr-filter"><span className="agr-filter-label">Produto:</span><FilterDropdown allLabel="Todos os produtos" options={products} value={product} onChange={setProduct} minWidth="13rem"/></div>
      <div className="agr-filter"><span className="agr-filter-label">Ano:</span><FilterDropdown allLabel="2024" options={years} value={year} onChange={setYear}/></div>
    </div>
    <SourceMeta rows={current} period={chosen} unit="R$; hectares (ha)" note="Cartões gerais usam as linhas Total da PAM. Produtos usam apenas linhas de produto; a área é soma de áreas por cultura, não área física única. Sem dado não equivale a zero."/>
    <div className="agr-resumo-row">
      <StatCard icon={Banknote} label={`Valor da produção · ${product || "total"}`} value={formatMoney(value)} detail={chosen}/>
      <StatCard icon={Sprout} label={`Área plantada ou destinada à colheita · ${product || "total"}`} value={area == null ? "Sem dado" : `${formatNumber(area)} ha`} detail={chosen}/>
      <StatCard icon={Wheat} label="Produtos no recorte" value={formatNumber(productRows.length)} detail={chosen}/>
    </div>
    {tab === "produto" ? <>
      <section className="agr-card"><div className="agr-card-title">Área por produto · {chosen}</div><div style={{ height: 420 }}><ResponsiveContainer><BarChart data={chartRows} layout="vertical" margin={{ right: 32, left: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis type="number" tick={axis} tickFormatter={formatNumber}/><YAxis type="category" dataKey="produto" width={150} tick={axis}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} ha`}/><Bar dataKey="area" fill="#0a4f9f" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      <section className="agr-card"><div className="agr-card-title">Produtos · {chosen}</div><div className="agr-table-scroll"><table className="agr-table"><thead><tr><th>Produto</th><th className="num">Área (ha)</th><th className="num">Valor (R$)</th></tr></thead><tbody>{productRows.sort((a, b) => (b.valor ?? -1) - (a.valor ?? -1)).map((row) => <tr key={row.produto}><td className="agr-td-name">{row.produto}</td><td className="num">{formatNumber(row.area)}</td><td className="num">{formatMoney(row.valor)}</td></tr>)}</tbody><tfoot><tr><td>Total dos produtos exibidos</td><td className="num">{formatNumber(productArea)}</td><td className="num">{formatMoney(productTotal)}</td></tr></tfoot></table></div></section>
    </> : <div className="agr-evo-grid">
      <section className="agr-card"><div className="agr-card-title">Valor da produção por ano · {product || "total da PAM"}</div><div style={{ height: 320 }}><ResponsiveContainer><BarChart data={history}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="ano" tick={axis}/><YAxis tick={axis} tickFormatter={formatNumber} width={90}/><Tooltip formatter={formatMoney}/><Bar dataKey="valor" fill="#0a4f9f" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      <section className="agr-card"><div className="agr-card-title">Área por ano · {product || "total da PAM"}</div><div style={{ height: 320 }}><ResponsiveContainer><AreaChart data={history}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="ano" tick={axis}/><YAxis tick={axis} tickFormatter={formatNumber} width={70}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} ha`}/><Area dataKey="area" stroke="#0a4f9f" fill="#dbeafe" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div></section>
    </div>}
    {years.length === 1 && tab !== "produto" && <p className="agr-source">O CSV da PAM contém apenas {years[0]}; a série será ampliada quando houver outros anos.</p>}
  </div>;
}
