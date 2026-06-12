import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { ChevronUp, ChevronDown, Scale, UserPlus, UserMinus, Briefcase, Timer } from "lucide-react";
import StatCard from "../../ui/StatCard";
import {
  empregosPeriodo,
  empregosSetores,
  empregosAnos,
  empregosSerie,
  empregosSeriePorSetor,
} from "../../../data/empregos";

// Paleta institucional única (navy #0a4f9f, azul claro #2f86d6, amarelo #efbb07).
const NAVY = "#0a4f9f";
const AZUL = "#2f86d6";
const AMARELO = "#efbb07";
// Por métrica: admitidos/estoque = navy · desligados/tempo = azul claro · saldo = amarelo.
const ADM = NAVY;
const DES = AZUL;
const SALDO = AMARELO;
const TEMPO = AZUL;
const ESTOQUE = NAVY;

const nf = new Intl.NumberFormat("pt-BR");
const nf1 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const sign = (v) => `${v > 0 ? "+" : ""}${nf.format(v)}`;
const tipStyle = { borderRadius: 8, border: "1px solid #e5e7eb" };

// Resumo agregado de uma série (admitidos/desligados/saldo = soma; estoque = último
// mês; tempo = média ponderada por desligados). Recalculado a cada filtro.
function resumoDe(serie) {
  const admitidos = serie.reduce((s, p) => s + p.admitidos, 0);
  const desligados = serie.reduce((s, p) => s + p.desligados, 0);
  const saldo = serie.reduce((s, p) => s + p.saldo, 0);
  const estoque = serie.length ? serie[serie.length - 1].estoque : 0;
  const tempo = desligados ? serie.reduce((s, p) => s + p.tempo * p.desligados, 0) / desligados : 0;
  return { admitidos, desligados, saldo, estoque, tempo };
}

