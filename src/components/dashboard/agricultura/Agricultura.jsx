import React, { useCallback, useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Banknote, Sprout, Wheat, X } from "lucide-react";
import FilterDropdown from "../../ui/FilterDropdown";
import StatCard from "../../ui/StatCard";
import SourceMeta from "../../ui/SourceMeta";
import { useDialog } from "../../../hooks/useDialog";
import { pamProdutos, pamTotais, metaIbge } from "../../../data/observatorio";
import { milReaisParaReais } from "../../../data/fontesOficiais";
import { formatMoney, formatNumber, unique, sumAvailable } from "../../../data/observatorioCsv";

const years = unique(pamTotais.map((row) => row.ano));
const latest = years.at(-1);
const products = unique(pamProdutos.map((row) => row.produto));
const axis = { fill: "#6b7280", fontSize: 11 };
const MAIN_CROPS = new Set([
  "Soja (em grão)",
  "Milho (em grão)",
  "Sorgo (em grão)",
  "Cana-de-açúcar",
  "Algodão herbáceo (em caroço)",
  "Amendoim (em casca)",
]);
const SERIES_COLORS = [
  "#0a4f9f", "#9b7100", "#16845b", "#b45309", "#7c3aed", "#c2415b",
  "#087e8b", "#475569", "#5b7c2a", "#b83280", "#2563eb", "#a16207",
  "#0f766e", "#9333ea", "#be123c", "#0369a1", "#4d7c0f", "#c026d3",
  "#1d4ed8", "#a21caf", "#166534", "#9f1239", "#155e75", "#713f12",
  "#4c1d95", "#0e7490", "#854d0e", "#9d174d", "#374151",
];
const cell = (value, marker, format = formatNumber) =>
  value != null ? format(value) : marker ? marker + " (IBGE)" : "Sem dado";
const quantityUnits = unique(pamProdutos.filter((row) => row.quantidade_produzida != null).map((row) => row.unidade_quantidade));
const allProductsComparable = quantityUnits.length <= 1;
const soyProduct = "Soja (em grão)";

function QuantityYearModal({ title, period, items, unit, onClose }) {
  const dialogRef = useDialog(onClose);

  return (
    <div
      className="agr-quantity-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="agr-quantity-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agr-quantity-dialog-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="agr-quantity-dialog-header">
          <div>
            <h3 id="agr-quantity-dialog-title">{title}</h3>
            <p>Campo Grande (MS) · {period} · Unidade: {unit} · IBGE PAM, SIDRA 5457</p>
          </div>
          <button type="button" className="agr-quantity-dialog-close" onClick={onClose} aria-label="Fechar detalhes">
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <dl className="agr-quantity-dialog-list">
          {items.map((item) => (
            <div className="agr-quantity-dialog-row" key={item.label ?? item.product}>
              <dt><span className="agr-quantity-swatch" style={{ backgroundColor: item.color }} aria-hidden="true" />{item.label ?? item.product}</dt>
              <dd>{item.value == null ? "Sem dado" : formatNumber(item.value) + " " + unit}</dd>
            </div>
          ))}
        </dl>
        <footer className="agr-quantity-dialog-footer">Valores ausentes na tabela do IBGE permanecem como ausência, não como zero.</footer>
      </section>
    </div>
  );
}

