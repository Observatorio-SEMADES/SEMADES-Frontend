// Valores locais ilustrativos para as áreas ainda sem uma fonte municipal
// versionada. A interface identifica cada cartão e gráfico como demonstrativo.
export const agriculturaFamiliarDemo = {
  mecanizada: {
    metrics: [
      { label: "Ordens de serviço", value: "184", detail: "exemplo · 2026" },
      { label: "Área atendida", value: "2.410 ha", detail: "exemplo · 2026" },
      { label: "Comunidades", value: "26", detail: "exemplo · 2026" },
      { label: "Máquinas em operação", value: "9", detail: "exemplo · 2026" },
    ],
    monthly: [
      { month: "Jan", services: 22 },
      { month: "Fev", services: 27 },
      { month: "Mar", services: 31 },
      { month: "Abr", services: 35 },
      { month: "Mai", services: 38 },
      { month: "Jun", services: 31 },
    ],
    byService: [
      { service: "Preparo do solo", count: 68 },
      { service: "Gradagem", count: 47 },
      { service: "Plantio", count: 39 },
      { service: "Outros", count: 30 },
    ],
  },
  feira: {
    metrics: [
      { label: "Feiras no calendário", value: "6", detail: "exemplo · 2026" },
      { label: "Feirantes", value: "84", detail: "exemplo · 2026" },
      { label: "Pontos de feira", value: "8", detail: "exemplo · 2026" },
      { label: "Visitas no mês", value: "3.200", detail: "exemplo · junho de 2026" },
    ],
    monthly: [
      { month: "Jan", visits: 2450 },
      { month: "Fev", visits: 2180 },
      { month: "Mar", visits: 2760 },
      { month: "Abr", visits: 2890 },
      { month: "Mai", visits: 3040 },
      { month: "Jun", visits: 3200 },
    ],
    byFair: [
      { fair: "Central", sellers: 22 },
      { fair: "Vila Planalto", sellers: 14 },
      { fair: "Moreninhas", sellers: 18 },
      { fair: "Tiradentes", sellers: 12 },
      { fair: "Outras", sellers: 18 },
    ],
  },
  agrosocial: {
    metrics: [
      { label: "Ações acompanhadas", value: "12", detail: "exemplo · 2026" },
      { label: "Famílias", value: "340", detail: "exemplo · 2026" },
      { label: "Grupos produtivos", value: "18", detail: "exemplo · 2026" },
      { label: "Ações no trimestre", value: "27", detail: "exemplo · 2026" },
    ],
    monthly: [
      { month: "Jan", actions: 5 },
      { month: "Fev", actions: 7 },
      { month: "Mar", actions: 8 },
      { month: "Abr", actions: 9 },
      { month: "Mai", actions: 10 },
      { month: "Jun", actions: 11 },
    ],
    byTheme: [
      { theme: "Assistência técnica", count: 5 },
      { theme: "Acesso a mercados", count: 3 },
      { theme: "Formação", count: 2 },
      { theme: "Inclusão produtiva", count: 2 },
    ],
  },
};
