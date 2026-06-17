import { FileText, TrendingUp, Building, ShoppingBag } from "lucide-react";

// Cards da Central das Superintendências (/superintendencias).
// Itens sem `link` aparecem como "Em breve" (dashboards ainda não publicados).
export const superintendencias = [
  {
    icone: FileText,
    cor: "economia",
    titulo: "SUAF",
    fonte: "Superintendência de Administração e Finanças",
    subtitulo: "Eficiência de máquina pública, tecnologia, governança e gestão",
    // Dashboard nativo no próprio site (substitui o Looker Studio).
    to: "/superintendencias/suaf",
  },
  {
    icone: TrendingUp,
    cor: "economia",
    titulo: "SUDE",
    fonte: "Superintendência de Desenvolvimento Econômico",
    subtitulo: "Desenvolvimento e Projeto Estratégico",
    // Dashboard nativo no próprio site (substitui o Looker Studio).
    to: "/superintendencias/sude",
  },
  {
    icone: Building,
    cor: "sustentabilidade",
    titulo: "SURB",
    fonte: "Superintendência de Urbanismo",
    subtitulo: "Gestão de Recursos Humanos e Benefícios",
    // Dashboard nativo no próprio site (substitui o Looker Studio).
    to: "/superintendencias/surb",
  },
  {
    icone: ShoppingBag,
    cor: "sustentabilidade",
    titulo: "SCAR",
    fonte: "Superintendência de Cartografia e Patrimônio",
    subtitulo: "Cartografia, patrimônio e gestão de áreas públicas",
    // Dashboard nativo no próprio site (substitui o Looker Studio).
    to: "/superintendencias/scar",
  },
];