export default function Agricultura({ tab = "produto" }) {
  const [year, setYear] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantityDetails, setQuantityDetails] = useState(null);
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
  const mainRows = [...productRows]
    .filter((row) => MAIN_CROPS.has(row.produto))
    .sort((a, b) => (b.area ?? -1) - (a.area ?? -1));
  const otherRows = [...productRows]
    .filter((row) => !MAIN_CROPS.has(row.produto))
    .sort((a, b) => (b.area ?? -1) - (a.area ?? -1));
  const history = years.map((ano) => {
    const row = product
      ? pamProdutos.find((item) => item.ano === ano && item.produto === product)
      : pamTotais.find((item) => item.ano === ano);
    return {
      ano,
      valor: milReaisParaReais(row?.valor_producao_mil_reais ?? null),
      area: row?.area_plantada_ha ?? null,
    };
  });
  const productTotalMil = sumAvailable(productRows.map((row) => row.valorMil));
  const productArea = sumAvailable(productRows.map((row) => row.area));
  const quantitySeries = product ? [product] : allProductsComparable ? products : [];
  const quantityUnit = product
    ? pamProdutos.find((row) => row.produto === product && row.unidade_quantidade)?.unidade_quantidade
    : quantityUnits[0];
  const quantityHistory = years.map((ano) => {
    const row = { ano };
    quantitySeries.forEach((name) => {
      row[name] = pamProdutos.find((item) => item.ano === ano && item.produto === name)?.quantidade_produzida ?? null;
    });
    return row;
  });
  const quantityPanels = quantitySeries.map((name) => ({
    product: name,
    color: SERIES_COLORS[products.indexOf(name) % SERIES_COLORS.length],
    history: quantityHistory.map((row) => ({ ano: row.ano, quantidade: row[name] })),
  }));
  const soybeanHistory = years.map((ano) => {
    const row = pamProdutos.find((item) => item.ano === ano && item.produto === soyProduct);
    const value = row?.valor_producao_mil_reais;
    const quantity = row?.quantidade_produzida;
    return {
      ano,
      media: value != null && quantity != null && quantity > 0
        ? milReaisParaReais(value) / quantity
        : null,
    };
  });
  const closeQuantityDetails = useCallback(() => setQuantityDetails(null), []);
  const openQuantityDetails = (index, selectedProduct = product) => {
    const row = quantityHistory[index];
    if (!row) return;
    const names = selectedProduct ? [selectedProduct] : quantitySeries;
    const items = names.map((name) => ({
      product: name,
      value: row[name],
      color: SERIES_COLORS[products.indexOf(name) % SERIES_COLORS.length],
    }));
    if (!items.length) return;
    setQuantityDetails({
      title: selectedProduct
        ? `Quantidade produzida · ${selectedProduct} · ${row.ano}`
        : `Quantidade produzida · todas as culturas · ${row.ano}`,
      period: row.ano,
      items,
      unit: quantityUnit || "unidade da PAM",
    });
  };
  const openQuantityPoint = (panel, row) => {
    setQuantityDetails({
      title: `Quantidade produzida · ${panel.product} · ${row.ano}`,
      period: row.ano,
      items: [{ product: panel.product, value: row.quantidade, color: panel.color }],
      unit: quantityUnit || "unidade da PAM",
    });
  };
  const openQuantitySeries = (panel) => {
    setQuantityDetails({
      title: `Série anual · ${panel.product}`,
      period: historyPeriod,
      items: panel.history.map((row) => ({
        label: row.ano,
        value: row.quantidade,
        color: panel.color,
      })),
      unit: quantityUnit || "unidade da PAM",
    });
  };
  const soy2025 = soybeanHistory.find((row) => row.ano === "2025")?.media ?? null;
  const metaRows = metaIbge(
    product
      ? pamProdutos.filter((row) => row.ano === chosen && row.produto === product)
      : [total].filter(Boolean),
    "IBGE PAM · SIDRA 5457"
  );
  const historyPeriod = years[0] + "–" + years.at(-1);
  const chartContext = "Campo Grande (MS) · " + chosen + " · Fonte: IBGE PAM, SIDRA 5457";

  return (
    <div className="agr-page">
      <div className="agr-filters">
        <div className="agr-filter">
          <span className="agr-filter-label">Produto:</span>
          <FilterDropdown allLabel="Todos os produtos" options={products} value={product} onChange={setProduct} minWidth="13rem" />
        </div>
        <div className="agr-filter">
          <span className="agr-filter-label">Ano:</span>
          <FilterDropdown allLabel={latest} options={years} value={year} onChange={setYear} />
        </div>
      </div>
      <SourceMeta
        rows={metaRows}
        period={chosen}
        unit="valor da produção em mil R$ na fonte; área em hectares; quantidade na unidade de cada produto"
        note="Cartões gerais usam o total oficial da PAM. A soma das áreas por cultura não representa área física única. Valores ausentes e marcadores do IBGE (incluindo “-” e “..”) permanecem como ausência, nunca como zero."
      />
      <div className="agr-resumo-row">
        <StatCard icon={Banknote} label={"Valor da produção · " + (product || "total")} value={valueMil == null ? cell(null, selected?.valorMarker) : formatMoney(milReaisParaReais(valueMil))} detail={valueMil == null ? chosen : formatNumber(valueMil) + " mil R$ · " + chosen} />
        <StatCard icon={Sprout} label={"Área plantada ou destinada à colheita · " + (product || "total")} value={area == null ? cell(null, selected?.areaMarker) : formatNumber(area) + " ha"} detail={chosen} />
        <StatCard icon={Wheat} label="Produtos no recorte" value={formatNumber(productRows.length)} detail={chosen} />
      </div>
      {tab === "produto" ? (
        <>
          <div className="agr-area-grid">
            {[
              { id: "main", title: "Culturas principais", rows: mainRows, color: "#0a4f9f" },
              { id: "other", title: "Mandioca e demais culturas", rows: otherRows, color: "#16845b" },
            ].map((group) => (
              <section className="agr-card" key={group.id}>
                <div className="agr-card-title">{group.title} · área (ha) · {chartContext}</div>
                {group.rows.length ? (
                  <div style={{ height: Math.max(320, group.rows.length * 28 + 76) }}>
                    <ResponsiveContainer>
                      <BarChart data={group.rows} layout="vertical" margin={{ right: 30, left: 18 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                        <XAxis type="number" tick={axis} tickFormatter={formatNumber} />
                        <YAxis type="category" dataKey="produto" width={164} tick={axis} />
                        <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " ha"} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="area" name="Área plantada ou destinada à colheita (ha)" fill={group.color} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="agr-chart-empty">Nenhuma cultura deste grupo tem registro no recorte selecionado.</p>
                )}
                <p className="agr-chart-context">Campo Grande (MS) · {chosen} · Unidade: hectares (ha) · IBGE PAM, SIDRA 5457</p>
              </section>
            ))}
          </div>
          <section className="agr-card">
            <div className="agr-card-title">Culturas e valores · Campo Grande (MS) · {chosen}</div>
            <div className="agr-table-scroll">
              <table className="agr-table">
                <thead><tr><th>Produto</th><th className="num">Área plantada (ha)</th><th className="num">Quantidade produzida</th><th className="num">Valor (mil R$)</th></tr></thead>
                <tbody>
                  {[...productRows]
                    .sort((a, b) => (b.valorMil ?? -1) - (a.valorMil ?? -1))
                    .map((row) => (
                      <tr key={row.produto}>
                        <td className="agr-td-name">{row.produto}</td>
                        <td className="num">{cell(row.area, row.areaMarker)}</td>
                        <td className="num">{row.quantidade == null ? cell(null, row.quantidadeMarker) : formatNumber(row.quantidade) + (row.unidade ? " " + row.unidade.toLowerCase() : "")}</td>
                        <td className="num">{cell(row.valorMil, row.valorMarker)}</td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>{product ? "Total do produto" : productTotalMil === total?.valor_producao_mil_reais ? "Soma dos produtos · confere com o total oficial PAM " + chosen : "Soma dos produtos · total oficial PAM " + chosen + ": " + formatNumber(total?.valor_producao_mil_reais) + " mil R$"}</td>
                    <td className="num">{formatNumber(productArea)}</td>
                    <td className="num">—</td>
                    <td className="num">{formatNumber(productTotalMil)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </>
      ) : (
        <div className="agr-evo-grid">
          <section className="agr-card">
            <div className="agr-card-title">Valor da produção por ano · {product || "total oficial da PAM"}</div>
            <div className="agr-chart-context">Campo Grande (MS) · {historyPeriod} · Unidade: R$ nominais · IBGE PAM, SIDRA 5457</div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="ano" tick={axis} />
                  <YAxis tick={axis} tickFormatter={formatNumber} width={100} />
                  <Tooltip formatter={formatMoney} />
                  <Bar dataKey="valor" name="Valor da produção (R$)" fill="#0a4f9f" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="agr-card">
            <div className="agr-card-title">Área plantada por ano · {product || "total oficial da PAM"}</div>
            <div className="agr-chart-context">Campo Grande (MS) · {historyPeriod} · Unidade: hectares (ha) · IBGE PAM, SIDRA 5457</div>
            <div style={{ height: 320 }}>
              <ResponsiveContainer>
                <AreaChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="ano" tick={axis} />
                  <YAxis tick={axis} tickFormatter={formatNumber} width={76} />
                  <Tooltip formatter={(value) => value == null ? "Sem dado" : formatNumber(value) + " ha"} />
                  <Area dataKey="area" name="Área plantada ou destinada à colheita (ha)" stroke="#0a4f9f" fill="#dbeafe" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="agr-card agr-quantity-section">
            <div className="agr-card-title">Quantidade produzida por ano · {product || "todas as culturas em gráficos separados"}</div>
            <div className="agr-chart-context">
              Campo Grande (MS) · {historyPeriod} · Unidade: {quantityUnit || "unidade da PAM"} · Escala vertical própria por cultura · Fonte: IBGE PAM, SIDRA 5457
            </div>
            {quantityPanels.length ? (
              <>
                <div className="agr-quantity-grid">
                  {quantityPanels.map((panel) => {
                    const latestQuantity = panel.history.at(-1)?.quantidade ?? null;
                    return (
                      <section className="agr-quantity-panel" key={panel.product}>
                        <header className="agr-quantity-panel-header">
                          <h4>{panel.product}</h4>
                          <span className="agr-quantity-latest">
                            {panel.history.at(-1)?.ano} · {latestQuantity == null ? "Sem dado" : formatNumber(latestQuantity) + " " + (quantityUnit || "unidade da PAM")}
                          </span>
                        </header>
                        <div
                          className="agr-quantity-chart"
                          role="img"
                          aria-label={`${panel.product}: quantidade produzida por ano, ${historyPeriod}, em ${quantityUnit || "unidade da PAM"}`}
                        >
                          <ResponsiveContainer>
                            <LineChart data={panel.history} margin={{ top: 8, right: 8, left: 0, bottom: 2 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                              <XAxis dataKey="ano" tick={axis} interval={2} minTickGap={12} tickMargin={6} />
                              <YAxis tick={axis} tickFormatter={formatNumber} width={72} tickCount={3} domain={["auto", "auto"]} />
                              <Line
                                dataKey="quantidade"
                                name={panel.product}
                                stroke={panel.color}
                                strokeWidth={2.7}
                                strokeLinecap="round"
                                dot={(dotProps) => {
                                  const { cx, cy, payload } = dotProps;
                                  if (!Number.isFinite(cx) || !Number.isFinite(cy) || payload?.quantidade == null) return null;
                                  return (
                                    <g
                                      key={`${panel.product}-${payload.ano}`}
                                      className="agr-quantity-point"
                                      transform={`translate(${cx}, ${cy})`}
                                      aria-hidden="true"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openQuantityPoint(panel, payload);
                                      }}
                                    >
                                      <circle r={10} fill="transparent" />
                                      <circle r={3.5} className="agr-quantity-point-mark" fill="#fff" stroke={panel.color} strokeWidth={2} />
                                    </g>
                                  );
                                }}
                                activeDot={false}
                                connectNulls={false}
                                isAnimationActive={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <button
                          type="button"
                          className="agr-quantity-series-button"
                          aria-label={`Abrir os valores anuais de ${panel.product}`}
                          onClick={() => openQuantitySeries(panel)}
                        >
                          Dados da série
                        </button>
                      </section>
                    );
                  })}
                </div>
                <p className="agr-chart-context agr-quantity-note">Cada gráfico mostra uma cultura e usa escala vertical própria. Clique em um ponto para ver o valor daquele ano ou abra “Dados da série” para consultar todos os anos. Nenhuma cultura é somada a outra.</p>
                <button
                  type="button"
                  className="agr-quantity-details-button"
                  onClick={() => openQuantityDetails(quantityHistory.length - 1, product)}
                  disabled={!quantityHistory.length}
                >
                  {product ? `Abrir valor de ${quantityHistory.at(-1)?.ano || "produção"}` : `Abrir valores de todas as culturas · ${quantityHistory.at(-1)?.ano || "produção"}`}
                </button>
              </>
            ) : (
              <p className="agr-chart-empty">As unidades da PAM não permitem comparar todas as culturas neste gráfico. Selecione um produto no filtro para ver a série anual.</p>
            )}
          </section>
          <section className="agr-card agr-soybean-history">
            <div className="agr-card-title">Valor médio da produção da soja (R$/t)</div>
            <div className="agr-chart-context">Campo Grande (MS) · {historyPeriod} · IBGE PAM, SIDRA 5457</div>
            <div style={{ height: 340 }}>
              <ResponsiveContainer>
                <LineChart data={soybeanHistory} margin={{ right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                  <XAxis dataKey="ano" tick={axis} />
                  <YAxis tick={axis} tickFormatter={formatNumber} width={90} label={{ value: "R$/t", angle: -90, position: "insideLeft", fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip formatter={(value) => value == null ? "Sem dado" : formatMoney(value) + "/t"} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line dataKey="media" name="Valor médio da produção da soja (R$/t)" stroke="#16845b" strokeWidth={2.5} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="agr-chart-context">
              {soy2025 == null
                ? "Cálculo anual: valor da produção (mil R$) × 1.000 ÷ quantidade produzida (t). Os valores são nominais e não representam cotação de mercado."
                : "Conferência 2025: " + formatMoney(soy2025) + "/t (760.444 mil R$ × 1.000 ÷ 401.184 t). Valores nominais; esta métrica não é cotação de mercado."}
            </p>
          </section>
        </div>
      )}
      {quantityDetails && (
        <QuantityYearModal
          title={quantityDetails.title}
          period={quantityDetails.period}
          items={quantityDetails.items}
          unit={quantityDetails.unit}
          onClose={closeQuantityDetails}
        />
      )}
    </div>
  );
}
