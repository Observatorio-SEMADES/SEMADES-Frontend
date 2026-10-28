import { Banknote, Boxes, CalendarDays, ClipboardList, Sprout, Store, UsersRound, Wheat } from "lucide-react";

const BALANCO_2025 = {
  label: "Prefeitura de Campo Grande · CGNotícias (balanço 2025)",
  url: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/campo-grande-fortalece-o-campo-e-beneficia-milhares-de-produtores-em-2025/",
};

const EQUIPAMENTOS_2026 = {
  label: "Prefeitura de Campo Grande · CGNotícias (equipamentos recebidos em 29/09/2026)",
  url: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/novos-equipamentos-reforcam-apoio-a-producao-agricola-em-campo-grande/",
};

const FEIRAS_2026 = {
  label: "Prefeitura de Campo Grande · CGNotícias (feiras livres, 08/2026)",
  url: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/feiras-livres-movimentam-bairros-e-geram-renda-para-a-capital/",
};

const IRRIGACAO_2025 = {
  label: "Prefeitura de Campo Grande · CGNotícias (kits entregues em 12/2025)",
  url: "https://www.campogrande.ms.gov.br/cgnoticias/noticia/prefeitura-entrega-kits-de-irrigacao-e-fortalece-hortas-urbanas-da-agricultura-familiar-na-capital/",
};

const metric = (icon, label, value, unit, period, source) => ({
  icon,
  label,
  value,
  unit,
  period,
  source,
});

export const agriculturaFamiliarPublicos = {
  patrulha: [
    metric(UsersRound, "Produtores atendidos", "126", "produtores", "2025", BALANCO_2025),
    metric(Wheat, "Área gradeada", "> 160.000", "m²", "2025", BALANCO_2025),
    metric(Sprout, "Canteiros preparados", "cerca de 5.000", "canteiros", "2025", BALANCO_2025),
  ],
  maquinario: [
    metric(Boxes, "Máquinas e implementos recebidos", "44", "equipamentos recebidos", "29/09/2026", EQUIPAMENTOS_2026),
    metric(Banknote, "Investimento na aquisição", "> R$ 4,7 milhões", "reais", "29/09/2026", EQUIPAMENTOS_2026),
  ],
  paa: [
    metric(UsersRound, "Produtores cadastrados", "79", "produtores", "2025", BALANCO_2025),
    metric(Banknote, "Investimento", "R$ 500 mil", "reais", "2025", BALANCO_2025),
    metric(Wheat, "Alimentos adquiridos", "> 54", "toneladas", "2025", BALANCO_2025),
    metric(UsersRound, "Famílias atendidas", "cerca de 16.000", "famílias", "2025", BALANCO_2025),
  ],
  agrosocial: [
    metric(CalendarDays, "Edições realizadas", "7", "edições", "2025", BALANCO_2025),
    metric(ClipboardList, "Atendimentos realizados", "> 2.500", "atendimentos", "2025", BALANCO_2025),
    metric(UsersRound, "Pessoas beneficiadas", "cerca de 3.200", "pessoas", "2025", BALANCO_2025),
  ],
  feiras: [
    metric(Store, "Feirantes cadastrados", "1.004", "feirantes", "08/2026", FEIRAS_2026),
    metric(UsersRound, "Pessoas envolvidas direta ou indiretamente", "cerca de 2.500", "pessoas", "08/2026", FEIRAS_2026),
  ],
  irrigacao: [
    metric(Sprout, "Kits de irrigação entregues", "10", "kits", "12/2025", IRRIGACAO_2025),
  ],
};

