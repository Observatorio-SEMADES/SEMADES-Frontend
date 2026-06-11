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

// Donut compacto (coluna): gráfico centralizado + legenda em grid 2×5.
// Sempre exibido lado a lado em .donut-cards-row.
function DonutCard({ title, subtitle, ariaLabel, data, centerLabel = ["Top 10", "Área de Lote"] }) {
  const [hover, setHover] = useState(null);

  return (
    <section className="dados-card donut-compact">
      <div className="chart-header-left">
        {title}
        {subtitle && <span className="chart-subtitle"> - {subtitle}</span>}
      </div>

      <div className="chart-box-compact">
        <div style={{ width: "100%", maxWidth: 210, height: 210 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart aria-label={ariaLabel} role="img">
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={98}
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
                        <text x={cx} y={cy - 5} textAnchor="middle" fontWeight="700" fontSize="13" fill="#1f2933">
                          {centerLabel[0]}
                        </text>
                        <text x={cx} y={cy + 13} textAnchor="middle" fontSize="11" fill="#666">
                          {centerLabel[1]}
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
        <div className="legend-list legend-grid" onMouseLeave={() => setHover(null)}>
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

// Barras horizontais (layout="vertical" no recharts).
// Labels do eixo Y ficam legíveis sem rotação; eixo X mostra a escala de valores.
function BarCard({ title, data, valueFormatter, yTicks, yDomain, yTickFormatter }) {
  return (
    <section className="dados-card bar-card">
      <div className="chart-header-left">{title}</div>

      <div className="bar-chart-wrap">
        <div style={{ width: "100%", height: 310 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis
                type="number"
                domain={yDomain}
                ticks={yTicks}
                tickFormatter={yTickFormatter}
                tick={{ fill: "#6b7280", fontSize: 9 }}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: "#6b7280", fontSize: 9 }}
                width={96}
              />
              <Tooltip
                formatter={(value) => [valueFormatter(value), null]}
                contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="value" fill={BAR_FILL} radius={[0, 3, 3, 0]} isAnimationActive={false} />
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
              detail={item.detail}
            />
          ))}
        </div>

        <div className="looker-linkcard looker-disabled" aria-disabled="true">
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
            <span className="looker-soon-badge">Em breve</span>
          </div>
        </div>
      </div>

      {/* ===== 2 DONUTS LADO A LADO ===== */}
      <div className="donut-cards-row">
        <DonutCard
          title="Área de Lote por Bairro (Top 10)"
          subtitle="Planurb, 2025"
          ariaLabel="Área de Lote por Bairro (Top 10)"
          data={areaLotePorBairro}
          centerLabel={["Top 10", "Por Bairro"]}
        />
        <DonutCard
          title="Área de Lote por Proprietário (Top 10)"
          subtitle="Planurb, 2025"
          ariaLabel="Área de Lote por Proprietário (Top 10)"
          data={areaLotePorProprietario}
          centerLabel={["Top 10", "Proprietário"]}
        />
      </div>

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
