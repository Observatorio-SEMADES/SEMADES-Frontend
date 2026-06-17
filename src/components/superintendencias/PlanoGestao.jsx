import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Target, Briefcase, Package, ListChecks, ChevronUp, ChevronDown, X } from "lucide-react";
import StatCard from "../ui/StatCard";
import FilterDropdown from "../ui/FilterDropdown";
import SuperTabs from "./SuperTabs";

// BI genérico de "Plano de Gestão" usado pelas superintendências (SUAF, SUDE…),
// que seguem o mesmo template: metas → projetos → entregas → ações, com situação
// e % executado. A página passa os dados (acoes/anos/fonte) por props.

const NAVY = "#0a4f9f";
const AZUL = "#2f86d6";
const AMARELO = "#efbb07";

// Cor por situação da ação (semântica, independente das cores do Looker).
const STATUS_COLORS = {
  "EM ATRASO": AMARELO,
  "CONCLUÍDA": "#1f9d6b",
  "EM ANDAMENTO": AZUL,
  "NÃO INICIADA": NAVY,
  "NÃO INICIADO": NAVY,
  "PARALISADA": "#8b5cf6",
  "NÃO INFORMADO": "#94a3b8",
};
const statusColor = (s) => STATUS_COLORS[s] ?? "#94a3b8";
const EM_ATRASO = "EM ATRASO";

const nf = new Intl.NumberFormat("pt-BR");
const pct = (v) => `${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(v * 100)}%`;
const tipStyle = { borderRadius: 8, border: "1px solid #e5e7eb" };
const dimOf = (active, label) => (active && active !== label ? 0.3 : 1);

