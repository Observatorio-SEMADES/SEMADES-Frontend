import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ChevronUp, ChevronDown, Banknote, Sprout, Wheat, Trophy } from "lucide-react";
import StatCard from "../../ui/StatCard";
import FilterDropdown from "../../ui/FilterDropdown";
import {
  agriculturaAnos,
  agriculturaAnoRecente,
  agriculturaProdutos,
  agriculturaDados,
} from "../../../data/agricultura";

// Paleta institucional (navy #0a4f9f, azul claro #2f86d6, amarelo #efbb07).
const NAVY = "#0a4f9f";
const AZUL = "#2f86d6";
const AMARELO = "#efbb07";

const nf = new Intl.NumberFormat("pt-BR");
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const tipStyle = { borderRadius: 8, border: "1px solid #e5e7eb" };
const dimOf = (sel, key) => (sel && sel !== key ? 0.28 : 1);
const fillOf = (sel, key) => (sel === key ? AMARELO : NAVY);

// R$ compacto (bi/mi/mil) para cartões e eixos.
function brl(v) {
  if (v >= 1e9) return `R$ ${(v / 1e9).toFixed(2).replace(".", ",")} bi`;
  if (v >= 1e6) return `R$ ${(v / 1e6).toFixed(1).replace(".", ",")} mi`;
  if (v >= 1e3) return `R$ ${nf.format(Math.round(v / 1e3))} mil`;
  return `R$ ${nf.format(v)}`;
}
const brlEixo = (v) =>
  v >= 1e9 ? `${(v / 1e9).toFixed(1).replace(".", ",")} bi` : v >= 1e6 ? `${Math.round(v / 1e6)} mi` : nf.format(v);

const TOP_PRODUTOS = 12;

// ── Filtros (Produto + Ano, ambos em dropdown) ────────────────────────────────
function Filtros({ produto, setProduto, ano, setAno }) {
  return (
    <div className="agr-filters">
      <div className="agr-filter">
        <span className="agr-filter-label">Produto:</span>
        <FilterDropdown allLabel="Todos os produtos" options={agriculturaProdutos} value={produto} onChange={setProduto} minWidth="13rem" />
      </div>
      <div className="agr-filter">
        <span className="agr-filter-label">Ano:</span>
        <FilterDropdown allLabel="Todos os anos (acumulado)" options={agriculturaAnos} value={ano} onChange={setAno} minWidth="13rem" />
      </div>
    </div>
  );
}

