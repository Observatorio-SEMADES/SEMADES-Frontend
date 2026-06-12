import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Beef, Bird, PiggyBank, Drumstick, Scale, Layers } from "lucide-react";
import StatCard from "../../ui/StatCard";
import FilterDropdown from "../../ui/FilterDropdown";
import {
  rebanhoAnimais,
  rebanhoAnos,
  rebanhoDados,
  abateAnimais,
  abateMeses,
  abateDados,
} from "../../../data/pecuaria";

// Paleta institucional (navy #0a4f9f, azul claro #2f86d6, amarelo #efbb07).
const NAVY = "#0a4f9f";
const AMARELO = "#efbb07";

const nf = new Intl.NumberFormat("pt-BR");
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const tipStyle = { borderRadius: 8, border: "1px solid #e5e7eb" };
const dimOf = (sel, key) => (sel && sel !== key ? 0.28 : 1);
// Barra destacada quando há seleção: amarelo no escolhido, navy nos demais.
const fillOf = (sel, key) => (sel === key ? AMARELO : NAVY);

const ICONE_ANIMAL = {
  Bovinos: Beef,
  Galináceo: Bird,
  Frangos: Drumstick,
  Suínos: PiggyBank,
  Ovinos: Layers,
  Caprinos: Layers,
};

