import React, { useState } from "react";
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
import StatCard from "../ui/StatCard";
import {
  resumoCentro,
  areaLotePorBairro,
  areaLotePorProprietario,
  proprietariosImoveisQtd,
  proprietariosValorAcumulado,
} from "../../data/dadosCentro";

// Paleta de 10 tons de azul (espelha --blue-1..10 de DadosCentro.css, usada nas
// fatias dos donuts e nos swatches da legenda).
const BLUE_PALETTE = [
  "#021a3b", "#053a6b", "#0a4e8f", "#0f66b3", "#1a80d6",
  "#3399e6", "#66b3f0", "#9cc9f8", "#cfe9ff", "#ecf7ff",
];
const BAR_FILL = "#0a4e8f";

const moneyBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

// Donut (recharts) + legenda lateral. Passar o mouse numa fatia ou num item da
// legenda destaca os dois (estado `hover` compartilhado). Substitui o SVG e o
// cálculo de ângulos feitos à mão.
function DonutCard({ title, subtitle, ariaLabel, data }) {
  const [hover, setHover] = useState(null);

  return (
    <section className="dados-card">
      <div className="chart-header-left">
        {title}
        {subtitle && <span className="chart-subtitle"> - {subtitle}</span>}
      </div>

      <div className="chart-box">
        <div style={{ width: "100%", maxWidth: 340, height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart aria-label={ariaLabel} role="img">
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={140}
                startAngle={90}
                endAngle={-270}
                stroke="#fff"
                strokeWidth={2}
                isAnimationActive={false}
                onMouseEnter={(_, i) => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.label}
                    fill={BLUE_PALETTE[i % BLUE_PALETTE.length]}
                    fillOpacity={hover !== null && hover !== i ? 0.32 : 1}
                  />
                ))}
                <Label
                  position="center"
                  content={({ viewBox }) => {
                    const { cx, cy } = viewBox;
                    return (
                      <g>
                        <text x={cx} y={cy - 6} textAnchor="middle" fontWeight="700" fontSize="16" fill="#1f2933">
                          Top 10
                        </text>
                        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="12" fill="#666">
                          Área de Lote
                        </text>
                      </g>
                    );
                  }}
                />
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="legend-box">
        <div className="legend-list" onMouseLeave={() => setHover(null)}>
          {data.map((d, i) => (
            <div
              className={[
                "legend-item",
                hover !== null && hover !== i ? "dimmed" : "",
                hover === i ? "hovered" : "",
              ].join(" ")}
              key={d.label}
              onMouseEnter={() => setHover(i)}
            >
              <div className={`legend-swatch swatch-${i + 1}`}></div>
              <div className="legend-label">{d.label}</div>
              <div className="legend-value">{d.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Card de barras verticais (recharts). Substitui o plot em divs com grid, labels
// e tooltip manuais. `valueFormatter` formata o tooltip; `tickFormatter`/`ticks`
// controlam a escala do eixo Y.
function BarCard({ title, data, valueFormatter, yTicks, yDomain, yTickFormatter }) {
  return (
    <section className="dados-card bar-card">
      <div className="chart-header-left">{title}</div>

      <div className="bar-chart-wrap">
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 36 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#6b7280", fontSize: 9 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 10 }}
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={yTickFormatter}
                width={56}
              />
              <Tooltip
                formatter={(value) => [valueFormatter(value), null]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="value" fill={BAR_FILL} radius={[3, 3, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bar-source">
          Fonte: <b>Planurb</b> - 2025
        </div>
      </div>
    </section>
  );
}

export default function DadosCentro() {
  return (
    <>
      {/* ===== CARDS RESUMO + CARD LOOKER (ANTES DE TODOS OS GRÁFICOS) ===== */}
      <div className="resumo-row">
        <div className="resumo-cards">
          {resumoCentro.map((item) => (
            <StatCard
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>

        <a
          className="looker-linkcard"
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir Looker do Centro de Campo Grande - MS"
          // href="https://lookerstudio.google.com/u/0/reporting/e7c4b698-6d0f-41c3-92cc-5e882c02d6d1/page/1U2bF"
        >
          <div className="looker-card">
            <img
              className="looker-flag"
              src="/imagens-cg/BandeiraCampoGrandeMS.png"
              alt="Bandeira de Campo Grande - MS"
            />
            <div className="looker-text">
              <div className="looker-title">Dashboard dos Indicadores do Centro de Campo Grande - MS</div>
              <div className="looker-meta">PLANURB, 2025</div>
              <div className="looker-desc">Para uma observação mais detalhada</div>
            </div>
          </div>
        </a>
      </div>

      {/* ===== DONUTS ===== */}
      <DonutCard
        title="Área de Lote por Bairro (Top 10)"
        subtitle="Planurb, 2025"
        ariaLabel="Área de Lote por Bairro (Top 10)"
        data={areaLotePorBairro}
      />

      <DonutCard
        title="Área de Lote por Proprietário (Top 10)"
        subtitle="Planurb, 2025"
        ariaLabel="Área de Lote por Proprietário (Top 10)"
        data={areaLotePorProprietario}
      />

      {/* ===== 2 CARDS DE BARRAS LADO A LADO ===== */}
      <div className="bar-cards-row">
        <BarCard
          title="Proprietários por Quantidade de Imóveis"
          data={proprietariosImoveisQtd}
          valueFormatter={(value) => `${value} Imóveis`}
          yDomain={[0, 80]}
          yTicks={[0, 20, 40, 60, 80]}
          yTickFormatter={(v) => v}
        />

        <BarCard
          title="Proprietários por Valor Acumulado em Imóveis"
          data={proprietariosValorAcumulado}
          valueFormatter={(value) => moneyBRL.format(value)}
          yDomain={[0, 1500000000]}
          yTicks={[0, 500000000, 1000000000, 1500000000]}
          yTickFormatter={(v) => (v === 0 ? "0" : `${(v / 1000000000).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} bi`)}
        />
      </div>
    </>
  );
}
