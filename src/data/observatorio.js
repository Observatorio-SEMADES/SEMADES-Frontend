import agroCsv from "./csv/agronegocio_dados_limpos.csv?raw";
import familiarCsv from "./csv/agricultura_familiar_dados_novos.csv?raw";
import pamProdutosCsv from "./csv/oficiais/pam_produtos_campo_grande_2015_2025.csv?raw";
import pamTotaisCsv from "./csv/oficiais/pam_totais_campo_grande_2015_2025.csv?raw";
import ppmCsv from "./csv/oficiais/ppm_rebanhos_campo_grande_2015_2024.csv?raw";
import { loadObservatorioCsv } from "./observatorioCsv";
import { loadPamProdutos, loadPamTotais, loadPpm } from "./fontesOficiais";

export const agroRows = loadObservatorioCsv(agroCsv);
export const familiarRows = loadObservatorioCsv(familiarCsv, true);
// Rebanho e lavoura vêm dos CSVs oficiais do IBGE (PPM 2015–2024 e PAM 2015–2025).
// As linhas "pecuaria" e "agricultura" do CSV antigo ficaram só como histórico.
export const ppmRows = loadPpm(ppmCsv);
export const pamProdutos = loadPamProdutos(pamProdutosCsv);
export const pamTotais = loadPamTotais(pamTotaisCsv);
// Linhas anuais no CSV são somatórios dos meses. Mantê-las fora da série evita dupla contagem.
export const abateRows = agroRows.filter((row) => row.tema === "abate" && row.nivel_geografico === "estado" && /^\d{4}-\d{2}$/.test(row.periodo));
export const mudasRows = familiarRows.filter((row) => row.tema === "mudas" && row.status_publicacao === "apto_com_ressalva" && /^2026-0[1-7]$/.test(row.periodo));

// Metadados no formato esperado por <SourceMeta rows=…>.
export const metaIbge = (rows, fonte) => rows.map((row) => ({
  territorio: `Campo Grande (MS) · IBGE ${row.municipio_ibge}`,
  fonte,
  fonte_url: row.fonte_url,
  data_extracao: row.data_extracao,
}));
