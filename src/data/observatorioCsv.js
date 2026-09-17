// Leitura única dos CSVs públicos do observatório. Valor ausente é null; zero é 0.
export function parseCsv(source) {
  const text = source.replace(/^\uFEFF/, "");
  const records = [];
  let record = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      record.push(field); field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      record.push(field); field = "";
      if (record.some((part) => part !== "")) records.push(record);
      record = [];
    } else field += char;
  }
  if (quoted) throw new Error("CSV com aspas não fechadas");
  if (field || record.length) { record.push(field); records.push(record); }
  const [header, ...body] = records;
  if (!header) throw new Error("CSV vazio");
  return body.map((cells, index) => {
    if (cells.length !== header.length) throw new Error(`CSV: linha ${index + 2} com ${cells.length} colunas; esperadas ${header.length}`);
    return Object.fromEntries(header.map((key, column) => [key, cells[column]]));
  });
}

const REQUIRED = ["tema", "indicador", "periodo", "categoria", "valor", "unidade", "territorio", "nivel_geografico", "fonte_url", "data_extracao"];
const AGRO_SCHEMA = {
  pecuaria: { territory: "Campo Grande (MS)", level: "municipio", indicators: { efetivo_rebanho: "cabecas", efetivo_rebanho_soma_5_especies: "cabecas" } },
  agricultura: { territory: "Campo Grande (MS)", level: "municipio", indicators: { area_plantada_ou_destinada_colheita: "ha", valor_producao: "BRL" } },
  abate: { territory: "Mato Grosso do Sul", level: "estado", indicators: { animais_abatidos: "cabecas", peso_carcacas: "kg" } },
};
const FAMILY_SCHEMA = {
  mudas: { entregas_registradas: "entregas", bandejas_entregues: "bandejas", mudas_entregues: "mudas", bandejas_por_cultura: "bandejas" },
  paa: { valor_projetos: "BRL", valor_pago: "BRL", valor_restante: "BRL", quantidade_prevista: "kg", quantidade_entregue: "kg", quantidade_produtos_somada: "kg", valor_produtos_somado: "BRL", projetos_por_comunidade: "projetos", quantidade_produto: "kg", valor_produto: "BRL", solicitacoes_produto: "solicitacoes" },
};

export function loadObservatorioCsv(source, family = false) {
  const rows = parseCsv(source);
  const seen = new Set();
  return rows.map((row, index) => {
    for (const key of [...REQUIRED, family ? "status_publicacao" : "situacao_periodo"]) {
      if (!(key in row)) throw new Error(`CSV: coluna ${key} ausente`);
      if (key !== "valor" && !row[key]) throw new Error(`CSV: ${key} vazio na linha ${index + 2}`);
    }
    const key = [row.tema, row.indicador, row.periodo, row.categoria].join("|");
    if (seen.has(key)) throw new Error(`CSV: indicador duplicado ${key}`);
    seen.add(key);
    const valor = row.valor === "" ? null : Number(row.valor);
    if (valor !== null && (!Number.isFinite(valor) || valor < 0)) throw new Error(`CSV: valor inválido na linha ${index + 2}`);
    if (!/^https:\/\//.test(row.fonte_url)) throw new Error(`CSV: fonte_url inválida na linha ${index + 2}`);
    if (family && !["apto_com_ressalva", "pendente_validacao"].includes(row.status_publicacao)) throw new Error(`CSV: status desconhecido na linha ${index + 2}`);
    if (!family && !["ano_completo", "parcial_ate_junho"].includes(row.situacao_periodo)) throw new Error(`CSV: situação desconhecida na linha ${index + 2}`);
    if (family) {
      if (row.territorio !== "Campo Grande (MS)" || row.nivel_geografico !== "municipio" || FAMILY_SCHEMA[row.tema]?.[row.indicador] !== row.unidade) throw new Error(`CSV: dimensão ou unidade inválida na linha ${index + 2}`);
      if (row.status_publicacao !== (row.tema === "paa" ? "pendente_validacao" : "apto_com_ressalva")) throw new Error(`CSV: status incompatível na linha ${index + 2}`);
    } else {
      const schema = AGRO_SCHEMA[row.tema];
      if (!schema || row.territorio !== schema.territory || row.nivel_geografico !== schema.level || schema.indicators[row.indicador] !== row.unidade) throw new Error(`CSV: dimensão ou unidade inválida na linha ${index + 2}`);
      if (row.situacao_periodo === "parcial_ate_junho" && (row.tema !== "abate" || !row.periodo.startsWith("2026"))) throw new Error(`CSV: período parcial incompatível na linha ${index + 2}`);
    }
    return { ...row, valor };
  });
}

export const numberBR = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
export const moneyBR = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
export const formatNumber = (value) => value == null ? "Sem dado" : numberBR.format(value);
export const formatMoney = (value) => value == null ? "Sem dado" : moneyBR.format(value);
export const sumAvailable = (values) => {
  const available = values.filter((value) => value != null);
  return available.length ? available.reduce((total, value) => total + value, 0) : null;
};
export const valueOf = (rows, indicador, periodo, categoria) =>
  rows.find((row) => row.indicador === indicador && row.periodo === periodo && row.categoria === categoria)?.valor ?? null;
export const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "pt-BR"));
