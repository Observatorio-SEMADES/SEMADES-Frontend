import cagedCsv from "./csv/oficiais/caged_campo_grande_2026.csv?raw";
import { loadCaged } from "./fontesOficiais";

// Novo Caged/MTE · Tabela 3 (linha 5129, Campo Grande/MS) de cada competência de 2026.
// Meses: SEM ajuste. Acumulado do ano e 12 meses: COM ajustes. Não somar os grupos.
export const cagedRows = loadCaged(cagedCsv);
export const cagedMeses = cagedRows.filter((row) => row.tipo_periodo === "mes").sort((a, b) => a.inicio.localeCompare(b.inicio));
export const cagedAcumulado = cagedRows.find((row) => row.tipo_periodo === "acumulado_ano");
export const cagedDozeMeses = cagedRows.find((row) => row.tipo_periodo === "ultimos_12_meses");
