import {
  Building2,
  Briefcase,
  Beef,
  Wheat,
  Ship,
  Package,
  Globe,
} from "lucide-react";

// Cards de dashboards externos (Looker Studio) do Observatório Econômico (/dashboard).
export const indicadores = [
  {
    icone: Building2,
    cor: "economia",
    titulo: "Empresas",
    fonte: "PLANURB, 2025",
    subtitulo: "Crescimento e número de estabelecimentos ativos",
    link: "https://lookerstudio.google.com/reporting/c2481516-de21-4653-af24-08c88b02cac5",
  },
  {
    icone: Briefcase,
    cor: "economia",
    titulo: "Empregos",
    fonte: "CAGED, 2026",
    subtitulo: "Geração de empregos formais e informais",
    link: "https://lookerstudio.google.com/reporting/38fdf9ca-ce21-4bb8-8c32-26a0cf7cbe86",
  },
  {
    icone: Beef,
    cor: "sustentabilidade",
    titulo: "Agronegócio: Pecuária",
    fonte: "IBGE, 2024",
    subtitulo: "Produção e movimentação de rebanhos",
    link: "https://lookerstudio.google.com/reporting/ddb6fd56-6187-4941-adb5-def4eca70f70",
  },
  {
    icone: Wheat,
    cor: "sustentabilidade",
    titulo: "Agronegócio: Agricultura",
    fonte: "IBGE, 2024",
    subtitulo: "Produção e área plantada das principais culturas",
    link: "https://lookerstudio.google.com/reporting/07f206fd-4594-4ad6-a155-0303421cd099",
  },
  {
    icone: Ship,
    cor: "inovacao",
    titulo: "Comércio Exterior Exportação",
    fonte: "COMEXTAT, 2025",
    subtitulo: "Principais produtos exportados pelo município",
    link: "https://lookerstudio.google.com/reporting/b726ca0c-1ace-468a-822f-4e6bca1a56d7",
  },
  {
    icone: Package,
    cor: "inovacao",
    titulo: "Comércio Exterior Importação",
    fonte: "COMEXTAT, 2025",
    subtitulo: "Principais produtos importados pelo município",
    link: "https://lookerstudio.google.com/reporting/f63d1dd2-0f38-4580-a7b7-e50e17f4c8d1",
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
