import React, { useState } from "react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Banknote, Sprout, Wheat } from "lucide-react";
import FilterDropdown from "../../ui/FilterDropdown";
import StatCard from "../../ui/StatCard";
import SourceMeta from "../../ui/SourceMeta";
import { pamProdutos, pamTotais, metaIbge } from "../../../data/observatorio";
import { milReaisParaReais } from "../../../data/fontesOficiais";
import { formatMoney, formatNumber, unique, sumAvailable } from "../../../data/observatorioCsv";

// PAM/IBGE: a fonte publica o valor da produção em MIL REAIS. Cartões e gráficos
// convertem para reais uma única vez (milReaisParaReais); a tabela mantém mil R$.
const years = unique(pamTotais.map((row) => row.ano));
const latest = years.at(-1);
const products = unique(pamProdutos.map((row) => row.produto));
const axis = { fill: "#6b7280", fontSize: 11 };
// Célula ausente: mostra o símbolo original do IBGE em vez de inventar zero.
const cell = (value, marker, format = formatNumber) => value != null ? format(value) : marker ? `${marker} (IBGE)` : "Sem dado";

export default function Agricultura({ tab = "produto" }) {
  const [year, setYear] = useState(null);
  const [product, setProduct] = useState(null);
  const chosen = year || latest;
  const total = pamTotais.find((row) => row.ano === chosen);
  const productRows = pamProdutos
    .filter((row) => row.ano === chosen && (!product || row.produto === product))
    .map((row) => ({
      produto: row.produto,
      area: row.area_plantada_ha,
      areaMarker: row.marcador_area_plantada_ibge,
      quantidade: row.quantidade_produzida,
      unidade: row.unidade_quantidade,
      quantidadeMarker: row.marcador_quantidade_ibge,
      valorMil: row.valor_producao_mil_reais,
      valorMarker: row.marcador_valor_ibge,
    }));
  const selected = product ? productRows[0] : null;
  const valueMil = product ? selected?.valorMil ?? null : total?.valor_producao_mil_reais ?? null;
  const area = product ? selected?.area ?? null : total?.area_plantada_ha ?? null;
  const chartRows = [...productRows].sort((a, b) => (b.area ?? -1) - (a.area ?? -1)).slice(0, 12);
  const history = years.map((ano) => {
    const row = product ? pamProdutos.find((r) => r.ano === ano && r.produto === product) : pamTotais.find((r) => r.ano === ano);
    return { ano, valor: milReaisParaReais(row?.valor_producao_mil_reais ?? null), area: row?.area_plantada_ha ?? null };
  });
  const productTotalMil = sumAvailable(productRows.map((row) => row.valorMil));
  const productArea = sumAvailable(productRows.map((row) => row.area));
  const metaRows = metaIbge(product ? pamProdutos.filter((row) => row.ano === chosen && row.produto === product) : [total].filter(Boolean), "IBGE PAM · SIDRA 5457");
  return <div className="agr-page">
    <div className="agr-filters">
      <div className="agr-filter"><span className="agr-filter-label">Produto:</span><FilterDropdown allLabel="Todos os produtos" options={products} value={product} onChange={setProduct} minWidth="13rem"/></div>
      <div className="agr-filter"><span className="agr-filter-label">Ano:</span><FilterDropdown allLabel={latest} options={years} value={year} onChange={setYear}/></div>
    </div>
    <SourceMeta rows={metaRows} period={chosen} unit="valor da produção em mil R$ na fonte (cartões e gráficos convertidos para R$); área em hectares; quantidade na unidade de cada produto" note="Cartões gerais usam o total oficial da PAM. A área é soma de áreas por cultura, não área física única (cultivos podem ocupar a mesma terra em momentos diferentes). Símbolos do IBGE (ex.: “-”) são exibidos como na fonte; ausência não é convertida em zero."/>
    <div className="agr-resumo-row">
      <StatCard icon={Banknote} label={`Valor da produção · ${product || "total"}`} value={valueMil == null ? cell(null, selected?.valorMarker) : formatMoney(milReaisParaReais(valueMil))} detail={valueMil == null ? chosen : `${formatNumber(valueMil)} mil R$ · ${chosen}`}/>
      <StatCard icon={Sprout} label={`Área plantada ou destinada à colheita · ${product || "total"}`} value={area == null ? cell(null, selected?.areaMarker) : `${formatNumber(area)} ha`} detail={chosen}/>
      <StatCard icon={Wheat} label="Produtos no recorte" value={formatNumber(productRows.length)} detail={chosen}/>
    </div>
    {tab === "produto" ? <>
      <section className="agr-card"><div className="agr-card-title">Área por produto · {chosen}</div><div style={{ height: 420 }}><ResponsiveContainer><BarChart data={chartRows} layout="vertical" margin={{ right: 32, left: 20 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis type="number" tick={axis} tickFormatter={formatNumber}/><YAxis type="category" dataKey="produto" width={150} tick={axis}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} ha`}/><Bar dataKey="area" fill="#0a4f9f" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      <section className="agr-card"><div className="agr-card-title">Produtos · {chosen}</div><div className="agr-table-scroll"><table className="agr-table"><thead><tr><th>Produto</th><th className="num">Área plantada (ha)</th><th className="num">Quantidade produzida</th><th className="num">Valor (mil R$)</th></tr></thead><tbody>{[...productRows].sort((a, b) => (b.valorMil ?? -1) - (a.valorMil ?? -1)).map((row) => <tr key={row.produto}><td className="agr-td-name">{row.produto}</td><td className="num">{cell(row.area, row.areaMarker)}</td><td className="num">{row.quantidade == null ? cell(null, row.quantidadeMarker) : `${formatNumber(row.quantidade)} ${row.unidade.toLowerCase()}`}</td><td className="num">{cell(row.valorMil, row.valorMarker)}</td></tr>)}</tbody><tfoot><tr><td>{product ? "Total do produto" : productTotalMil === total?.valor_producao_mil_reais ? `Soma dos produtos · confere com o total oficial PAM ${chosen}` : `Soma dos produtos · total oficial PAM ${chosen}: ${formatNumber(total?.valor_producao_mil_reais)} mil R$`}</td><td className="num">{formatNumber(productArea)}</td><td className="num">—</td><td className="num">{formatNumber(productTotalMil)}</td></tr></tfoot></table></div></section>
    </> : <div className="agr-evo-grid">
      <section className="agr-card"><div className="agr-card-title">Valor da produção por ano (R$) · {product || "total da PAM"}</div><div style={{ height: 320 }}><ResponsiveContainer><BarChart data={history}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="ano" tick={axis}/><YAxis tick={axis} tickFormatter={formatNumber} width={100}/><Tooltip formatter={formatMoney}/><Bar dataKey="valor" fill="#0a4f9f" isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
      <section className="agr-card"><div className="agr-card-title">Área plantada por ano · {product || "total da PAM"}</div><div style={{ height: 320 }}><ResponsiveContainer><AreaChart data={history}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7"/><XAxis dataKey="ano" tick={axis}/><YAxis tick={axis} tickFormatter={formatNumber} width={70}/><Tooltip formatter={(v) => v == null ? "Sem dado" : `${formatNumber(v)} ha`}/><Area dataKey="area" stroke="#0a4f9f" fill="#dbeafe" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div></section>
    </div>}
  </div>;
}
