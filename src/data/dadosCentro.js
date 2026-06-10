import { Home, CircleDollarSign, Landmark, LandPlot } from "lucide-react";

// Dados do cadastro imobiliário do Centro de Campo Grande (/dados-centro). Fonte: Planurb, 2025.

// Cards resumo no topo da página.
export const resumoCentro = [
  { icon: Home, label: "Quantidade de Imóveis", value: "6.178" },
  { icon: CircleDollarSign, label: "Valor Venal", value: "R$ 2.524.530.392,64" },
  { icon: Landmark, label: "Valor Total", value: "R$ 97.944.779.641,77" },
  { icon: LandPlot, label: "Área do Terreno", value: "7.617.790,94" },
];

// Percentual de área de lote por bairro (Top 10) — gráfico de pizza 1.
export const areaLotePorBairro = [
  { label: "Afonso Pena", value: 16.3 },
  { label: "Quinze de Novembro", value: 15.6 },
  { label: "Dom Aquino", value: 15.1 },
  { label: "Marechal Rondon", value: 8.8 },
  { label: "José Antônio", value: 8.2 },
  { label: "Eduardo Santos Pereira", value: 8.1 },
  { label: "Barão do Rio Branco", value: 7.7 },
  { label: "Maracajú", value: 7.0 },
  { label: "Mato Grosso", value: 7.0 },
  { label: "Treze de Junho", value: 6.2 },
];

// Percentual de área de lote por proprietário (Top 10) — gráfico de pizza 2.
export const areaLotePorProprietario = [
  { label: "Proprietário 1", value: 22.9 },
  { label: "Proprietário 2", value: 17.8 },
  { label: "Proprietário 3", value: 15.4 },
  { label: "Proprietário 4", value: 9.1 },
  { label: "Proprietário 5", value: 8.1 },
  { label: "Proprietário 6", value: 7.4 },
  { label: "Proprietário 7", value: 6.1 },
  { label: "Proprietário 8", value: 4.6 },
  { label: "Proprietário 9", value: 4.4 },
  { label: "Proprietário 10", value: 4.2 },
];

// Quantidade de imóveis por proprietário — gráfico de barras 1 (escala 0 a 80).
export const proprietariosImoveisQtd = [
  { label: "Proprietário 1", value: 76 },
  { label: "Proprietário 2", value: 70 },
  { label: "Proprietário 3", value: 29 },
  { label: "Proprietário 11", value: 19 },
  { label: "Proprietário 12", value: 19 },
  { label: "Proprietário 5", value: 19 },
  { label: "Proprietário 8", value: 17 },
  { label: "Proprietário 13", value: 16 },
  { label: "Proprietário 14", value: 15 },
  { label: "Proprietário 15", value: 15 },
];

// Valor acumulado em imóveis por proprietário — gráfico de barras 2 (escala 0 a 1,5 bi).
export const proprietariosValorAcumulado = [
  { label: "Proprietário 2", value: 1340667021.4 },
  { label: "Proprietário 1", value: 1082413341.56 },
  { label: "Proprietário 3", value: 868224650.52 },
  { label: "Proprietário 10", value: 361292566.45 },
  { label: "Proprietário 16", value: 281296195.37 },
  { label: "Proprietário 7", value: 254680867.43 },
  { label: "Proprietário 17", value: 218213578.35 },
  { label: "Proprietário 18", value: 215669497.41 },
  { label: "Proprietário 19", value: 215669497.41 },
  { label: "Proprietário 20", value: 196880093.88 },
];
