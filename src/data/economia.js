// Indicadores e séries mensais da seção "Desenvolvimento Econômico" (EconomicSection).
export const economicDataByYear = {
  2025: {
    period: "Acumulado: Jan/2025 - Dez/2025",
    indicators: {
      companies: {
        value: "13.143",
        link: "https://www.semadesc.ms.gov.br/wp-content/uploads/2025/04/Relatorio-Aberturas-e-Encerramentos-de-Empresas-Fevereiro-2025.pdf",
      },
      jobs: {
        value: "19.756 ",
        link: "https://www.funtrab.ms.gov.br/mercado-de-trabalho-2023/",
      },
      growth: {
        value: "+5,2%",
        link: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/campo-grande-fecha-2025-com-crescimento-economico-acima-da-media-nacional/",
      },
      nationalPosition: {
        value: "20º (Saldo) | 8º (Crescimento)",
        link: "https://www.gov.br/secom/pt-br/assuntos/noticias-regionalizadas/numeros-do-novo-caged-em-2025/caged-em-2025/mato-grosso-do-sul-gerou-mais-de-19-7-mil-empregos-com-carteira-assinada-em-2025#:~:text=EMPREGO-,Mato%20Grosso%20do%20Sul%20gerou%20mais%20de%2019%2C7%20mil,com%20carteira%20assinada%20em%202025&text=O%20estado%20de%20Mato%20Grosso,ao%20longo%20dos%2012%20meses.",
      },
    },
    chartData: [
      { month: "Jan", empMS: 1298, empCG: 554, jobMS: 3176, jobCG: 620 },
      { month: "Fev", empMS: 1251, empCG: 551, jobMS: 8333, jobCG: 2624 },
      { month: "Mar", empMS: 1201, empCG: 463, jobMS: 1114, jobCG: 569 },
      { month: "Abr", empMS: 1118, empCG: 478, jobMS: 5701, jobCG: 1459 },
      { month: "Mai", empMS: 1003, empCG: 410, jobMS: 3087, jobCG: 840 },
      { month: "Jun", empMS: 1022, empCG: 436, jobMS: 2709, jobCG: 366 },
      { month: "Jul", empMS: 1223, empCG: 575, jobMS: 3023, jobCG: 583 },
      { month: "Ago", empMS: 1074, empCG: 437, jobMS: 2718, jobCG: 645 },
      { month: "Set", empMS: 1058, empCG: 454, jobMS: 1379, jobCG: 565 },
      { month: "Out", empMS: 1131, empCG: 319, jobMS: 880, jobCG: -76 },
      { month: "Nov", empMS: 917, empCG: 442, jobMS: -941, jobCG: 123 },
      { month: "Dez", empMS: 847, empCG: 328, jobMS: 19756, jobCG: 4240 },
    ],
  },
  2026: {
    period: "Acumulado: Jan/2026 - Março/2026",
    indicators: {
      companies: {
        value: "4806",
        link: "https://www.jucems.ms.gov.br/publicacoes/estatisticas/",
      },
      jobs: {
        value: "3.554",
        link: "https://www.ms.gov.br/noticias/ms-registra-criacao-de-35-mil-empregos-formais-em-marco-e-mantem-saldo-positivo-no-ano",
      },
      growth: {
        value: "-",
        link: null,
      },
      nationalPosition: {
        value: "-",
        link: null,
      },
    },
    chartData: [
      { month: "Jan", empMS: 1254, empCG: 546, jobMS: 3936, jobCG: 410 },
      { month: "Fev", empMS: 1507, empCG: 663, jobMS: 6157, jobCG: 1269 },
      { month: "Mar", empMS: 2045, empCG: 784, jobMS: 3554, jobCG: 1428 },
    ],
  },
};