// ── Barra de filtro genérica (chips estilo BI) ────────────────────────────────
function ChipFilter({ label, allLabel, options, value, onChange }) {
  return (
    <div className="pec-filter" role="group" aria-label={`Filtrar por ${label}`}>
      <span className="pec-filter-label">{label}:</span>
      <div className="pec-chips">
        <button
          type="button"
          className={`pec-chip${value === null ? " active" : ""}`}
          aria-pressed={value === null}
          onClick={() => onChange(null)}
        >
          {allLabel}
        </button>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`pec-chip${value === o ? " active" : ""}`}
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

// ── ABA REBANHO · Campo Grande (IBGE, 2019–2023) ──────────────────────────────
const rebQtd = (animal, ano) =>
  rebanhoDados.find((d) => d.animal === animal && d.ano === ano)?.quantidade || 0;

function RebanhoTab() {
  const [animal, setAnimal] = useState(null);
  const [ano, setAno] = useState(null);
  const refAno = ano || rebanhoAnos[rebanhoAnos.length - 1]; // sem filtro → ano mais recente

  const porAnimal = useMemo(
    () => rebanhoAnimais.map((a) => ({ animal: a, quantidade: rebQtd(a, refAno) })),
    [refAno]
  );
  const evolucao = useMemo(
    () =>
      rebanhoAnos.map((an) => ({
        ano: an,
        quantidade: animal
          ? rebQtd(animal, an)
          : sum(rebanhoDados.filter((d) => d.ano === an).map((d) => d.quantidade)),
      })),
    [animal]
  );

  const totalRef = sum(porAnimal.map((d) => d.quantidade));
  const cards = [
    { icon: Layers, label: `Rebanho total · ${refAno}`, value: nf.format(totalRef), detail: "cabeças (IBGE)" },
    { icon: Beef, label: "Bovinos", value: nf.format(rebQtd("Bovinos", refAno)) },
    { icon: Bird, label: "Galináceo", value: nf.format(rebQtd("Galináceo", refAno)) },
    { icon: PiggyBank, label: "Suínos", value: nf.format(rebQtd("Suínos", refAno)) },
  ];

  const toggleAnimal = (a) => setAnimal((cur) => (cur === a ? null : a));

  return (
    <div className="pec-tab-panel" key={`reb-${animal || "todos"}-${ano || "all"}`}>
      <div className="pec-filters">
        <ChipFilter label="Animal" allLabel="Todos os animais" options={rebanhoAnimais} value={animal} onChange={setAnimal} />
        <div className="pec-filter">
          <span className="pec-filter-label">Ano:</span>
          <FilterDropdown allLabel="Mais recente" options={rebanhoAnos} value={ano} onChange={setAno} />
        </div>
      </div>

      <div className="pec-resumo-row">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} detail={c.detail} />
        ))}
      </div>

      <div className="pec-top-row">
        <section className="pec-card">
          <div className="pec-card-title">Rebanho por animal · {refAno}</div>
          <div className="pec-clickbars" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porAnimal} layout="vertical" margin={{ top: 4, right: 48, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} />
                <YAxis type="category" dataKey="animal" tick={{ fill: "#374151", fontSize: 11 }} width={84} />
                <Tooltip formatter={(v) => [`${nf.format(v)} cabeças`, null]} contentStyle={tipStyle} cursor={{ fill: "rgba(10,79,159,0.05)" }} />
                <Bar dataKey="quantidade" radius={[0, 4, 4, 0]} isAnimationActive={false} onClick={(d) => toggleAnimal(d.animal)}>
                  {porAnimal.map((d) => (
                    <Cell key={d.animal} fill={fillOf(animal, d.animal)} fillOpacity={dimOf(animal, d.animal)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="pec-card">
          <div className="pec-card-title">Evolução do rebanho · {animal || "total"} (2019–2023)</div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucao} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="ano" tick={{ fill: "#6b7280", fontSize: 11 }} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} width={54} />
                <Tooltip formatter={(v) => [`${nf.format(v)} cabeças`, null]} contentStyle={tipStyle} />
                <Line type="monotone" dataKey="quantidade" stroke={NAVY} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="pec-card">
        <div className="pec-card-title">Efetivo do rebanho por animal e ano · cabeças</div>
        <div className="pec-table-scroll">
          <table className="pec-table">
            <thead>
              <tr>
                <th>Animal</th>
                {rebanhoAnos.map((an) => (
                  <th key={an} className="num">{an}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rebanhoAnimais.map((a) => (
                <tr key={a} className={animal === a ? "sel" : ""}>
                  <td className="pec-td-name">{a}</td>
                  {rebanhoAnos.map((an) => (
                    <td key={an} className="num">{nf.format(rebQtd(a, an))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                {rebanhoAnos.map((an) => (
                  <td key={an} className="num">
                    {nf.format(sum(rebanhoAnimais.map((a) => rebQtd(a, an))))}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <p className="pec-source">Fonte: <b>IBGE</b> · Efetivo dos rebanhos de Campo Grande - MS · 2019–2023</p>
    </div>
  );
}

// ── ABA ABATE · Mato Grosso do Sul (2024) ─────────────────────────────────────
function AbateTab() {
  const [animal, setAnimal] = useState(null);
  const [mes, setMes] = useState(null);

  const noMes = (d) => !mes || d.mes === mes;

  // Peso por animal (no escopo do mês), para o gráfico comparável.
  const porAnimal = useMemo(
    () =>
      abateAnimais.map((a) => ({
        animal: a,
        peso: sum(abateDados.filter((d) => d.animal === a && noMes(d)).map((d) => d.peso)),
        unidades: sum(abateDados.filter((d) => d.animal === a && noMes(d)).map((d) => d.unidades)),
      })),
    [mes]
  );

  // Evolução mensal por peso (toneladas, somável): total ou animal selecionado.
  const evolucao = useMemo(
    () =>
      abateMeses.map((m) => ({
        mes: m,
        peso: sum(
          abateDados.filter((d) => d.mes === m && (!animal || d.animal === animal)).map((d) => d.peso)
        ),
      })),
    [animal]
  );

  // Tabela mensal: Unidades + Peso (filtra por animal).
  const tableRows = useMemo(
    () =>
      abateMeses.map((m) => {
        const sel = abateDados.filter((d) => d.mes === m && (!animal || d.animal === animal));
        return { mes: m, unidades: sum(sel.map((d) => d.unidades)), peso: sum(sel.map((d) => d.peso)) };
      }),
    [animal]
  );

  const un = (a) => porAnimal.find((d) => d.animal === a)?.unidades || 0;
  const pesoTotal = sum(porAnimal.map((d) => d.peso));
  const escopo = mes ? ` · ${mes}` : " · 2024";
  const cards = [
    { icon: Scale, label: `Peso abatido${escopo}`, value: `${nf.format(pesoTotal)} t`, detail: "todas as espécies" },
    { icon: Beef, label: "Bovinos", value: nf.format(un("Bovinos")), detail: "unidades" },
    { icon: PiggyBank, label: "Suínos", value: nf.format(un("Suínos")), detail: "unidades" },
    { icon: Drumstick, label: "Frangos", value: nf.format(un("Frangos")), detail: "unidades" },
  ];

  const toggleAnimal = (a) => setAnimal((cur) => (cur === a ? null : a));

  return (
    <div className="pec-tab-panel" key={`ab-${animal || "todos"}-${mes || "all"}`}>
      <div className="pec-filters">
        <ChipFilter label="Animal" allLabel="Todos os animais" options={abateAnimais} value={animal} onChange={setAnimal} />
        <div className="pec-filter">
          <span className="pec-filter-label">Mês:</span>
          <FilterDropdown allLabel="Ano inteiro" options={abateMeses} value={mes} onChange={setMes} />
        </div>
      </div>

      <div className="pec-resumo-row">
        {cards.map((c) => (
          <StatCard key={c.label} icon={c.icon} label={c.label} value={c.value} detail={c.detail} />
        ))}
      </div>

      <div className="pec-top-row">
        <section className="pec-card">
          <div className="pec-card-title">Abate por animal · peso (toneladas){escopo}</div>
          <div className="pec-clickbars" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porAnimal} layout="vertical" margin={{ top: 4, right: 56, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} />
                <YAxis type="category" dataKey="animal" tick={{ fill: "#374151", fontSize: 11 }} width={78} />
                <Tooltip formatter={(v) => [`${nf.format(v)} t`, null]} contentStyle={tipStyle} cursor={{ fill: "rgba(10,79,159,0.05)" }} />
                <Bar dataKey="peso" radius={[0, 4, 4, 0]} isAnimationActive={false} onClick={(d) => toggleAnimal(d.animal)}>
                  {porAnimal.map((d) => (
                    <Cell key={d.animal} fill={fillOf(animal, d.animal)} fillOpacity={dimOf(animal, d.animal)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="pec-card">
          <div className="pec-card-title">Abate mensal · peso (toneladas) · {animal || "total"}</div>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucao} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={(v) => nf.format(v)} width={54} />
                <Tooltip formatter={(v) => [`${nf.format(v)} t`, null]} contentStyle={tipStyle} />
                <Line type="monotone" dataKey="peso" stroke={NAVY} strokeWidth={2.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="pec-card">
        <div className="pec-card-title">Abate mês a mês · {animal || "todos os animais"} (2024)</div>
        <div className="pec-table-scroll">
          <table className="pec-table">
            <thead>
              <tr>
                <th>Mês</th>
                <th className="num">Unidades abatidas</th>
                <th className="num">Peso (toneladas)</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr key={r.mes}>
                  <td className="pec-td-name">{r.mes}</td>
                  <td className="num">{nf.format(r.unidades)}</td>
                  <td className="num">{nf.format(r.peso)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td className="num">{nf.format(sum(tableRows.map((r) => r.unidades)))}</td>
                <td className="num">{nf.format(sum(tableRows.map((r) => r.peso)))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <p className="pec-source">Fonte: Abate de <b>Mato Grosso do Sul</b> (estado) · 2024</p>
    </div>
  );
}

const TABS = [
  { id: "rebanho", label: "Rebanho · Campo Grande" },
  { id: "abate", label: "Abate · Mato Grosso do Sul" },
];

export default function Pecuaria() {
  const [tab, setTab] = useState("rebanho");

  return (
    <div className="pec-page">
      <div className="pec-tabs" role="tablist" aria-label="Seções do painel">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`pec-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="pec-tab-panel"
            className={`pec-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "rebanho" ? <RebanhoTab /> : <AbateTab />}
    </div>
  );
}
