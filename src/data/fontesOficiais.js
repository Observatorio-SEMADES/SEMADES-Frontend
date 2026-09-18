// Loaders dos CSVs das fontes oficiais (src/data/csv/oficiais, extração de 18/09/2026).
// Os arquivos são cópias fiéis do pacote de dados: UTF-8 com BOM, separador ";".
// Regras comuns: códigos ficam como texto (preservam zeros à esquerda), célula
// numérica vazia vira null (nunca 0) e qualquer desvio de esquema, território,
// período ou duplicidade interrompe o carregamento em vez de publicar dado errado.
import { parseCsv } from "./observatorioCsv.js";

export const MUNICIPIO_IBGE = "5002704"; // Campo Grande (MS) no IBGE
export const MUNICIPIO_MDIC = "5202704"; // Campo Grande (MS) na tabela de correlação do MDIC
export const MUNICIPIO_CAGED = "500270"; // código de 6 dígitos usado na planilha do MTE

const INTEIRO = /^-?\d+$/;
const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function readTable(source, name, columns) {
  const rows = parseCsv(source, ";");
  const header = rows.length ? Object.keys(rows[0]) : [];
  if (header.join(";") !== columns.join(";")) throw new Error(`${name}: colunas inesperadas (${header.join(";")})`);
  return rows;
}

// "" → null; inteiro → Number; qualquer outra coisa é erro (ex.: "1.234" ou "12,5").
function num(value, name, line, { allowNegative = false } = {}) {
  if (value === "") return null;
  if (!INTEIRO.test(value) || (!allowNegative && value.startsWith("-"))) throw new Error(`${name}: número inválido "${value}" na linha ${line}`);
  return Number(value);
}

