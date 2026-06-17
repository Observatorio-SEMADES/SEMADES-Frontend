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
    // link: "https://lookerstudio.google.com/u/0/reporting/793fb8dd-2c20-4e4f-942a-5514a8f3278b/page/p_hx3lm2fzvd",
  },
  {
    icone: TrendingUp,
    cor: "economia",
    titulo: "SUDE",
    fonte: "Superintendência de Desenvolvimento",
    subtitulo: "Desenvolvimento e Projeto Estratégico",
    // link: "https://lookerstudio.google.com/u/0/reporting/98cfa20e-88ec-40c9-b852-5d9b110b3053/page/p_icrs9bcrvd",
  },
  {
    icone: Building,
    cor: "sustentabilidade",
    titulo: "SURB",
    fonte: "Superintendência de Urbanismo",
    subtitulo: "Gestão de Recursos Humanos e Benefícios",
    // link: "https://lookerstudio.google.com/u/0/reporting/84f2b6a0-bf49-4780-a8e1-2d238609cc32/page/p_3ph3aoy2vd",
  },
  {
    icone: ShoppingBag,
    cor: "sustentabilidade",
    titulo: "SCAR",
    fonte: "Superintendência de Contratos e Processos de Aquisições",
    subtitulo: "Gestão de Contratos, Licitações e Compras",
    // link: "https://lookerstudio.google.com/u/0/reporting/586f8938-4a46-4d78-8e0a-72ddfc556ca0/page/p_8b28ovfzvd",
  },
];
