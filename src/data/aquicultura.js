// Série estática da consulta de referência da PPM/IBGE, tabela SIDRA 3940.
// A API externa não foi acessível durante esta implementação; os valores abaixo
// são os conferidos para 2025 e informados no pedido. Marcadores SIDRA continuam
// como ausências, nunca como zeros.
const sidraValue = (raw) => {
  if (["-", "..", "..."].includes(raw)) return { value: null, marker: raw };
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0
    ? { value, marker: null }
    : { value: null, marker: raw };
};

export const aquicultura2025 = {
  year: "2025",
  territory: "Campo Grande (MS)",
  municipalityCode: "5002704",
  source: "IBGE · Pesquisa da Pecuária Municipal (PPM), SIDRA tabela 3940",
  sourceUrl: "https://apisidra.ibge.gov.br/values/t/3940/n6/5002704/v/all/p/2025/c654/all?formato=json",
  fishTotalKg: sidraValue("1400"),
  speciesKg: [
    { species: "Pacu e patinga", ...sidraValue("500") },
    { species: "Piau, piapara, piauçu e piava", ...sidraValue("200") },
    { species: "Pintado e afins", ...sidraValue("400") },
    { species: "Tilápia", ...sidraValue("300") },
  ],
  fingerlingsThousands: sidraValue("7151"),
  productionValueThousandsBRL: sidraValue("5125"),
};

export const formatSidraValue = (metric) =>
  metric?.value != null ? metric.value : metric?.marker ? metric.marker + " (IBGE)" : "Sem dado";
