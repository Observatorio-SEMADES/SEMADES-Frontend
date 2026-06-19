import { Sprout, Leaf } from "lucide-react";

// Dados da seção Sustentabilidade e Meio Ambiente (/dashboard).
// Fonte: SEMADES / Planurb, 2025.

export const forestData = [
  { icon: Sprout, label: "Mudas Doadas/Distribuídas", value: 27153 },
  { icon: Leaf,   label: "Mudas Plantadas",           value: 9429  },
];

export const arbolinkTableData = [
  { month: "Janeiro",   pruning:  92, evaluated: 184, suppression: 106 },
  { month: "Fevereiro", pruning: 122, evaluated: 376, suppression: 218 },
  { month: "Março",     pruning: 110, evaluated: 290, suppression: 195 },
  { month: "Abril",     pruning: 165, evaluated: 333, suppression: 200 },
  { month: "Maio",      pruning: 144, evaluated: 289, suppression: 153 },
  { month: "Junho",     pruning: 180, evaluated: 208, suppression: 113 },
  { month: "Julho",     pruning: 261, evaluated: 272, suppression: 165 },
  { month: "Agosto",    pruning: 149, evaluated: 292, suppression: 132 },
  { month: "Setembro",  pruning: 227, evaluated: 302, suppression: 217 },
  { month: "Outubro",   pruning: 193, evaluated: 388, suppression: 277 },
  { month: "Novembro",  pruning: 134, evaluated: 272, suppression: 197 },
  { month: "Dezembro",  pruning: 126, evaluated: 357, suppression: 199 },
];

export const arbolinkTotals = {
  pruning:     arbolinkTableData.reduce((s, r) => s + r.pruning,     0), // 1.903
  evaluated:   arbolinkTableData.reduce((s, r) => s + r.evaluated,   0), // 3.563
  suppression: arbolinkTableData.reduce((s, r) => s + r.suppression, 0), // 2.172
};