function checkCommon(row, name, line) {
  if (row.municipio_ibge !== MUNICIPIO_IBGE || row.municipio !== "Campo Grande" || row.uf !== "MS") throw new Error(`${name}: território inesperado na linha ${line}`);
  if (!DATA_ISO.test(row.data_extracao)) throw new Error(`${name}: data_extracao inválida na linha ${line}`);
  const url = row.fonte_url ?? row.fonte_pagina;
  if (!/^https:\/\//.test(url)) throw new Error(`${name}: fonte inválida na linha ${line}`);
}

function unique(rows, name, keyOf) {
  const seen = new Set();
  rows.forEach((row, index) => {
    const key = keyOf(row);
    if (seen.has(key)) throw new Error(`${name}: chave duplicada ${key} (linha ${index + 2})`);
    seen.add(key);
  });
  return rows;
}

// ── PAM/IBGE (SIDRA 5457) ─────────────────────────────────────────────────────
// Valor da produção em MIL REAIS. A conversão para reais acontece só na exibição
// (milReaisParaReais), uma única vez.
const PAM_PRODUTOS = ["ano", "municipio_ibge", "municipio", "uf", "produto_codigo_sidra", "produto", "area_plantada_ha", "marcador_area_plantada_ibge", "area_colhida_ha", "marcador_area_colhida_ibge", "quantidade_produzida", "unidade_quantidade", "marcador_quantidade_ibge", "rendimento_medio", "unidade_rendimento", "marcador_rendimento_ibge", "valor_producao_mil_reais", "marcador_valor_ibge", "data_extracao", "fonte_url"];
const PAM_TOTAIS = ["ano", "municipio_ibge", "municipio", "uf", "area_plantada_ha", "area_colhida_ha", "valor_producao_mil_reais", "data_extracao", "fonte_url"];
const PAM_MEDIDAS = [
  ["area_plantada_ha", "marcador_area_plantada_ibge"],
  ["area_colhida_ha", "marcador_area_colhida_ibge"],
  ["quantidade_produzida", "marcador_quantidade_ibge"],
  ["rendimento_medio", "marcador_rendimento_ibge"],
  ["valor_producao_mil_reais", "marcador_valor_ibge"],
];

export function loadPamProdutos(source) {
  const name = "PAM produtos";
  const rows = readTable(source, name, PAM_PRODUTOS).map((row, index) => {
    const line = index + 2;
    checkCommon(row, name, line);
    if (!/^\d{4}$/.test(row.ano) || !/^\d+$/.test(row.produto_codigo_sidra) || !row.produto) throw new Error(`${name}: ano/produto inválido na linha ${line}`);
    const out = { ...row };
    for (const [field, marker] of PAM_MEDIDAS) {
      out[field] = num(row[field], name, line);
      // Marcador do IBGE ("-", "...", "X") só pode existir quando o valor está ausente.
      if (out[field] !== null && row[marker]) throw new Error(`${name}: valor e marcador simultâneos na linha ${line}`);
    }
    if (out.quantidade_produzida !== null && !row.unidade_quantidade) throw new Error(`${name}: quantidade sem unidade na linha ${line}`);
    return out;
  });
  return unique(rows, name, (row) => `${row.ano}|${row.produto_codigo_sidra}`);
}

export function loadPamTotais(source) {
  const name = "PAM totais";
  const rows = readTable(source, name, PAM_TOTAIS).map((row, index) => {
    checkCommon(row, name, index + 2);
    return { ...row, area_plantada_ha: num(row.area_plantada_ha, name, index + 2), area_colhida_ha: num(row.area_colhida_ha, name, index + 2), valor_producao_mil_reais: num(row.valor_producao_mil_reais, name, index + 2) };
  });
  return unique(rows, name, (row) => row.ano);
}

export const milReaisParaReais = (value) => (value == null ? null : value * 1000);

// ── PPM/IBGE (SIDRA 3939) ─────────────────────────────────────────────────────
// "Galináceos - galinhas" está contido em "Galináceos - total" e "Suíno - matrizes
// de suínos" em "Suíno - total": essas duas linhas nunca entram em somas.
const PPM = ["ano", "municipio_ibge", "municipio", "uf", "especie_codigo_sidra", "especie", "cabecas", "marcador_ibge", "data_extracao", "fonte_url"];
export const PPM_SUBCATEGORIAS = { "Galináceos - galinhas": "Galináceos - total", "Suíno - matrizes de suínos": "Suíno - total" };
// Recorte histórico do painel (mesmo total publicado antes da atualização).
export const PPM_CINCO_ESPECIES = ["Bovino", "Suíno - total", "Caprino", "Ovino", "Galináceos - total"];

export function loadPpm(source) {
  const name = "PPM";
  const rows = readTable(source, name, PPM).map((row, index) => {
    const line = index + 2;
    checkCommon(row, name, line);
    if (!/^\d{4}$/.test(row.ano) || Number(row.ano) > 2024) throw new Error(`${name}: ano fora da cobertura consultada na linha ${line}`);
    const cabecas = num(row.cabecas, name, line);
    if (cabecas !== null && row.marcador_ibge) throw new Error(`${name}: valor e marcador simultâneos na linha ${line}`);
    return { ...row, cabecas, subcategoria_de: PPM_SUBCATEGORIAS[row.especie] ?? null };
  });
  return unique(rows, name, (row) => `${row.ano}|${row.especie_codigo_sidra}`);
}

// ── Comex Stat/MDIC ───────────────────────────────────────────────────────────
// Valores em US$ FOB e kg líquido; recorte pelo domicílio fiscal da empresa.
// Mensal e detalhado representam as MESMAS operações: nunca somar um ao outro.
const COMEX_MENSAL = ["ano", "mes", "fluxo", "municipio_ibge", "municipio_codigo_mdic", "municipio", "uf", "kg_liquido", "valor_fob_usd", "linhas_origem", "data_extracao", "fonte_url"];
const COMEX_DETALHE = ["ano", "mes", "fluxo", "municipio_ibge", "municipio_codigo_mdic", "municipio", "uf", "sh4", "sh4_descricao", "pais_codigo", "pais", "kg_liquido", "valor_fob_usd", "data_extracao", "fonte_url"];
export const COMEX_FLUXOS = ["exportacao", "importacao"];

function comexRow(row, name, line) {
  checkCommon(row, name, line);
  if (row.municipio_codigo_mdic !== MUNICIPIO_MDIC) throw new Error(`${name}: código MDIC inesperado na linha ${line}`);
  if (!/^\d{4}$/.test(row.ano) || !/^(0[1-9]|1[0-2])$/.test(row.mes)) throw new Error(`${name}: período inválido na linha ${line}`);
  if (!COMEX_FLUXOS.includes(row.fluxo)) throw new Error(`${name}: fluxo inválido na linha ${line}`);
  return { ...row, periodo: `${row.ano}-${row.mes}`, kg_liquido: num(row.kg_liquido, name, line), valor_fob_usd: num(row.valor_fob_usd, name, line) };
}

export function loadComexMensal(source) {
  const name = "Comex mensal";
  const rows = readTable(source, name, COMEX_MENSAL).map((row, index) => ({ ...comexRow(row, name, index + 2), linhas_origem: num(row.linhas_origem, name, index + 2) }));
  return unique(rows, name, (row) => `${row.periodo}|${row.fluxo}`);
}

export function loadComexDetalhe(source) {
  const name = "Comex detalhe";
  const rows = readTable(source, name, COMEX_DETALHE).map((row, index) => {
    const out = comexRow(row, name, index + 2);
    if (!/^\d{4}$/.test(row.sh4) || !/^\d{3}$/.test(row.pais_codigo)) throw new Error(`${name}: SH4/país inválido na linha ${index + 2}`);
    return out;
  });
  return unique(rows, name, (row) => `${row.periodo}|${row.fluxo}|${row.sh4}|${row.pais_codigo}`);
}

// Meses disponíveis por ano. Ano com menos de 12 meses é parcial.
export function comexCobertura(rows) {
  const meses = {};
  for (const row of rows) (meses[row.ano] ??= new Set()).add(row.mes);
  return Object.fromEntries(Object.entries(meses).map(([ano, set]) => {
    const lista = [...set].sort();
    return [ano, { meses: lista, parcial: lista.length < 12, ultimoMes: lista.at(-1) }];
  }));
}

// ── Novo Caged/MTE ────────────────────────────────────────────────────────────
// Linhas "mes" são sem ajuste (planilha de cada competência); "acumulado_ano" e
// "ultimos_12_meses" são com ajustes (planilha de julho). Grupos não se somam.
const CAGED = ["tipo_periodo", "inicio", "fim", "tratamento", "municipio_ibge", "municipio", "uf", "admissoes", "desligamentos", "saldo", "data_extracao", "fonte_pagina", "fonte_arquivo", "localizacao_na_fonte"];
const CAGED_TRATAMENTO = { mes: "sem_ajuste", acumulado_ano: "com_ajustes", ultimos_12_meses: "com_ajustes" };

export function loadCaged(source) {
  const name = "Caged";
  const rows = readTable(source, name, CAGED).map((row, index) => {
    const line = index + 2;
    checkCommon(row, name, line);
    if (CAGED_TRATAMENTO[row.tipo_periodo] !== row.tratamento) throw new Error(`${name}: tratamento incompatível na linha ${line}`);
    if (!DATA_ISO.test(row.inicio) || !DATA_ISO.test(row.fim) || row.inicio > row.fim) throw new Error(`${name}: período inválido na linha ${line}`);
    const out = { ...row, admissoes: num(row.admissoes, name, line), desligamentos: num(row.desligamentos, name, line), saldo: num(row.saldo, name, line, { allowNegative: true }) };
    if ([out.admissoes, out.desligamentos, out.saldo].every((v) => v !== null) && out.admissoes - out.desligamentos !== out.saldo) throw new Error(`${name}: saldo ≠ admissões − desligamentos na linha ${line}`);
    return out;
  });
  return unique(rows, name, (row) => `${row.tipo_periodo}|${row.inicio}|${row.fim}`);
}