// ── Tabela genérica ordenável ─────────────────────────────────────────────────
function DataTable({ columns, rows, activeKey, onRowClick }) {
  const [sortKey, setSortKey] = useState(null);
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = col.sortVal(a);
      const vb = col.sortVal(b);
      const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb), "pt-BR");
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, asc, columns]);

  const handleSort = (key) => {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  };

  return (
    <div className="pg-table-scroll">
      <table className="pg-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.numeric ? "num" : ""}
                aria-sort={sortKey === col.key ? (asc ? "ascending" : "descending") : "none"}
              >
                <button type="button" className="pg-th-btn" onClick={() => handleSort(col.key)}>
                  {col.label}
                  {sortKey === col.key && (asc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const isActive = activeKey != null && row._key === activeKey;
            return (
              <tr
                key={row._key ?? i}
                className={`${onRowClick ? "pg-row-click" : ""}${isActive ? " pg-row-active" : ""}`}
                onClick={onRowClick ? () => onRowClick(row._key) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.numeric ? "num" : ""}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Mini-barra percentual. 0% = barra vazia. `color` define o preenchimento.
function ProgressCell({ value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{pct(value)}</span>
      <span className="pg-bar" aria-hidden="true">
        <span className="pg-bar-fill" style={{ width: value > 0 ? `${Math.max(value * 100, 3)}%` : 0, background: color }} />
      </span>
    </div>
  );
}

const DIMS = ["ano", "situacao", "gerente", "entrega"];

export default function PlanoGestao({ acoes: ACOES, anos: ANOS, fonte }) {
  const [filters, setFilters] = useState({ ano: null, situacao: null, gerente: null, entrega: null });

  const setFilter = (dim, value) => setFilters((f) => ({ ...f, [dim]: f[dim] === value ? null : value }));
  const clearAll = () => setFilters({ ano: null, situacao: null, gerente: null, entrega: null });

  const situacoes = useMemo(() => [...new Set(ACOES.map((a) => a.situacaoAcao))].sort(), [ACOES]);
  // Só faz sentido mostrar "taxa de conclusão" quando há execução registrada.
  const temExecucao = useMemo(() => ACOES.some((a) => a.pctExecutado > 0), [ACOES]);

  // Passa nos filtros, opcionalmente ignorando uma dimensão (para os gráficos de
  // distribuição: clicar destaca/filtra sem o próprio gráfico colapsar).
  const passes = (a, skip) =>
    (skip === "ano" || filters.ano === null || String(a.ano) === filters.ano) &&
    (skip === "situacao" || filters.situacao === null || a.situacaoAcao === filters.situacao) &&
    (skip === "gerente" || filters.gerente === null || a.responsavel === filters.gerente) &&
    (skip === "entrega" || filters.entrega === null || a.entrega === filters.entrega);

  const acoes = useMemo(() => ACOES.filter((a) => passes(a, null)), [ACOES, filters]);

  // Conta valores distintos ignorando vazios (o Looker não conta itens em branco).
  const countDistinct = (key) => new Set(acoes.map((a) => a[key]).filter(Boolean)).size;
  const cards = [
    { icon: Target, label: "Metas", value: nf.format(countDistinct("meta")) },
    { icon: Briefcase, label: "Projetos", value: nf.format(countDistinct("projeto")) },
    { icon: Package, label: "Entregas", value: nf.format(countDistinct("entrega")) },
    { icon: ListChecks, label: "Ações", value: nf.format(acoes.length) },
  ];

  const donut = useMemo(() => {
    const m = new Map();
    ACOES.filter((a) => passes(a, "situacao")).forEach((a) => m.set(a.situacaoAcao, (m.get(a.situacaoAcao) ?? 0) + 1));
    return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [ACOES, filters]);
  const donutTotal = donut.reduce((s, d) => s + d.value, 0);

  const porGerente = useMemo(() => {
    const m = new Map();
    ACOES.filter((a) => passes(a, "gerente")).forEach((a) => {
      const g = m.get(a.responsavel) ?? { responsavel: a.responsavel, entregas: new Set(), acoes: 0, atraso: 0 };
      g.entregas.add(a.entrega);
      g.acoes += 1;
      if (a.situacaoAcao === EM_ATRASO) g.atraso += 1;
      m.set(a.responsavel, g);
    });
    return [...m.values()]
      .map((g) => ({ _key: g.responsavel, responsavel: g.responsavel, entregas: g.entregas.size, acoes: g.acoes, atraso: g.acoes ? g.atraso / g.acoes : 0 }))
      .sort((a, b) => b.acoes - a.acoes);
  }, [ACOES, filters]);
  const gerenteTotal = porGerente.reduce((s, g) => s + g.acoes, 0);

  // Conclusão (entrega) = média do % executado PONDERADA pelo peso da etapa
  // (Σ exec×peso ÷ Σ peso). É como o "% da entrega" do Looker é calculado (exato).
  const porEntrega = useMemo(() => {
    const m = new Map();
    ACOES.filter((a) => passes(a, "entrega")).forEach((a) => {
      const e = m.get(a.entrega) ?? { entrega: a.entrega, acoes: 0, execW: 0, pesoSum: 0, atraso: 0 };
      e.acoes += 1;
      e.execW += a.pctExecutado * a.peso;
      e.pesoSum += a.peso;
      if (a.situacaoAcao === EM_ATRASO) e.atraso += 1;
      m.set(a.entrega, e);
    });
    return [...m.values()].map((e) => ({ _key: e.entrega, entrega: e.entrega, acoes: e.acoes, taxa: e.pesoSum ? e.execW / e.pesoSum : 0, atraso: e.acoes ? e.atraso / e.acoes : 0 }));
  }, [ACOES, filters]);
  const entregaTotal = porEntrega.reduce((s, e) => s + e.acoes, 0);

  const activeChips = DIMS.filter((d) => filters[d] !== null).map((d) => ({ dim: d, value: filters[d] }));

  const entregaColumns = [
    { key: "entrega", label: "Entrega", numeric: false, sortVal: (r) => r.entrega, render: (r) => <span className="pg-td-name">{r.entrega || "(sem entrega)"}</span> },
    { key: "acoes", label: "Ações", numeric: true, sortVal: (r) => r.acoes, render: (r) => nf.format(r.acoes) },
    { key: "share", label: "% das ações", numeric: true, sortVal: (r) => r.acoes, render: (r) => pct(r.acoes / entregaTotal) },
    temExecucao && { key: "taxa", label: "Taxa de conclusão", numeric: true, sortVal: (r) => r.taxa, render: (r) => <ProgressCell value={r.taxa} color={"#1f9d6b"} /> },
    { key: "atraso", label: "% em atraso", numeric: true, sortVal: (r) => r.atraso, render: (r) => <ProgressCell value={r.atraso} color={AMARELO} /> },
  ].filter(Boolean);

  const gerenteColumns = [
    { key: "responsavel", label: "Gerente", numeric: false, sortVal: (r) => r.responsavel, render: (r) => <span className="pg-td-name">{r.responsavel}</span> },
    { key: "entregas", label: "Entregas", numeric: true, sortVal: (r) => r.entregas, render: (r) => nf.format(r.entregas) },
    { key: "acoes", label: "Ações", numeric: true, sortVal: (r) => r.acoes, render: (r) => nf.format(r.acoes) },
    { key: "share", label: "% das ações", numeric: true, sortVal: (r) => r.acoes, render: (r) => pct(r.acoes / gerenteTotal) },
    { key: "atraso", label: "% em atraso", numeric: true, sortVal: (r) => r.atraso, render: (r) => <ProgressCell value={r.atraso} color={AMARELO} /> },
  ];

  return (
    <div className="pg-page">
      <SuperTabs />

      <div className="pg-filters">
        <div className="pg-filter">
          <span className="pg-filter-label">Ano:</span>
          <FilterDropdown allLabel="Todos os anos" options={ANOS} value={filters.ano} onChange={(v) => setFilters((f) => ({ ...f, ano: v }))} />
        </div>
        <div className="pg-filter">
          <span className="pg-filter-label">Situação da ação:</span>
          <FilterDropdown allLabel="Todas as situações" options={situacoes} value={filters.situacao} onChange={(v) => setFilters((f) => ({ ...f, situacao: v }))} minWidth={190} />
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="pg-active-filters">
          <span className="pg-filter-label">Filtros ativos:</span>
          {activeChips.map(({ dim, value }) => (
            <button key={dim} type="button" className="pg-fchip" onClick={() => setFilters((f) => ({ ...f, [dim]: null }))}>
              {value}
              <X size={13} aria-hidden="true" />
            </button>
          ))}
          <button type="button" className="pg-fchip pg-fchip-clear" onClick={clearAll}>
            Limpar tudo
          </button>
        </div>
      )}

      <div className="pg-resumo-row">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      {acoes.length === 0 ? (
        <section className="pg-card">
          <p className="pg-empty">Nenhuma ação para os filtros selecionados.</p>
        </section>
      ) : (
        <>
          <div className="pg-top-row">
            <section className="pg-card">
              <div className="pg-card-title">Ações por situação · clique para filtrar</div>
              <div className="pg-clickable" style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donut}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={96}
                      paddingAngle={donut.length > 1 ? 2 : 0}
                      isAnimationActive={false}
                      onClick={(d) => {
                        const name = d?.name ?? d?.payload?.name;
                        if (name) setFilter("situacao", name);
                      }}
                    >
                      {donut.map((d) => (
                        <Cell key={d.name} fill={statusColor(d.name)} fillOpacity={dimOf(filters.situacao, d.name)} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${nf.format(v)} (${pct(v / donutTotal)})`, n]} contentStyle={tipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="pg-legend">
                {donut.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    className={`pg-legend-item${filters.situacao && filters.situacao !== d.name ? " is-dim" : ""}`}
                    onClick={() => setFilter("situacao", d.name)}
                  >
                    <span className="pg-legend-dot" style={{ background: statusColor(d.name) }} />
                    {d.name} <strong>{nf.format(d.value)}</strong> ({pct(d.value / donutTotal)})
                  </button>
                ))}
              </div>
            </section>

            <section className="pg-card">
              <div className="pg-card-title">Ações por gerente · clique para filtrar</div>
              <div className="pg-clickable" style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={porGerente.slice(0, 12)} layout="vertical" margin={{ top: 4, right: 28, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="responsavel" tick={{ fill: "#374151", fontSize: 11 }} width={108} />
                    <Tooltip formatter={(v) => [`${nf.format(v)} (${pct(v / gerenteTotal)})`, "Ações"]} contentStyle={tipStyle} cursor={{ fill: "rgba(10,79,159,0.05)" }} />
                    <Bar
                      dataKey="acoes"
                      fill={NAVY}
                      radius={[0, 4, 4, 0]}
                      isAnimationActive={false}
                      onClick={(d) => {
                        const name = d?.responsavel ?? d?.payload?.responsavel;
                        if (name) setFilter("gerente", name);
                      }}
                    >
                      {porGerente.slice(0, 12).map((g) => (
                        <Cell key={g.responsavel} fillOpacity={dimOf(filters.gerente, g.responsavel)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section className="pg-card">
            <div className="pg-card-title">Visão geral por entrega · clique numa linha para filtrar</div>
            <DataTable rows={porEntrega} columns={entregaColumns} activeKey={filters.entrega} onRowClick={(key) => setFilter("entrega", key)} />
          </section>

          <section className="pg-card">
            <div className="pg-card-title">Gerentes · clique numa linha para filtrar</div>
            <DataTable rows={porGerente} columns={gerenteColumns} activeKey={filters.gerente} onRowClick={(key) => setFilter("gerente", key)} />
          </section>
        </>
      )}

      <p className="pg-source">
        Fonte: <b>{fonte}</b>
      </p>
    </div>
  );
}
