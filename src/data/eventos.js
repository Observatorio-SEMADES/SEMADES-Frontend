import {
  ClipboardList,
  Trees,
  Recycle,
  Droplets,
  Search,
} from "lucide-react";

// Eventos do ticker da Home (EventCarousel) e do calendário (HomePage).

export const hostEvents = [
  {
    id: 1,
    title: "Reunião Ambiental",
    date: "22 de Janeiro",
    time: "10:30",
    location: "Sala de Reuniões - SEMADES",
    icon: ClipboardList,
    color: "blue",
    contact: "(67) 3314-8000",
    link: "https://www.semadesc.ms.gov.br",
  },
  {
    id: 2,
    title: "Inspeção de Áreas Verdes",
    date: "25 de Janeiro",
    time: "14:00",
    location: "Parque das Nações",
    icon: Trees,
    color: "green",
    contact: "(67) 3314-8001",
    link: "https://www.semadesc.ms.gov.br/parques",
  },
  {
    id: 3,
    title: "Workshop de Sustentabilidade",
    date: "28 de Janeiro",
    time: "09:00",
    location: "Auditório Central",
    icon: Recycle,
    color: "teal",
    contact: "(67) 3314-8002",
    link: "https://www.semadesc.ms.gov.br/workshop",
  },
  {
    id: 4,
    title: "Palestra de Recursos Hídricos",
    date: "02 de Fevereiro",
    time: "15:30",
    location: "Centro de Treinamento",
    icon: Droplets,
    color: "cyan",
    contact: "(67) 3314-8003",
    link: "https://www.semadesc.ms.gov.br/recursos",
  },
  {
    id: 5,
    title: "Visita Técnica",
    date: "05 de Fevereiro",
    time: "08:00",
    location: "Zona de Proteção Ambiental",
    icon: Search,
    color: "purple",
    contact: "(67) 3314-8004",
    link: "https://www.semadesc.ms.gov.br/visitas",
  },
];

// Eventos estáticos do calendário da Home (imutáveis; notas do usuário são estado da página).
export const eventosCalendario = [
  { id: "e1", date: new Date(2026, 0, 22), title: "Reunião SEMADES", note: "Planejamento 2026" },
  { id: "e2", date: new Date(2026, 0, 25), title: "Publicação Relatório", note: "Dados ambientais Q4" },
  { id: "e3", date: new Date(2026, 0, 28), title: "Workshop", note: "Capacitação equipe" },
];
