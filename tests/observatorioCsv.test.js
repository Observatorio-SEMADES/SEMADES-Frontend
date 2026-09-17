import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loadObservatorioCsv, parseCsv, sumAvailable, valueOf } from "../src/data/observatorioCsv.js";

const agro = loadObservatorioCsv(readFileSync(new URL("../src/data/csv/agronegocio_dados_limpos.csv", import.meta.url), "utf8"));
const familiar = loadObservatorioCsv(readFileSync(new URL("../src/data/csv/agricultura_familiar_dados_novos.csv", import.meta.url), "utf8"), true);

test("leitura CSV preserva campos entre aspas e diferencia ausência de zero", () => {
  assert.deepEqual(parseCsv('a,b\n"x,y",0\n')[0], { a: "x,y", b: "0" });
  assert.equal(sumAvailable([]), null);
  assert.equal(sumAvailable([null, 0]), 0);
  assert.equal(valueOf([], "x", "2024", "Total"), null);
});

test("PPM 2024 soma somente as cinco espécies municipais", () => {
  const species = agro.filter((row) => row.tema === "pecuaria" && row.indicador === "efetivo_rebanho" && row.periodo === "2024" && row.nivel_geografico === "municipio");
  assert.equal(species.length, 5);
  assert.equal(sumAvailable(species.map((row) => row.valor)), 806022);
});

test("PAM 2024 usa os totais em reais e hectares sem somar produtos novamente", () => {
  const rows = agro.filter((row) => row.tema === "agricultura" && row.periodo === "2024");
  assert.equal(valueOf(rows, "area_plantada_ou_destinada_colheita", "2024", "Total"), 171959);
  assert.equal(valueOf(rows, "valor_producao", "2024", "Total"), 1013964000);
  assert.equal(rows.find((row) => row.indicador === "valor_producao" && row.categoria === "Total").unidade, "BRL");
  assert.equal(valueOf(rows, "valor_producao", "2024", "Laranja"), null);
});

test("abate separa meses estaduais, anos completos e 2026 parcial", () => {
  const monthly = agro.filter((row) => row.tema === "abate" && /^\d{4}-\d{2}$/.test(row.periodo));
  const months2025 = new Set(monthly.filter((row) => row.periodo.startsWith("2025-")).map((row) => row.periodo));
  const months2026 = new Set(monthly.filter((row) => row.periodo.startsWith("2026-")).map((row) => row.periodo));
  assert.equal(months2025.size, 12);
  assert.equal(months2026.size, 6);
  assert.ok(monthly.every((row) => row.territorio === "Mato Grosso do Sul"));
  assert.ok(monthly.filter((row) => row.periodo.startsWith("2026-")).every((row) => row.situacao_periodo === "parcial_ate_junho"));
});

test("mudas conferidas totalizam 69 entregas, 512 bandejas e 105 mil mudas", () => {
  const monthly = familiar.filter((row) => row.tema === "mudas" && /^2026-0[1-7]$/.test(row.periodo));
  for (const [indicator, expected] of [["entregas_registradas", 69], ["bandejas_entregues", 512], ["mudas_entregues", 105000]]) {
    assert.equal(sumAvailable(monthly.filter((row) => row.indicador === indicator && row.categoria === "Total").map((row) => row.valor)), expected);
  }
  assert.ok(familiar.filter((row) => row.tema === "paa").every((row) => row.status_publicacao === "pendente_validacao"));
});
