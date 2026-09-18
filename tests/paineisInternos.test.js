import { test } from "node:test";
import assert from "node:assert/strict";
import { empregosSerie, empregosSeriePorSetor, empregosPorSetor, empregosResumoTotal } from "../src/data/empregos.js";
import { empresasTabelaBairro, empresasPorSetor } from "../src/data/empresas.js";

test("Empregos (base setorial): saldo = admitidos − desligados em toda linha", () => {
  const linhas = [...empregosSerie, ...Object.values(empregosSeriePorSetor).flat(), ...empregosPorSetor, empregosResumoTotal];
  for (const row of linhas) assert.equal(row.saldo, row.admitidos - row.desligados, `${row.mes || row.label || "total"}`);
  assert.equal(empregosResumoTotal.saldo, 6222);
  assert.equal(empregosSerie.reduce((s, row) => s + row.saldo, 0), 6222);
});

test("Empregos (base setorial): setores somam o total de cada mês", () => {
  empregosSerie.forEach((mes, i) => {
    for (const key of ["admitidos", "desligados", "saldo"]) {
      assert.equal(Object.values(empregosSeriePorSetor).reduce((s, serie) => s + serie[i][key], 0), mes[key], `${mes.mes} ${key}`);
    }
  });
});

test("Empresas: bairro sem detalhamento usa null (não zero) e os setores fecham com o total da cidade", () => {
  const semDetalhe = empresasTabelaBairro.filter((row) => row.servicos == null);
  assert.equal(semDetalhe.length, 27);
  assert.ok(semDetalhe.every((row) => row.comercio == null && row.industria == null && row.total > 0));
  assert.ok(empresasTabelaBairro.every((row) => row.servicos !== 0 || row.comercio !== 0 || row.industria !== 0), "nenhum bairro 0/0/0");
  const detalhados = empresasTabelaBairro.filter((row) => row.servicos != null);
  assert.ok(detalhados.every((row) => row.servicos + row.comercio + row.industria === row.total));
  const cidade = Object.fromEntries(empresasPorSetor.map((row) => [row.label, row.value]));
  const semBairro = cidade["Serviços"] + cidade["Comércio"] + cidade["Indústria"]
    - detalhados.reduce((s, row) => s + row.servicos + row.comercio + row.industria, 0);
  assert.equal(semBairro, semDetalhe.reduce((s, row) => s + row.total, 0));
  assert.equal(empresasTabelaBairro.reduce((s, row) => s + row.total, 0), 97872);
});
