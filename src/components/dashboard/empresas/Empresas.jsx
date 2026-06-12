import React, { useState, useMemo, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Label,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import StatCard from "../../ui/StatCard";
import {
  empresasResumo,
  empresasPorSetor,
  empresasPorBairro,
  empresasPorPorte,
  empresasTabelaBairro,
} from "../../../data/empresas";

// Paleta institucional única (navy #0a4f9f, azul claro #2f86d6, amarelo #efbb07).
const SETOR_COLORS = ["#0a4f9f", "#2f86d6", "#efbb07"];
const BAR_FILL = "#0a4f9f"; // navy oficial (brand-700)

const nf = new Intl.NumberFormat("pt-BR");

// ── Donut: composição por setor ───────────────────────────────────────────────
function SetorDonut() {
  const [hover, setHover] = useState(null);
  const total = empresasPorSetor.reduce((acc, d) => acc + d.value, 0);

  return (
    <section className="emp-card emp-donut">
      <div className="emp-card-title">Composição por setor</div>

      <div className="emp-donut-box">
        <div style={{ width: "100%", maxWidth: 230, height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={empresasPorSetor}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={104}
                startAngle={90}
                endAngle={-270}
                stroke="#fff"
                strokeWidth={2}
                isAnimationActive={false}
                onMouseEnter={(_, i) => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {empresasPorSetor.map((entry, i) => (
                  <Cell
                    key={entry.label}
                    fill={SETOR_COLORS[i % SETOR_COLORS.length]}
                    fillOpacity={hover !== null && hover !== i ? 0.32 : 1}
                  />
                ))}
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox;
                    return (
                      <g>
                        <text x={cx} y={cy - 6} textAnchor="middle" fontWeight="800" fontSize="20" fill="#1f2933">
                          {nf.format(total)}
                        </text>
                        <text x={cx} y={cy + 15} textAnchor="middle" fontSize="11" fill="#6b7280">
                          empresas
                        </text>
                      </g>
                    );
                  }}
                />
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${nf.format(value)} (${((value / total) * 100).toFixed(1).replace(".", ",")}%)`, name]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="emp-donut-legend" onMouseLeave={() => setHover(null)}>
        {empresasPorSetor.map((d, i) => (
          <div
            className={`emp-legend-item${hover !== null && hover !== i ? " dimmed" : ""}`}
            key={d.label}
            onMouseEnter={() => setHover(i)}
          >
            <span className="emp-legend-swatch" style={{ background: SETOR_COLORS[i] }} />
            <span className="emp-legend-label">{d.label}</span>
            <span className="emp-legend-value">{nf.format(d.value)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Barras horizontais: empresas por bairro (Top 15) ──────────────────────────
const TOP_BAIRROS = 15;

function BairroBars() {
  const data = empresasPorBairro.slice(0, TOP_BAIRROS);
  return (
    <section className="emp-card emp-bairro-bars">
      <div className="emp-card-title">Empresas por bairro · Top {data.length}</div>
      <div style={{ width: "100%", height: 430 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} />
            <YAxis type="category" dataKey="label" tick={{ fill: "#374151", fontSize: 11 }} width={118} />
            <Tooltip
              formatter={(value) => [`${nf.format(value)} empresas`, null]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
              cursor={{ fill: "rgba(10,79,159,0.05)" }}
            />
            <Bar dataKey="value" fill={BAR_FILL} radius={[0, 4, 4, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Tabela completa por bairro (ordenável) ────────────────────────────────────
const COLUMNS = [
  { key: "bairro", label: "Bairro", numeric: false },
  { key: "servicos", label: "Serviços", numeric: true },
  { key: "comercio", label: "Comércio", numeric: true },
  { key: "industria", label: "Indústria", numeric: true },
  { key: "total", label: "Total", numeric: true },
];

function BairroTable() {
  const [sortKey, setSortKey] = useState("total");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const copy = [...empresasTabelaBairro];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv, "pt-BR") : av - bv;
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, asc]);

  const maxTotal = empresasTabelaBairro.reduce((m, r) => Math.max(m, r.total), 0);

  const handleSort = (key) => {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(key === "bairro"); // texto começa A→Z; números começam do maior
    }
  };

  return (
    <section className="emp-card emp-table-card">
      <div className="emp-card-title">Empresas por bairro · {rows.length} bairros</div>

      <div className="emp-table-scroll">
        <table className="emp-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={col.numeric ? "num" : ""}
                  aria-sort={sortKey === col.key ? (asc ? "ascending" : "descending") : "none"}
                >
                  <button type="button" className="emp-th-btn" onClick={() => handleSort(col.key)}>
                    {col.label}
                    {sortKey === col.key &&
                      (asc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.bairro}>
                <td className="emp-td-bairro">
                  <span className="emp-td-bar" style={{ width: `${(r.total / maxTotal) * 100}%` }} aria-hidden="true" />
                  <span className="emp-td-name">{r.bairro}</span>
                </td>
                <td className="num">{nf.format(r.servicos)}</td>
                <td className="num">{nf.format(r.comercio)}</td>
                <td className="num">{nf.format(r.industria)}</td>
                <td className="num strong">{nf.format(r.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Distribuição por porte (barras horizontais) ───────────────────────────────
const PORTE_FILL = "#2f86d6";

function PorteBar() {
  const total = empresasPorPorte.reduce((acc, d) => acc + d.value, 0);
  return (
    <section className="emp-card">
      <div className="emp-card-title">Porte das empresas</div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={empresasPorPorte} layout="vertical" margin={{ top: 4, right: 56, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} />
            <YAxis type="category" dataKey="label" tick={{ fill: "#374151", fontSize: 10 }} width={170} />
            <Tooltip
              formatter={(value) => [`${nf.format(value)} (${((value / total) * 100).toFixed(1).replace(".", ",")}%)`, null]}
              contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
              cursor={{ fill: "rgba(10,79,159,0.05)" }}
            />
            <Bar dataKey="value" fill={PORTE_FILL} radius={[0, 4, 4, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// ── Busca por atividade (CNAE) ────────────────────────────────────────────────
// Equivalente seguro ao filtro do Looker: agrega por atividade (contagem total +
// por bairro), sem nenhum dado individual. O dataset é carregado sob demanda.
const norm = (s) =>
  (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function AtividadeFilter() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    import("../../../data/empresasAtividades").then((m) => {
      if (active) setData(m.atividades);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = norm(query.trim());
    const base = q ? data.filter((a) => norm(a.nome).includes(q)) : data;
    return base.slice(0, 60);
  }, [data, query]);

  // Mantém uma atividade selecionada (a primeira do filtro) para o painel nunca ficar vazio.
  const current =
    selected && filtered.some((a) => a.nome === selected.nome)
      ? selected
      : filtered[0] || null;

  if (!data) {
    return (
      <section className="emp-card">
        <div className="emp-card-title">Buscar por atividade</div>
        <p className="emp-filter-loading">Carregando atividades…</p>
      </section>
    );
  }

  const maxBairro = current && current.bairros.length ? current.bairros[0].value : 1;

  return (
    <section className="emp-card">
      <div className="emp-card-title">Buscar por atividade (CNAE)</div>

      <div className="emp-search">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex.: corte, restaurante, vestuário, mecânica…"
          aria-label="Buscar atividade"
        />
        <span className="emp-search-count">{filtered.length} de {data.length}</span>
      </div>

      <div className="emp-filter-body">
        <ul className="emp-filter-list">
          {filtered.map((a) => (
            <li key={a.nome}>
              <button
                type="button"
                className={`emp-filter-item${current && current.nome === a.nome ? " active" : ""}`}
                onClick={() => setSelected(a)}
              >
                <span className="emp-filter-name">{a.nome}</span>
                <span className="emp-filter-num">{nf.format(a.total)}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="emp-filter-empty">Nenhuma atividade encontrada.</li>}
        </ul>

        <div className="emp-filter-detail">
          {current ? (
            <>
              <h3 className="emp-detail-name">{current.nome}</h3>
              <div className="emp-detail-meta">
                <span className="emp-detail-badge">{current.segmento}</span>
                <span className="emp-detail-total">{nf.format(current.total)} empresas</span>
              </div>
              <div className="emp-detail-sub">Onde estão · Top {current.bairros.length} bairros</div>
              <ol className="emp-detail-bairros">
                {current.bairros.map((b) => (
                  <li key={b.label}>
                    <span className="emp-detail-bairro">{b.label}</span>
                    <span className="emp-detail-track">
                      <span className="emp-detail-fill" style={{ width: `${(b.value / maxBairro) * 100}%` }} />
                    </span>
                    <span className="emp-detail-val">{nf.format(b.value)}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="emp-filter-loading">Selecione uma atividade.</p>
          )}
        </div>
      </div>
    </section>
  );
}

const TABS = [
  { id: "geral", label: "Visão geral" },
  { id: "detalhe", label: "Detalhamento" },
];

export default function Empresas() {
  const [tab, setTab] = useState("geral");

  return (
    <div className="emp-page">
      <div className="emp-resumo-row">
        {empresasResumo.map((item) => (
          <StatCard
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            detail={item.detail}
          />
        ))}
      </div>

      <div className="emp-tabs" role="tablist" aria-label="Seções do painel">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`emp-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="emp-tab-panel"
            className={`emp-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* key={tab} re-monta o painel a cada troca → reativa a animação de deslize. */}
      <div
        className="emp-tab-panel"
        id="emp-tab-panel"
        role="tabpanel"
        aria-labelledby={`emp-tab-${tab}`}
        key={tab}
      >
        {tab === "geral" ? (
          <>
            <div className="emp-top-row">
              <SetorDonut />
              <BairroBars />
            </div>
            <BairroTable />
          </>
        ) : (
          <>
            <AtividadeFilter />
            <PorteBar />
          </>
        )}
      </div>

      <p className="emp-source">Fonte: <b>PLANURB</b>, 2025</p>
    </div>
  );
}
