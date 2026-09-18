import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Ship, Package, Scale, CalendarDays } from "lucide-react";
import StatCard from "../../ui/StatCard";
import FilterDropdown from "../../ui/FilterDropdown";
import SourceMeta from "../../ui/SourceMeta";
import { comexMensal, comexCob, loadDetalhe, totalComex, rankComex, formatUsd, formatUsdCompact } from "../../../data/comex";
import { MUNICIPIO_IBGE, MUNICIPIO_MDIC } from "../../../data/fontesOficiais";
import { formatNumber, unique } from "../../../data/observatorioCsv";

// Painel nativo de comércio exterior (Comex Stat/MDIC). Valores em US$ FOB, nunca em reais.
// O mensal alimenta cartões e série; o detalhado (SH4 × país) só os rankings.
const FLUXOS = { exportacao: "Exportação", importacao: "Importação" };
const LOOKER = {
  exportacao: "https://lookerstudio.google.com/reporting/b726ca0c-1ace-468a-822f-4e6bca1a56d7",
  importacao: "https://lookerstudio.google.com/reporting/f63d1dd2-0f38-4580-a7b7-e50e17f4c8d1",
};
const years = unique(comexMensal.map((row) => row.ano));
const latest = years.at(-1);
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const mesLabel = (mes) => MESES[Number(mes) - 1];
const periodoTexto = (ano) => {
  const cob = comexCob[ano];
  return cob.parcial ? `${ano} · jan–${mesLabel(cob.ultimoMes)} (parcial)` : `${ano} · ano completo`;
};
const axis = { fill: "#6b7280", fontSize: 11 };
const EXP = "#0a4f9f";
const IMP = "#2f86d6";
const pct = (a, b) => (b ? `${a >= b ? "+" : ""}${((a / b - 1) * 100).toFixed(1).replace(".", ",")}%` : "—");

