import mensalCsv from "./csv/oficiais/comex_campo_grande_mensal_2025_2026.csv?raw";
import { loadComexMensal, loadComexDetalhe, comexCobertura } from "./fontesOficiais";

// Comércio exterior de Campo Grande (MS) · Comex Stat/MDIC · US$ FOB e kg líquido.
// Recorte pelo domicílio fiscal da empresa (código MDIC 5202704 = IBGE 5002704).
export const comexMensal = loadComexMensal(mensalCsv);
export const comexCob = comexCobertura(comexMensal);

// Detalhe por SH4 × país (~2 MB): carregado só quando a página abre.
export const loadDetalhe = () =>
  import("./csv/oficiais/comex_campo_grande_detalhe_2025_2026.csv?raw").then((m) => loadComexDetalhe(m.default));

// Soma de US$ FOB e kg de um recorte do MESMO arquivo (nunca mistura mensal com detalhe).
export function totalComex(rows) {
  return rows.reduce((acc, row) => ({ fob: acc.fob + row.valor_fob_usd, kg: acc.kg + row.kg_liquido }), { fob: 0, kg: 0 });
}

// Ranking por uma dimensão do detalhado (sh4 ou pais_codigo).
export function rankComex(rows, key, label, limit = 10) {
  const map = new Map();
  for (const row of rows) {
    const cur = map.get(row[key]) || { codigo: row[key], nome: row[label], fob: 0, kg: 0 };
    cur.fob += row.valor_fob_usd;
    cur.kg += row.kg_liquido;
    map.set(row[key], cur);
  }
  return [...map.values()].sort((a, b) => b.fob - a.fob).slice(0, limit);
}

export const usd = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdCompact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });
export const formatUsd = (v) => (v == null ? "Sem dado" : usd.format(v));
export const formatUsdCompact = (v) => (v == null ? "Sem dado" : `US$ ${usdCompact.format(v)}`);
