import agroCsv from "./csv/agronegocio_dados_limpos.csv?raw";
import familiarCsv from "./csv/agricultura_familiar_dados_novos.csv?raw";
import { loadObservatorioCsv } from "./observatorioCsv";

export const agroRows = loadObservatorioCsv(agroCsv);
export const familiarRows = loadObservatorioCsv(familiarCsv, true);
export const rebanhoRows = agroRows.filter((row) => row.tema === "pecuaria" && row.indicador === "efetivo_rebanho" && row.nivel_geografico === "municipio");
export const lavouraRows = agroRows.filter((row) => row.tema === "agricultura" && row.nivel_geografico === "municipio");
// Linhas anuais no CSV são somatórios dos meses. Mantê-las fora da série evita dupla contagem.
export const abateRows = agroRows.filter((row) => row.tema === "abate" && row.nivel_geografico === "estado" && /^\d{4}-\d{2}$/.test(row.periodo));
export const mudasRows = familiarRows.filter((row) => row.tema === "mudas" && row.status_publicacao === "apto_com_ressalva" && /^2026-0[1-7]$/.test(row.periodo));
export const paaRows = familiarRows.filter((row) => row.tema === "paa" && row.status_publicacao === "pendente_validacao");
