import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  loadPamProdutos, loadPamTotais, loadPpm, loadComexMensal, loadComexDetalhe, loadCaged,
  comexCobertura, milReaisParaReais, PPM_CINCO_ESPECIES, MUNICIPIO_MDIC,
} from "../src/data/fontesOficiais.js";
import { sumAvailable } from "../src/data/observatorioCsv.js";

const read = (file) => readFileSync(new URL(`../src/data/csv/oficiais/${file}`, import.meta.url), "utf8");
const pam = loadPamProdutos(read("pam_produtos_campo_grande_2015_2025.csv"));
const pamTotais = loadPamTotais(read("pam_totais_campo_grande_2015_2025.csv"));
const ppm = loadPpm(read("ppm_rebanhos_campo_grande_2015_2024.csv"));
const mensal = loadComexMensal(read("comex_campo_grande_mensal_2025_2026.csv"));
const detalhe = loadComexDetalhe(read("comex_campo_grande_detalhe_2025_2026.csv"));
const caged = loadCaged(read("caged_campo_grande_2026.csv"));
const EXTRACAO = "2026-09-18";

test("esquema: contagens de linhas e data de extração do pacote", () => {
  assert.equal(pam.length, 224);
  assert.equal(pamTotais.length, 11);
  assert.equal(ppm.length, 100);
  assert.equal(detalhe.length, 7002);
  assert.equal(mensal.length, 40);
  assert.equal(caged.length, 9);
  for (const rows of [pam, pamTotais, ppm, detalhe, mensal, caged]) assert.ok(rows.every((row) => row.data_extracao === EXTRACAO));
});

test("esquema: cabeçalho inesperado, número malformado e duplicidade são rejeitados", () => {
  const src = read("pam_totais_campo_grande_2015_2025.csv");
  assert.throws(() => loadPamTotais(src.replace("valor_producao_mil_reais", "valor_producao")), /colunas inesperadas/);
  assert.throws(() => loadPamTotais(src.replace(";1026375;", ";1.026.375;")), /número inválido/);
  const lines = src.trim().split("\n");
  assert.throws(() => loadPamTotais([...lines, lines.at(-1)].join("\n")), /duplicada/);
});

test("tipo: códigos continuam texto com zeros à esquerda", () => {
  const carne = detalhe.find((row) => row.sh4 === "0201" && row.pais_codigo === "023");
  assert.ok(carne, "SH4 0201 / país 023 preservados como texto");
  assert.equal(typeof carne.sh4, "string");
  assert.ok(mensal.every((row) => /^\d{2}$/.test(row.mes)));
  assert.ok(pam.every((row) => typeof row.produto_codigo_sidra === "string"));
});

test("território: IBGE 5002704 em todos os arquivos; Comex filtrado pelo código MDIC 5202704 (MS)", () => {
  for (const rows of [pam, pamTotais, ppm, detalhe, mensal, caged]) assert.ok(rows.every((row) => row.municipio_ibge === "5002704" && row.uf === "MS"));
  assert.ok([...mensal, ...detalhe].every((row) => row.municipio_codigo_mdic === MUNICIPIO_MDIC));
  const src = read("comex_campo_grande_mensal_2025_2026.csv");
  assert.throws(() => loadComexMensal(src.replace(";5202704;", ";5002704;")), /código MDIC/);
});

test("PAM: 2025 disponível e totais oficiais em MIL reais, convertidos para reais uma única vez", () => {
  const total = (ano) => pamTotais.find((row) => row.ano === ano).valor_producao_mil_reais;
  assert.equal(pamTotais.at(-1).ano, "2025");
  assert.equal(total("2025"), 1026375);
  assert.equal(total("2024"), 1013964);
  assert.equal(milReaisParaReais(total("2025")), 1026375000);
  assert.equal(milReaisParaReais(null), null);
});

test("PAM: soma dos produtos reconcilia com o total oficial em todos os anos (2015–2025)", () => {
  for (const t of pamTotais) {
    const produtos = pam.filter((row) => row.ano === t.ano);
    assert.equal(sumAvailable(produtos.map((row) => row.valor_producao_mil_reais)), t.valor_producao_mil_reais, `valor ${t.ano}`);
  }
});

test("PAM: marcador do IBGE não vira zero e toda quantidade tem unidade", () => {
  const laranja = pam.find((row) => row.ano === "2024" && row.produto === "Laranja");
  assert.equal(laranja.valor_producao_mil_reais, null);
  assert.equal(laranja.marcador_valor_ibge, "-");
  assert.ok(pam.every((row) => row.quantidade_produzida === null || row.unidade_quantidade));
});