export default function ComercioExterior() {
  const [params, setParams] = useSearchParams();
  const fluxo = FLUXOS[params.get("fluxo")] ? params.get("fluxo") : "exportacao";
  const setFluxo = (next) => setParams(next === "exportacao" ? {} : { fluxo: next }, { replace: true });
  const [year, setYear] = useState(null);
  const ano = year || latest;
  const cob = comexCob[ano];
  const [detalhe, setDetalhe] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let active = true;
    loadDetalhe().then((rows) => active && setDetalhe(rows)).catch((e) => active && setErro(e.message));
    return () => { active = false; };
  }, []);

  const doAno = comexMensal.filter((row) => row.ano === ano);
  const exp = totalComex(doAno.filter((row) => row.fluxo === "exportacao"));
  const imp = totalComex(doAno.filter((row) => row.fluxo === "importacao"));
  const atual = fluxo === "exportacao" ? exp : imp;
  // Comparação só com o MESMO intervalo de meses do ano anterior.
  const anterior = String(Number(ano) - 1);
  const mesmoPeriodo = comexCob[anterior]
    ? totalComex(comexMensal.filter((row) => row.ano === anterior && row.fluxo === fluxo && cob.meses.includes(row.mes)))
    : null;
  const serie = cob.meses.map((mes) => ({
    mes: mesLabel(mes),
    exportacao: doAno.find((row) => row.mes === mes && row.fluxo === "exportacao")?.valor_fob_usd ?? null,
    importacao: doAno.find((row) => row.mes === mes && row.fluxo === "importacao")?.valor_fob_usd ?? null,
  }));
  const recorte = useMemo(() => (detalhe || []).filter((row) => row.ano === ano && row.fluxo === fluxo), [detalhe, ano, fluxo]);
  const produtos = useMemo(() => rankComex(recorte, "sh4", "sh4_descricao"), [recorte]);
  const paises = useMemo(() => rankComex(recorte, "pais_codigo", "pais"), [recorte]);
  const meta = doAno.filter((row) => row.fluxo === fluxo).map((row) => ({
    territorio: `Campo Grande (MS) · MDIC ${MUNICIPIO_MDIC} / IBGE ${MUNICIPIO_IBGE}`,
    fonte: `Comex Stat/MDIC · ${row.fluxo === "exportacao" ? "EXP" : "IMP"}_${row.ano}_MUN`,
    fonte_url: row.fonte_url,
    data_extracao: row.data_extracao,
  }));

  return <div className="pec-page">
    <div className="pec-filters">
      <div className="pec-filter"><span className="pec-filter-label">Fluxo:</span><div className="pec-chips">
        {Object.entries(FLUXOS).map(([id, label]) => <button key={id} type="button" className={`pec-chip${fluxo === id ? " active" : ""}`} aria-pressed={fluxo === id} onClick={() => setFluxo(id)}>{label}</button>)}
      </div></div>
      <div className="pec-filter"><span className="pec-filter-label">Ano:</span><FilterDropdown allLabel={periodoTexto(latest)} options={years} value={year} onChange={setYear} formatOption={periodoTexto}/></div>
    </div>
    <SourceMeta rows={meta} period={periodoTexto(ano)} unit="US$ FOB (dólares, não reais); peso em kg líquido, exibido em toneladas" note={`Recorte pelo domicílio fiscal do exportador/importador, não pela origem física da produção. O MDIC identifica Campo Grande/MS pelo código ${MUNICIPIO_MDIC}; o código IBGE do município é ${MUNICIPIO_IBGE}.${cob.parcial ? ` ${ano} é parcial: compare apenas com o mesmo intervalo de ${anterior}, nunca com o ano fechado.` : ""}`}/>
    <div className="pec-resumo-row">
      <StatCard icon={Ship} label={`Exportações · ${ano}`} value={formatUsdCompact(exp.fob)} detail={formatUsd(exp.fob)}/>
      <StatCard icon={Package} label={`Importações · ${ano}`} value={formatUsdCompact(imp.fob)} detail={formatUsd(imp.fob)}/>
      <StatCard icon={Scale} label={`Saldo comercial · ${ano}`} value={formatUsdCompact(exp.fob - imp.fob)} detail="exportações − importações (US$ FOB)"/>
      <StatCard icon={CalendarDays} label={`${FLUXOS[fluxo]} vs. mesmo período de ${anterior}`} value={mesmoPeriodo ? pct(atual.fob, mesmoPeriodo.fob) : "Sem base"} detail={mesmoPeriodo ? `${formatUsdCompact(mesmoPeriodo.fob)} em jan–${mesLabel(cob.ultimoMes)}/${anterior}` : `sem dados de ${anterior} no arquivo`}/>
    </div>
    <section className="pec-card"><div className="pec-card-title">Exportação × importação por mês · {periodoTexto(ano)} · US$ FOB</div><div style={{ height: 300 }}><ResponsiveContainer><BarChart data={serie} margin={{ right: 16 }}><CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false}/><XAxis dataKey="mes" tick={axis}/><YAxis tick={axis} tickFormatter={formatUsdCompact} width={90}/><Tooltip formatter={(v, n) => [formatUsd(v), n]}/><Legend wrapperStyle={{ fontSize: 12 }}/><Bar dataKey="exportacao" name="Exportação" fill={EXP} isAnimationActive={false}/><Bar dataKey="importacao" name="Importação" fill={IMP} isAnimationActive={false}/></BarChart></ResponsiveContainer></div></section>
    {erro && <p className="pec-source">Não foi possível carregar o detalhamento por produto e país: {erro}</p>}
    {!detalhe && !erro && <p className="pec-source">Carregando detalhamento por produto e país…</p>}
    {detalhe && <div className="pec-top-row">
      <RankTable title={`Principais produtos (SH4) · ${FLUXOS[fluxo].toLowerCase()} · ${ano}`} rows={produtos} total={atual.fob} codeLabel="SH4" />
      <RankTable title={`Principais países · ${FLUXOS[fluxo].toLowerCase()} · ${ano}`} rows={paises} total={atual.fob} codeLabel="País" />
    </div>}
    <p className="pec-source">Fonte: <b>Comex Stat / MDIC</b> · base municipal · extração em {meta[0]?.data_extracao.split("-").reverse().join("/")}. Painel anterior no Looker Studio: <a href={LOOKER[fluxo]} target="_blank" rel="noopener noreferrer">{FLUXOS[fluxo].toLowerCase()}</a> (período não verificado).</p>
  </div>;
}

function RankTable({ title, rows, total, codeLabel }) {
  return <section className="pec-card"><div className="pec-card-title">{title}</div><div className="pec-table-scroll"><table className="pec-table">
    <thead><tr><th>{codeLabel}</th><th className="num">US$ FOB</th><th className="num">Peso (t)</th><th className="num">% do fluxo</th></tr></thead>
    <tbody>{rows.map((row) => <tr key={row.codigo}><td className="pec-td-name comex-td-name" title={row.nome}><b>{row.codigo}</b> · {row.nome}</td><td className="num">{formatUsd(row.fob)}</td><td className="num">{formatNumber(Math.round(row.kg / 1000))}</td><td className="num">{total ? `${((row.fob / total) * 100).toFixed(1).replace(".", ",")}%` : "—"}</td></tr>)}</tbody>
  </table></div></section>;
}
