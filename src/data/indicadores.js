import {
  Building2,
  Briefcase,
  Wheat,
  Sprout,
  Ship,
  Package,
  Globe,
} from "lucide-react";

// Cards dos painéis do Observatório Econômico (/dashboard): `to` = página nativa, `link` = externo.
export const indicadores = [
  {
    icone: Building2,
    cor: "economia",
    titulo: "Empresas",
    fonte: "PLANURB, 2025",
    subtitulo: "Crescimento e número de estabelecimentos ativos",
    // Dashboard nativo no próprio site (substitui o Looker Studio).
    to: "/dashboard/empresas",
  },
  {
    icone: Briefcase,
    cor: "economia",
    titulo: "Empregos",
    fonte: "Novo Caged/MTE · até jul/2026",
    // O Caged cobre apenas o emprego formal (CLT).
    subtitulo: "Admissões, desligamentos e saldo do emprego formal",
    // Dashboard nativo no próprio site (substitui o Looker Studio).
    to: "/dashboard/empregos",
  },
  {
    icone: Wheat,
    cor: "sustentabilidade",
    titulo: "Agronegócio",
    fonte: "IBGE PAM 2025, PPM 2024 e Pesquisa Trimestral do Abate",
    subtitulo: "Rebanho e lavoura municipais; abate estadual",
    // Dashboard nativo no próprio site (substitui o Looker Studio). Reúne o que
    // antes eram dois cards separados (Pecuária e Agricultura).
    to: "/dashboard/agronegocio",
  },
  {
    icone: Sprout,
    cor: "sustentabilidade",
    titulo: "Agricultura familiar",
    fonte: "Registros SEMADES, 2026",
    subtitulo: "Entregas de mudas e bandejas",
    to: "/dashboard/agricultura-familiar",
  },
  {
    icone: Ship,
    cor: "inovacao",
    titulo: "Comércio Exterior Exportação",
    fonte: "Comex Stat/MDIC · jan/2025–ago/2026",
    subtitulo: "Principais produtos exportados pelo município",
    // Painel nativo (CSV do MDIC). O Looker anterior segue linkado dentro da página.
    to: "/dashboard/comercio-exterior",
  },
  {
    icone: Package,
    cor: "inovacao",
    titulo: "Comércio Exterior Importação",
    fonte: "Comex Stat/MDIC · jan/2025–ago/2026",
    subtitulo: "Principais produtos importados pelo município",
    to: "/dashboard/comercio-exterior?fluxo=importacao",
  },
  // {
  //   icone: "📊",
  //   cor: "economia",
  //   titulo: "PRODES",
  //   fonte: " ",
  //   subtitulo:
  //     "Programa de incentivos para o desenvolvimento econômico e social de Campo Grande",
  //   link: "https://lookerstudio.google.com/reporting/23713d3b-62be-4e85-bec0-49d87b8e4e43/page/rrOeF",
  // },
];

// Card "Fonte externa" exibido no fim do grid (antigo banner MetroVerse).
export const metroverse = {
  icone: Globe,
  cor: "externo",
  titulo: "MetroVerse",
  fonte: "Harvard Growth Lab",
  subtitulo: "Composição econômica de Campo Grande na plataforma MetroVerse",
  link: "https://metroverse.hks.harvard.edu/city/1091/economic-composition?composition_type=establishments",
};
