import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Beef, Layers, Scale, CalendarDays, Fish, Banknote, Wheat } from "lucide-react";
import StatCard from "../../ui/StatCard";
import FilterDropdown from "../../ui/FilterDropdown";
import SourceMeta from "../../ui/SourceMeta";
import { ppmRows as ppmSource, abateRows, metaIbge } from "../../../data/observatorio";
import { PPM_CINCO_ESPECIES, PPM_SUBCATEGORIAS } from "../../../data/fontesOficiais";
import { aquicultura2025, formatSidraValue } from "../../../data/aquicultura";
import { formatNumber, sumAvailable, unique } from "../../../data/observatorioCsv";

// PPM/IBGE 2015–2024 no formato usado pelo painel (período/categoria/valor).
const ppmRows = ppmSource.map((row) => ({
  periodo: row.ano,
  categoria: row.especie,
  valor: row.cabecas,
  marcador: row.marcador_ibge,
}));
const years = unique(ppmRows.map((row) => row.periodo));
const latestYear = years.at(-1);
const mainSpecies = unique(ppmSource.filter((row) => !row.subcategoria_de).map((row) => row.especie));
const markerText = (row) => row?.marcador ? row.marcador + " (IBGE)" : "Sem dado";
const fiveSpeciesTotal = (year) => {
  const rows = PPM_CINCO_ESPECIES.map((species) =>
    ppmRows.find((row) => row.periodo === year && row.categoria === species)
  );
  return rows.every((row) => row?.valor != null)
    ? sumAvailable(rows.map((row) => row.valor))
    : null;
};
const ABATE_SERIES = [
  { name: "Bovinos", key: "bovinos", color: "#0a4f9f" },
  { name: "Frangos", key: "frangos", color: "#9b7100" },
  { name: "Suínos", key: "suinos", color: "#16845b" },
];
const abateSpecies = ABATE_SERIES.filter((series) =>
  abateRows.some((row) => row.categoria === series.name)
);
const abateYears = unique(abateRows.filter((row) => abateSpecies.some((series) => series.name === row.categoria)).map((row) => row.periodo.slice(0, 4)));
const monthBR = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
const monthLabel = (period) => monthBR.format(new Date(period + "-01T00:00:00Z"));
const ton = (kg) => kg == null ? null : kg / 1000;
const formatTon = (kg) => kg == null ? "Sem dado" : formatNumber(ton(kg)) + " t";
const axis = { fill: "#6b7280", fontSize: 11 };
const FIVE_SPECIES = "__cinco_especies__";