test("PPM: sem 2025, subcategorias contidas no total e cinco espécies iguais ao painel anterior", () => {
  assert.ok(ppm.every((row) => Number(row.ano) <= 2024));
  assert.throws(() => loadPpm(read("ppm_rebanhos_campo_grande_2015_2024.csv").replace(/\n2024;/, "\n2025;")), /cobertura/);
  const val = (ano, especie) => ppm.find((row) => row.ano === ano && row.especie === especie)?.cabecas ?? null;
  for (const ano of new Set(ppm.map((row) => row.ano))) {
    assert.ok(val(ano, "Galináceos - galinhas") <= val(ano, "Galináceos - total"));
    assert.ok(val(ano, "Suíno - matrizes de suínos") <= val(ano, "Suíno - total"));
  }
  assert.equal(sumAvailable(PPM_CINCO_ESPECIES.map((especie) => val("2024", especie))), 806022);
  assert.equal(val("2024", "Codornas"), null); // marcador "-" preservado como ausente
});

test("Comex: 12 meses em 2025, 8 em 2026 (parcial até agosto) por fluxo", () => {
  for (const fluxo of ["exportacao", "importacao"]) {
    const cob = comexCobertura(mensal.filter((row) => row.fluxo === fluxo));
    assert.equal(cob["2025"].meses.length, 12);
    assert.equal(cob["2025"].parcial, false);
    assert.equal(cob["2026"].meses.length, 8);
    assert.equal(cob["2026"].parcial, true);
    assert.equal(cob["2026"].ultimoMes, "08");
  }
});

test("Comex: detalhado reconcilia com o mensal em cada mês e fluxo (sem somar os dois)", () => {
  for (const m of mensal) {
    const rows = detalhe.filter((row) => row.periodo === m.periodo && row.fluxo === m.fluxo);
    assert.equal(rows.reduce((s, row) => s + row.valor_fob_usd, 0), m.valor_fob_usd, `FOB ${m.periodo} ${m.fluxo}`);
    assert.equal(rows.reduce((s, row) => s + row.kg_liquido, 0), m.kg_liquido, `kg ${m.periodo} ${m.fluxo}`);
  }
  const total = (ano, fluxo) => mensal.filter((row) => row.ano === ano && row.fluxo === fluxo).reduce((s, row) => s + row.valor_fob_usd, 0);
  assert.equal(total("2025", "exportacao"), 758121787);
  assert.equal(total("2025", "importacao"), 311919774);
  assert.equal(total("2026", "exportacao"), 631272017);
  assert.equal(total("2026", "importacao"), 291012949);
});

test("Caged: sete meses sem ajuste, acumulados com ajustes, sem forçar coincidência", () => {
  const meses = caged.filter((row) => row.tipo_periodo === "mes");
  assert.equal(meses.length, 7);
  assert.ok(meses.every((row) => row.tratamento === "sem_ajuste"));
  assert.deepEqual(meses.map((row) => row.inicio.slice(0, 7)), ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"]);
  const julho = meses.at(-1);
  assert.deepEqual([julho.admissoes, julho.desligamentos, julho.saldo], [12159, 12299, -140]);
  const soma = meses.reduce((s, row) => s + row.saldo, 0);
  const acumulado = caged.find((row) => row.tipo_periodo === "acumulado_ano");
  assert.equal(soma, 3502);
  assert.equal(acumulado.saldo, 3299);
  assert.equal(acumulado.tratamento, "com_ajustes");
  assert.equal(acumulado.saldo - soma, -203);
  assert.equal(caged.find((row) => row.tipo_periodo === "ultimos_12_meses").saldo, 378);
});

test("Caged: saldo que não fecha com admissões − desligamentos é rejeitado", () => {
  const src = read("caged_campo_grande_2026.csv");
  assert.throws(() => loadCaged(src.replace(";12159;12299;-140;", ";12159;12299;-150;")), /saldo/);
});

test("atualização: último período disponível de cada fonte", () => {
  assert.equal(pam.map((row) => row.ano).sort().at(-1), "2025");
  assert.equal(ppm.map((row) => row.ano).sort().at(-1), "2024");
  assert.equal(mensal.map((row) => row.periodo).sort().at(-1), "2026-08");
  assert.equal(caged.filter((row) => row.tipo_periodo === "mes").map((row) => row.fim).sort().at(-1), "2026-07-31");
});