export default function Agricultura() {
  const [tab, setTab] = useState("produto");
  const [produto, setProduto] = useState(null); // null = todos os produtos
  const [ano, setAno] = useState(agriculturaAnoRecente); // null = acumulado; default 2023

  const escopoAno = ano ? `em ${ano}` : "acumulado 2015–2023";

  // Linhas no escopo do ano (ano = null → todos os anos).
  const noAno = (d) => !ano || d.ano === ano;

  // Agregado por produto (no escopo do ano), ordenado por valor.
  const porProduto = useMemo(() => {
    const arr = agriculturaProdutos.map((p) => {
      const sel = agriculturaDados.filter((d) => d.produto === p && noAno(d));
      return { produto: p, valor: sum(sel.map((d) => d.valor)), area: sum(sel.map((d) => d.area)) };
    });
    return arr.filter((d) => d.valor > 0 || d.area > 0).sort((a, b) => b.valor - a.valor);
  }, [ano]);

  // Ranking de área (top N), destacando o produto selecionado.
  const rankingArea = useMemo(
    () => [...porProduto].sort((a, b) => b.area - a.area).slice(0, TOP_PRODUTOS),
    [porProduto]
  );

  // Séries por ano (escopo do produto: todos ou o selecionado).
  const porAno = useMemo(
    () =>
      agriculturaAnos.map((a) => {
        const sel = agriculturaDados.filter((d) => d.ano === a && (!produto || d.produto === produto));
        return { ano: a, valor: sum(sel.map((d) => d.valor)), area: sum(sel.map((d) => d.area)) };
      }),
    [produto]
  );

  // StatCards.
  const totalValor = sum(porProduto.map((d) => d.valor));
  const totalArea = sum(porProduto.map((d) => d.area));
  const top = porProduto[0];
  const prodSel = produto ? porProduto.find((d) => d.produto === produto) : null;

  const cards = prodSel
    ? [
        { icon: Banknote, label: `Valor · ${produto}`, value: brl(prodSel.valor), detail: escopoAno },
        { icon: Sprout, label: `Área · ${produto}`, value: `${nf.format(prodSel.area)} ha`, detail: escopoAno },
        { icon: Trophy, label: "Participação no valor", value: `${((prodSel.valor / totalValor) * 100).toFixed(1).replace(".", ",")}%`, detail: "do total da lavoura" },
        { icon: Wheat, label: "Maior produção", value: top?.produto || "—", detail: top ? brl(top.valor) : "" },
      ]
    : [
        { icon: Banknote, label: "Valor da produção", value: brl(totalValor), detail: escopoAno },
        { icon: Sprout, label: "Área plantada", value: `${nf.format(totalArea)} ha`, detail: escopoAno },
        { icon: Wheat, label: "Produtos cultivados", value: nf.format(porProduto.length), detail: escopoAno },
        { icon: Trophy, label: "Maior produção", value: top?.produto || "—", detail: top ? brl(top.valor) : "" },
      ];

  const toggleProduto = (p) => setProduto((cur) => (cur === p ? null : p));

  return (
    <div className="agr-page">
      <Filtros produto={produto} setProduto={setProduto} ano={ano} setAno={setAno} />

      <div className="agr-resumo-row">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} detail={c.detail} />
        ))}
      </div>

      <div className="agr-tabs" role="tablist" aria-label="Seções do painel">
        {[
          { id: "produto", label: "Por produto" },
          { id: "evolucao", label: "Evolução anual" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`agr-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="agr-tab-panel" key={`${tab}-${produto || "todos"}-${ano || "acc"}`}>
        {tab === "produto" ? (
          <>
            <section className="agr-card">
              <div className="agr-card-title">Área plantada por produto · Top {rankingArea.length} · {escopoAno}</div>
              <div className="agr-clickbars" style={{ width: "100%", height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingArea} layout="vertical" margin={{ top: 4, right: 56, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} />
                    <YAxis type="category" dataKey="produto" tick={{ fill: "#374151", fontSize: 11 }} width={120} />
                    <Tooltip formatter={(v) => [`${nf.format(v)} ha`, "Área plantada"]} contentStyle={tipStyle} cursor={{ fill: "rgba(10,79,159,0.05)" }} />
                    <Bar dataKey="area" radius={[0, 4, 4, 0]} isAnimationActive={false} onClick={(d) => toggleProduto(d.produto)}>
                      {rankingArea.map((d) => (
                        <Cell key={d.produto} fill={fillOf(produto, d.produto)} fillOpacity={dimOf(produto, d.produto)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <ProdutoTable porProduto={porProduto} produto={produto} escopoAno={escopoAno} />
          </>
        ) : (
          <div className="agr-evo-grid">
            <section className="agr-card">
              <div className="agr-card-title">Valor da produção por ano · {produto || "todos os produtos"}</div>
              <div className="agr-clickbars" style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={porAno} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                    <XAxis dataKey="ano" tick={{ fill: "#374151", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={brlEixo} width={48} />
                    <Tooltip formatter={(v) => [`R$ ${nf.format(v)}`, "Valor da produção"]} contentStyle={tipStyle} cursor={{ fill: "rgba(239,187,7,0.12)" }} />
                    <Bar dataKey="valor" radius={[4, 4, 0, 0]} isAnimationActive={false} onClick={(d) => setAno((cur) => (cur === d.ano ? null : d.ano))}>
                      {porAno.map((d) => (
                        <Cell key={d.ano} fill={ano === d.ano ? AMARELO : NAVY} fillOpacity={dimOf(ano, d.ano)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="agr-card">
              <div className="agr-card-title">Área plantada por ano · {produto || "todos os produtos"}</div>
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={porAno} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
                    <defs>
                      <linearGradient id="agrArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={AZUL} stopOpacity={0.32} />
                        <stop offset="100%" stopColor={AZUL} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                    <XAxis dataKey="ano" tick={{ fill: "#374151", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} width={54} />
                    <Tooltip formatter={(v) => [`${nf.format(v)} ha`, "Área plantada"]} contentStyle={tipStyle} />
                    <Area type="monotone" dataKey="area" stroke={NAVY} strokeWidth={2.5} fill="url(#agrArea)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        )}
      </div>

      <p className="agr-source">Fonte: <b>IBGE</b> · Produção Agrícola Municipal · Campo Grande - MS · 2015–2023</p>
    </div>
  );
}

// ── Tabela por produto (ordenável) ────────────────────────────────────────────
const COLS = [
  { key: "produto", label: "Produto", numeric: false },
  { key: "area", label: "Área plantada (ha)", numeric: true },
  { key: "valor", label: "Valor da produção (R$)", numeric: true },
];

function ProdutoTable({ porProduto, produto, escopoAno }) {
  const [sortKey, setSortKey] = useState("valor");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const copy = [...porProduto];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv, "pt-BR") : av - bv;
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [porProduto, sortKey, asc]);

  const handleSort = (key) => {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(key === "produto");
    }
  };

  return (
    <section className="agr-card">
      <div className="agr-card-title">Produtos · {rows.length} · {escopoAno}</div>
      <div className="agr-table-scroll">
        <table className="agr-table">
          <thead>
            <tr>
              {COLS.map((c) => (
                <th key={c.key} className={c.numeric ? "num" : ""} aria-sort={sortKey === c.key ? (asc ? "ascending" : "descending") : "none"}>
                  <button type="button" className="agr-th-btn" onClick={() => handleSort(c.key)}>
                    {c.label}
                    {sortKey === c.key && (asc ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.produto} className={produto === r.produto ? "sel" : ""}>
                <td className="agr-td-name">{r.produto}</td>
                <td className="num">{nf.format(r.area)}</td>
                <td className="num">{nf.format(r.valor)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="num">{nf.format(sum(rows.map((r) => r.area)))}</td>
              <td className="num">{nf.format(sum(rows.map((r) => r.valor)))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