function Chips({ label, options, value, onChange, allLabel, extraOptions = [] }) {
  const choices = [
    ...(allLabel ? [{ value: null, label: allLabel }] : []),
    ...options.map((item) => ({ value: item.name || item, label: item.label || item.name || item })),
    ...extraOptions,
  ];
  return (
    <div className="pec-filter">
      <span className="pec-filter-label">{label}:</span>
      <div className="pec-chips" role="group" aria-label={label}>
        {choices.map((choice) => (
          <button
            key={choice.value || "all"}
            type="button"
            className={"pec-chip" + (value === choice.value ? " active" : "") + (choice.value === FIVE_SPECIES ? " pec-chip-secondary" : "")}
            aria-pressed={value === choice.value}
            aria-label={choice.ariaLabel}
            onClick={() => onChange(choice.value)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RebanhoTab() {
  const [year, setYear] = useState(null);
  const [animal, setAnimal] = useState(mainSpecies[0] ?? null);
  const chosen = year || latestYear;
  const inYear = ppmRows.filter((row) => row.periodo === chosen);
  const isFiveSpecies = animal === FIVE_SPECIES;
  const selection = isFiveSpecies ? PPM_CINCO_ESPECIES : [animal].filter(Boolean);
  const selectionLabel = isFiveSpecies ? "Cinco espécies · soma" : animal || "Selecione uma espécie";
  const current = inYear.filter((row) => selection.includes(row.categoria));
  const total = isFiveSpecies ? fiveSpeciesTotal(chosen) : current[0]?.valor ?? null;
  const history = years.map((ano) => {
    const selectedRows = ppmRows.filter((row) => row.periodo === ano && selection.includes(row.categoria));
    return {
      ano,
      quantidade: isFiveSpecies
        ? fiveSpeciesTotal(ano)
        : selectedRows[0]?.valor ?? null,
    };
  });
  const chartCurrent = current.map((row) => ({ animal: row.categoria, quantidade: row.valor }));
  // A tabela sempre conserva todas as espécies principais e suas subcategorias.
  const tableRows = mainSpecies.flatMap((name) => [
    { name, row: inYear.find((row) => row.categoria === name), sub: false },
    ...Object.entries(PPM_SUBCATEGORIAS)
      .filter(([, parent]) => parent === name)
      .map(([child]) => ({ name: child, row: inYear.find((row) => row.categoria === child), sub: true })),
  ]);
  const note = (isFiveSpecies
    ? "O gráfico mostra separadamente bovino, suíno (total), caprino, ovino e galináceos (total); a soma das cinco espécies aparece no cartão de resumo."
    : "O gráfico mostra uma espécie por vez para evitar que as diferenças de escala escondam os menores rebanhos.")
    + " Galinhas estão contidas em galináceos e matrizes em suínos; aparecem na tabela, mas não entram no agregado. Bubalino, equino e codornas também permanecem na tabela. Símbolos do IBGE não são convertidos em zero.";

  return (
    <div className="pec-tab-panel">
      <div className="pec-filters">
        <Chips
          label="Espécie"
          options={mainSpecies}
          value={animal}
          onChange={setAnimal}
          extraOptions={[{
            value: FIVE_SPECIES,
            label: "Cinco espécies",
            ariaLabel: "Soma das cinco espécies: bovino, suíno total, caprino, ovino e galináceos total",
          }]}
        />
        <div className="pec-filter">
          <span className="pec-filter-label">Ano:</span>
          <FilterDropdown allLabel={latestYear} options={years} value={year} onChange={setYear} />
        </div>
      </div>
      <SourceMeta
        rows={metaIbge(ppmSource.filter((row) => row.ano === chosen), "IBGE PPM · SIDRA 3939")}
        period={chosen}
        unit="cabeças"
        note={note}
      />
      <div className="pec-resumo-row">
        <StatCard icon={Layers} label={selectionLabel + " · " + chosen} value={total == null ? markerText(current[0]) : formatNumber(total)} detail="cabeças · Campo Grande (MS)" />
        <StatCard icon={Beef} label="Espécies na tabela" value={formatNumber(mainSpecies.length)} detail="inclui as que ficam fora do agregado" />
        <StatCard icon={CalendarDays} label="Série histórica" value={years[0] + "–" + years.at(-1)} detail="PPM · IBGE" />
      </div>
      <div className="pec-top-row">
        <section className="pec-card">
          <div className="pec-card-title">Efetivo por espécie · {selectionLabel} · {chosen} · Campo Grande (MS)</div>
          <div className="pec-chart-context">Unidade: cabeças · Fonte: IBGE PPM, SIDRA 3939</div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartCurrent} layout="vertical" margin={{ right: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis type="number" tick={axis} tickFormatter={formatNumber} />
                <YAxis type="category" dataKey="animal" width={142} tick={axis} />
                <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " cabeças"} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="quantidade" name={isFiveSpecies ? "Espécies selecionadas · cabeças" : selectionLabel + " · cabeças"} fill="#0a4f9f" radius={[0, 4, 4, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="pec-card">
          <div className="pec-card-title">Evolução histórica · {selectionLabel} · Campo Grande (MS)</div>
          <div className="pec-chart-context">Unidade: cabeças · Período: {years[0]}–{years.at(-1)} · Fonte: IBGE PPM, SIDRA 3939</div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={history} margin={{ right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="ano" tick={axis} />
                <YAxis tick={axis} tickFormatter={formatNumber} width={78} />
                <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " cabeças"} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="quantidade" name={selectionLabel + " · cabeças"} stroke="#0a4f9f" strokeWidth={2.5} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="pec-card">
        <div className="pec-card-title">Efetivo detalhado por espécie · {chosen} · Campo Grande (MS) · cabeças</div>
        <div className="pec-table-scroll">
          <table className="pec-table">
            <thead><tr><th>Espécie</th><th className="num">{chosen}</th></tr></thead>
            <tbody>
              {tableRows.map(({ name, row, sub }) => (
                <tr key={name}>
                  <td className="pec-td-name">
                    {sub
                      ? "↳ " + name + " (contido no total acima; fora do agregado)"
                      : name + (PPM_CINCO_ESPECIES.includes(name) ? "" : " (fora do agregado de cinco espécies)")}
                  </td>
                  <td className="num">{row?.valor == null ? markerText(row) : formatNumber(row.valor)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td>Valor do filtro · {selectionLabel}</td><td className="num">{total == null ? markerText(current[0]) : formatNumber(total)}</td></tr></tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AbateTab() {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState(null);
  const [animal, setAnimal] = useState(null);
  const chosen = year || "2025";
  const yearRows = abateRows.filter((row) => row.periodo.startsWith(chosen + "-") && abateSpecies.some((series) => series.name === row.categoria));
  const months = unique(yearRows.map((row) => row.periodo));
  const period = month && months.includes(month) ? month : null;
  const periodRows = yearRows.filter((row) => !period || row.periodo === period);
  const scope = periodRows.filter((row) => !animal || row.categoria === animal);
  const visibleSeries = animal ? ABATE_SERIES.filter((series) => series.name === animal) : ABATE_SERIES.filter((series) => abateSpecies.some((item) => item.name === series.name));
  const value = (indicator, name, rows = scope) =>
    sumAvailable(rows.filter((row) => row.indicador === indicator && (!name || row.categoria === name)).map((row) => row.valor));
  const byAnimal = visibleSeries.map((series) => ({
    animal: series.name,
    peso: ton(value("peso_carcacas", series.name)),
  }));
  const byMonth = (period ? [period] : months).map((m) => {
    const rows = periodRows.filter((row) => row.periodo === m);
    const output = { period: m, mes: monthLabel(m) };
    visibleSeries.forEach((series) => {
      output[series.key] = ton(value("peso_carcacas", series.name, rows));
    });
    output.animais = value("animais_abatidos", null, rows.filter((row) => visibleSeries.some((series) => series.name === row.categoria)));
    output.peso = value("peso_carcacas", null, rows.filter((row) => visibleSeries.some((series) => series.name === row.categoria)));
    return output;
  });
  const partial = scope.some((row) => row.situacao_periodo === "parcial_ate_junho");
  const periodText = period ? monthLabel(period) : partial ? chosen + " · janeiro a junho (parcial)" : chosen + " · ano completo";
  const onYear = (next) => { setYear(next); setMonth(null); };
  const selectedName = animal || "três espécies";

  return (
    <div className="pec-tab-panel">
      <div className="pec-filters">
        <Chips label="Espécie" options={abateSpecies} value={animal} onChange={setAnimal} allLabel="Três espécies" />
        <div className="pec-filter">
          <span className="pec-filter-label">Ano:</span>
          <FilterDropdown allLabel="2025" options={abateYears} value={year} onChange={onYear} />
        </div>
        <div className="pec-filter">
          <span className="pec-filter-label">Mês:</span>
          <FilterDropdown allLabel="Todos os meses disponíveis" options={months} value={period} onChange={setMonth} formatOption={monthLabel} />
        </div>
      </div>
      <SourceMeta
        rows={scope}
        period={periodText}
        unit="cabeças; peso de carcaças em toneladas (CSV em kg)"
        note={partial
          ? "Recorte de abate em Mato Grosso do Sul, não somente Campo Grande. 2026 é parcial e não se compara diretamente a anos completos."
          : "Local de abate em Mato Grosso do Sul; os dados não representam somente Campo Grande. As séries usam as categorias Bovinos, Frangos e Suínos; cabeças e peso aparecem em medidas separadas."}
      />
      <div className="pec-resumo-row">
        <StatCard icon={Scale} label={"Peso de carcaças · " + periodText} value={formatTon(value("peso_carcacas"))} detail="toneladas · Mato Grosso do Sul" />
        <StatCard icon={Beef} label={"Cabeças abatidas · " + selectedName} value={formatNumber(value("animais_abatidos"))} detail="soma das espécies selecionadas · Mato Grosso do Sul" />
        <StatCard icon={CalendarDays} label="Meses no recorte" value={formatNumber(byMonth.length)} detail={partial ? "período parcial" : "período completo"} />
      </div>
      <div className="pec-top-row">
        <section className="pec-card">
          <div className="pec-card-title">Peso de carcaça no período por espécie · Mato Grosso do Sul · {periodText}</div>
          <div className="pec-chart-context">Unidade: toneladas (t) · Fonte: Pesquisa Trimestral do Abate, IBGE</div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={byAnimal} layout="vertical" margin={{ right: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis type="number" tick={axis} tickFormatter={formatNumber} />
                <YAxis type="category" dataKey="animal" width={84} tick={axis} />
                <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " t"} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="peso" name="Peso de carcaça (t)" fill="#0a4f9f" radius={[0, 4, 4, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="pec-card">
          <div className="pec-card-title">Abate mensal por espécie · Mato Grosso do Sul · {periodText}</div>
          <div className="pec-chart-context">Peso de carcaça em toneladas (t) · Local de abate em Mato Grosso do Sul</div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={byMonth} margin={{ right: 18, left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="mes" tick={axis} />
                <YAxis tick={axis} tickFormatter={formatNumber} width={76} label={{ value: "Toneladas (t)", angle: -90, position: "insideLeft", fill: "#6b7280", fontSize: 11 }} />
                <Tooltip formatter={(value, name) => [value == null ? "Sem dado" : formatNumber(value) + " t", name]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {visibleSeries.map((series) => (
                  <Line
                    key={series.key}
                    dataKey={series.key}
                    name={series.name}
                    stroke={series.color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="pec-card">
        <div className="pec-card-title">Abate mês a mês · Mato Grosso do Sul · {periodText}</div>
        <div className="pec-table-scroll">
          <table className="pec-table">
            <thead><tr><th>Mês</th><th className="num">Cabeças · selecionadas</th><th className="num">Peso de carcaça (t)</th></tr></thead>
            <tbody>{byMonth.map((row) => <tr key={row.period}><td>{row.mes}</td><td className="num">{formatNumber(row.animais)}</td><td className="num">{row.peso == null ? "Sem dado" : formatNumber(ton(row.peso))}</td></tr>)}</tbody>
            <tfoot><tr><td>Total do recorte</td><td className="num">{formatNumber(value("animais_abatidos"))}</td><td className="num">{formatTon(value("peso_carcacas"))}</td></tr></tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}

export function AquiculturaTab() {
  const data = aquicultura2025;
  const chartRows = data.speciesKg.map((row) => ({ especie: row.species, producao: row.value }));
  const context = data.territory + " · " + data.year + " · IBGE PPM, SIDRA 3940";
  const displayKg = (metric) => metric?.value == null
    ? formatSidraValue(metric)
    : formatNumber(metric.value) + " kg";

  return (
    <div className="pec-tab-panel">
      <div className="source-meta">
        <span><b>Território:</b> {data.territory} · código IBGE {data.municipalityCode}</span>
        <span><b>Período:</b> {data.year}</span>
        <span><b>Fonte:</b> <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">{data.source}</a></span>
        <span className="source-meta-note">Valores estáticos da consulta de referência de 2025; não há série histórica local nesta base. Os marcadores IBGE “-” e “..” representam ausência e nunca são tratados como zero.</span>
      </div>
      <div className="pec-resumo-row pec-aquicultura-stats">
        <StatCard icon={Fish} label="Produção total de peixes" value={displayKg(data.fishTotalKg)} detail={context} />
        <StatCard icon={Wheat} label="Alevinos" value={formatSidraValue(data.fingerlingsThousands) + " milheiros"} detail={context} />
        <StatCard icon={Banknote} label="Valor total da produção" value={formatSidraValue(data.productionValueThousandsBRL) + " mil R$"} detail={context} />
      </div>
      <div className="pec-top-row">
        <section className="pec-card">
          <div className="pec-card-title">Produção por espécie · {data.territory} · {data.year} · kg</div>
          <div className="pec-chart-context">Fonte: {data.source} · Unidade: kg</div>
          <div style={{ height: 340 }}>
            <ResponsiveContainer>
              <BarChart data={chartRows} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis type="number" tick={axis} tickFormatter={formatNumber} label={{ value: "Quilogramas (kg)", position: "insideBottom", offset: -2, fill: "#6b7280", fontSize: 11 }} />
                <YAxis type="category" dataKey="especie" width={190} tick={axis} />
                <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " kg"} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="producao" name="Produção de peixes (kg)" fill="#0a4f9f" radius={[0, 4, 4, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="pec-chart-context">As categorias detalhadas somam o total de {displayKg(data.fishTotalKg)}. Alevinos e valor da produção usam unidades próprias e ficam fora deste gráfico.</p>
        </section>
        <section className="pec-card">
          <div className="pec-card-title">Produção detalhada · {data.year} · Campo Grande (MS)</div>
          <div className="pec-table-scroll">
            <table className="pec-table">
              <thead><tr><th>Espécie</th><th className="num">Produção (kg)</th></tr></thead>
              <tbody>{data.speciesKg.map((row) => <tr key={row.species}><td className="pec-td-name">{row.species}</td><td className="num">{formatSidraValue(row)}</td></tr>)}</tbody>
              <tfoot><tr><td>Total de peixes · kg</td><td className="num">{formatSidraValue(data.fishTotalKg)}</td></tr></tfoot>
            </table>
          </div>
          <p className="pec-chart-context">Fonte: {data.source}. Consulta por município, código {data.municipalityCode}.</p>
        </section>
      </div>
    </div>
  );
}