// ── Barra de filtro genérica (chips estilo BI) ────────────────────────────────
function ChipFilter({ label, allLabel, options, value, onChange }) {
  return (
    <div className="emg-filter" role="group" aria-label={`Filtrar por ${label}`}>
      <span className="emg-filter-label">{label}:</span>
      <div className="emg-chips">
        <button
          type="button"
          className={`emg-chip${value === null ? " active" : ""}`}
          aria-pressed={value === null}
          onClick={() => onChange(null)}
        >
          {allLabel}
        </button>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`emg-chip${value === o ? " active" : ""}`}
            aria-pressed={value === o}
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

// Opacidade de destaque: 1 no setor selecionado (ou tudo, se "Todos"); esmaecido nos demais.
const dimOf = (setor, label) => (setor && setor !== label ? 0.28 : 1);

// ── Admitidos × Desligados por setor (barras agrupadas; clicar filtra) ────────
function FluxoPorSetor({ porSetor, setor, onSetor }) {
  return (
    <section className="emg-card">
      <div className="emg-card-title">Admitidos × Desligados por setor</div>
      <div className="emg-clickbars" style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={porSetor} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#374151", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} width={48} />
            <Tooltip formatter={(v, n) => [nf.format(v), n]} contentStyle={tipStyle} cursor={{ fill: "rgba(10,79,159,0.05)" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="admitidos" name="Admitidos" fill={ADM} radius={[4, 4, 0, 0]} isAnimationActive={false} onClick={(d) => onSetor(d.label === setor ? null : d.label)}>
              {porSetor.map((d) => (
                <Cell key={d.label} fillOpacity={dimOf(setor, d.label)} />
              ))}
            </Bar>
            <Bar dataKey="desligados" name="Desligados" fill={DES} radius={[4, 4, 0, 0]} isAnimationActive={false} onClick={(d) => onSetor(d.label === setor ? null : d.label)}>
              {porSetor.map((d) => (
                <Cell key={d.label} fillOpacity={dimOf(setor, d.label)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Saldo por setor (barras horizontais; clicar filtra) ───────────────────────
function SaldoPorSetor({ porSetor, setor, onSetor }) {
  const data = useMemo(() => [...porSetor].sort((a, b) => b.saldo - a.saldo), [porSetor]);
  return (
    <section className="emg-card">
      <div className="emg-card-title">Saldo de empregos por setor</div>
      <div className="emg-clickbars" style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 40, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} />
            <YAxis type="category" dataKey="label" tick={{ fill: "#374151", fontSize: 11 }} width={86} />
            <Tooltip formatter={(v) => [sign(v), "Saldo"]} contentStyle={tipStyle} cursor={{ fill: "rgba(239,187,7,0.12)" }} />
            <ReferenceLine x={0} stroke="#cbd5e1" />
            <Bar dataKey="saldo" fill={SALDO} radius={[0, 4, 4, 0]} isAnimationActive={false} onClick={(d) => onSetor(d.label === setor ? null : d.label)}>
              {data.map((d) => (
                <Cell key={d.label} fillOpacity={dimOf(setor, d.label)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Tempo médio de emprego por setor (barras horizontais; clicar filtra) ──────
function TempoPorSetor({ porSetor, setor, onSetor }) {
  const data = useMemo(() => [...porSetor].sort((a, b) => b.tempo - a.tempo), [porSetor]);
  return (
    <section className="emg-card">
      <div className="emg-card-title">Tempo médio de emprego por setor · meses (dos desligados)</div>
      <div className="emg-clickbars" style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf1.format(v)} />
            <YAxis type="category" dataKey="label" tick={{ fill: "#374151", fontSize: 11 }} width={86} />
            <Tooltip formatter={(v) => [`${nf1.format(v)} meses`, null]} contentStyle={tipStyle} cursor={{ fill: "rgba(10,79,159,0.05)" }} />
            <Bar dataKey="tempo" fill={TEMPO} radius={[0, 4, 4, 0]} isAnimationActive={false} onClick={(d) => onSetor(d.label === setor ? null : d.label)}>
              {data.map((d) => (
                <Cell key={d.label} fillOpacity={dimOf(setor, d.label)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Tabela por mês (ordenável; reflete os filtros) ────────────────────────────
const COLUMNS = [
  { key: "mes", label: "Mês", numeric: false },
  { key: "admitidos", label: "Admitidos", numeric: true },
  { key: "desligados", label: "Desligados", numeric: true },
  { key: "saldo", label: "Saldo", numeric: true },
  { key: "estoque", label: "Estoque", numeric: true },
];

function TabelaMes({ serie, setor }) {
  const [sortKey, setSortKey] = useState(null); // null = ordem cronológica
  const [asc, setAsc] = useState(true);

  const base = useMemo(() => serie.map((r, i) => ({ ...r, _i: i })), [serie]);

  const rows = useMemo(() => {
    if (!sortKey) return base;
    const copy = [...base];
    copy.sort((a, b) => {
      const cmp = sortKey === "mes" ? a._i - b._i : a[sortKey] - b[sortKey];
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [base, sortKey, asc]);

  const totalAdm = base.reduce((s, r) => s + r.admitidos, 0);
  const totalDes = base.reduce((s, r) => s + r.desligados, 0);
  const totalSaldo = base.reduce((s, r) => s + r.saldo, 0);

  const handleSort = (key) => {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(key === "mes");
    }
  };

  return (
    <section className="emg-card">
      <div className="emg-card-title">Movimentação mês a mês · {setor || "todos os setores"}</div>
      <div className="emg-table-scroll">
        <table className="emg-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={col.numeric ? "num" : ""}
                  aria-sort={sortKey === col.key ? (asc ? "ascending" : "descending") : "none"}
                >
                  <button type="button" className="emg-th-btn" onClick={() => handleSort(col.key)}>
                    {col.label}
                    {sortKey === col.key && (asc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.mes}>
                <td className="emg-td-mes">{r.mes}</td>
                <td className="num">{nf.format(r.admitidos)}</td>
                <td className="num">{nf.format(r.desligados)}</td>
                <td className="num strong">{sign(r.saldo)}</td>
                <td className="num">{nf.format(r.estoque)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total geral</td>
              <td className="num">{nf.format(totalAdm)}</td>
              <td className="num">{nf.format(totalDes)}</td>
              <td className="num strong">{sign(totalSaldo)}</td>
              <td className="num">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

// ── Evolução: Admitidos × Desligados ao longo dos meses (linhas) ──────────────
function FluxoNoTempo({ serie }) {
  return (
    <section className="emg-card">
      <div className="emg-card-title">Admitidos × Desligados ao longo dos meses</div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={serie} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} width={48} />
            <Tooltip formatter={(v, n) => [nf.format(v), n]} contentStyle={tipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="admitidos" name="Admitidos" stroke={ADM} strokeWidth={2.5} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="desligados" name="Desligados" stroke={DES} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Evolução: Saldo mensal (barras) ───────────────────────────────────────────
function SaldoNoTempo({ serie }) {
  return (
    <section className="emg-card">
      <div className="emg-card-title">Saldo mensal de empregos</div>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={serie} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} width={48} />
            <Tooltip formatter={(v) => [sign(v), "Saldo"]} contentStyle={tipStyle} cursor={{ fill: "rgba(239,187,7,0.12)" }} />
            <ReferenceLine y={0} stroke="#cbd5e1" />
            <Bar dataKey="saldo" fill={SALDO} radius={[3, 3, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Evolução: Estoque mensal (área) ───────────────────────────────────────────
function EstoqueNoTempo({ serie }) {
  const vals = serie.map((d) => d.estoque);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = Math.round((max - min) * 0.15) || 1000;
  return (
    <section className="emg-card">
      <div className="emg-card-title">Estoque mensal de empregos (vínculos ativos)</div>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={serie} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="emgEstoque" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ESTOQUE} stopOpacity={0.32} />
                <stop offset="100%" stopColor={ESTOQUE} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis
              domain={[min - pad, max + pad]}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickFormatter={(v) => nf.format(v)}
              width={56}
            />
            <Tooltip formatter={(v) => [nf.format(v), "Estoque"]} contentStyle={tipStyle} />
            <Area type="monotone" dataKey="estoque" stroke={ESTOQUE} strokeWidth={2.5} fill="url(#emgEstoque)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const TABS = [
  { id: "geral", label: "Visão geral" },
  { id: "evolucao", label: "Evolução mensal" },
];

export default function Empregos() {
  const [tab, setTab] = useState("geral");
  const [setor, setSetor] = useState(null); // null = todos os setores
  const [ano, setAno] = useState(null); // null = todo o período

  const suf = ano ? ano.slice(2) : null; // "2025" → "25"
  const noPeriodo = (serie) => (suf ? serie.filter((p) => p.mes.endsWith(`/${suf}`)) : serie);

  // Série (tabela + evolução) e resumo (StatCards) refletem setor + período.
  const serie = useMemo(
    () => noPeriodo(setor ? empregosSeriePorSetor[setor] : empregosSerie),
    [setor, suf]
  );
  const resumo = useMemo(() => resumoDe(serie), [serie]);

  // Comparação por setor (Visão geral): acumulado de cada setor no período.
  const porSetor = useMemo(
    () =>
      empregosSetores.map((s) => ({
        label: s,
        ...resumoDe(noPeriodo(empregosSeriePorSetor[s])),
      })),
    [suf]
  );

  const ultimoMes = serie.length ? serie[serie.length - 1].mes : "—";

  const cards = [
    { icon: Scale, label: "Saldo do período", value: sign(resumo.saldo), detail: "admitidos − desligados" },
    { icon: UserPlus, label: "Admitidos", value: nf.format(resumo.admitidos) },
    { icon: UserMinus, label: "Desligados", value: nf.format(resumo.desligados) },
    { icon: Briefcase, label: "Estoque de empregos", value: nf.format(resumo.estoque), detail: `vínculos ativos em ${ultimoMes}` },
    { icon: Timer, label: "Tempo médio de emprego", value: `${nf1.format(resumo.tempo)} meses`, detail: "dos desligados" },
  ];

  return (
    <div className="emg-page">
      <div className="emg-filters">
        <ChipFilter label="Setor" allLabel="Todos os setores" options={empregosSetores} value={setor} onChange={setSetor} />
        <ChipFilter label="Período" allLabel="Todo o período" options={empregosAnos} value={ano} onChange={setAno} />
      </div>

      <div className="emg-resumo-row">
        {cards.map((item) => (
          <StatCard key={item.label} icon={item.icon} label={item.label} value={item.value} detail={item.detail} />
        ))}
      </div>

      <div className="emg-tabs" role="tablist" aria-label="Seções do painel">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`emg-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="emg-tab-panel"
            className={`emg-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* key re-monta o painel a cada troca de aba/setor/período → reativa a animação. */}
      <div
        className="emg-tab-panel"
        id="emg-tab-panel"
        role="tabpanel"
        aria-labelledby={`emg-tab-${tab}`}
        key={`${tab}-${setor || "todos"}-${ano || "all"}`}
      >
        {tab === "geral" ? (
          <>
            <div className="emg-top-row">
              <FluxoPorSetor porSetor={porSetor} setor={setor} onSetor={setSetor} />
              <SaldoPorSetor porSetor={porSetor} setor={setor} onSetor={setSetor} />
            </div>
            <TempoPorSetor porSetor={porSetor} setor={setor} onSetor={setSetor} />
            <TabelaMes serie={serie} setor={setor} />
          </>
        ) : (
          <>
            <FluxoNoTempo serie={serie} />
            <div className="emg-evo-row">
              <SaldoNoTempo serie={serie} />
              <EstoqueNoTempo serie={serie} />
            </div>
          </>
        )}
      </div>

      <p className="emg-source">
        Fonte: <b>CAGED / Ministério do Trabalho e Emprego</b> · {empregosPeriodo}
      </p>
    </div>
  );
}
