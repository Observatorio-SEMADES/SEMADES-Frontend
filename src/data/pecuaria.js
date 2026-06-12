// Agronegócio: Pecuária (/dashboard/agro-pecuaria). Dados agregados, nada sensível.
// Duas bases/escopos distintos:
//  • REBANHO — efetivo dos rebanhos de CAMPO GRANDE (IBGE), anual 2019–2023.
//  • ABATE   — abate de MATO GROSSO DO SUL (estado), mensal 2024.
// Gerado por gen_pecuaria.py a partir dos CSVs "Agronegócio MS - Rebanho/Abate.csv".

// ── REBANHO · Campo Grande (IBGE) ──
export const rebanhoAnimais = ["Bovinos", "Galináceo", "Suínos", "Ovinos", "Caprinos"];
export const rebanhoAnos = ["2019", "2020", "2021", "2022", "2023"];
export const rebanhoDados = [
  { animal: "Bovinos", ano: "2019", quantidade: 501175 },
  { animal: "Bovinos", ano: "2020", quantidade: 488430 },
  { animal: "Bovinos", ano: "2021", quantidade: 448435 },
  { animal: "Bovinos", ano: "2022", quantidade: 415630 },
  { animal: "Bovinos", ano: "2023", quantidade: 428639 },
  { animal: "Galináceo", ano: "2019", quantidade: 387416 },
  { animal: "Galináceo", ano: "2020", quantidade: 357026 },
  { animal: "Galináceo", ano: "2021", quantidade: 375269 },
  { animal: "Galináceo", ano: "2022", quantidade: 303968 },
  { animal: "Galináceo", ano: "2023", quantidade: 288769 },
  { animal: "Suínos", ano: "2019", quantidade: 45373 },
  { animal: "Suínos", ano: "2020", quantidade: 53540 },
  { animal: "Suínos", ano: "2021", quantidade: 63713 },
  { animal: "Suínos", ano: "2022", quantidade: 58490 },
  { animal: "Suínos", ano: "2023", quantidade: 48445 },
  { animal: "Ovinos", ano: "2019", quantidade: 14896 },
  { animal: "Ovinos", ano: "2020", quantidade: 14477 },
  { animal: "Ovinos", ano: "2021", quantidade: 13287 },
  { animal: "Ovinos", ano: "2022", quantidade: 12591 },
  { animal: "Ovinos", ano: "2023", quantidade: 10199 },
  { animal: "Caprinos", ano: "2019", quantidade: 765 },
  { animal: "Caprinos", ano: "2020", quantidade: 771 },
  { animal: "Caprinos", ano: "2021", quantidade: 780 },
  { animal: "Caprinos", ano: "2022", quantidade: 699 },
  { animal: "Caprinos", ano: "2023", quantidade: 566 },
];

// ── ABATE · Mato Grosso do Sul ──
export const abateAnimais = ["Bovinos", "Frangos", "Suínos"];
export const abateMeses = ["Jan/24", "Fev/24", "Mar/24", "Abr/24", "Mai/24", "Jun/24", "Jul/24", "Ago/24", "Set/24", "Out/24", "Nov/24", "Dez/24"];
export const abateDados = [
  { animal: "Bovinos", mes: "Jan/24", unidades: 314468, peso: 85384 },
  { animal: "Bovinos", mes: "Fev/24", unidades: 309098, peso: 83603 },
  { animal: "Bovinos", mes: "Mar/24", unidades: 300227, peso: 81167 },
  { animal: "Bovinos", mes: "Abr/24", unidades: 334068, peso: 90075 },
  { animal: "Bovinos", mes: "Mai/24", unidades: 330485, peso: 89190 },
  { animal: "Bovinos", mes: "Jun/24", unidades: 322817, peso: 87024 },
  { animal: "Bovinos", mes: "Jul/24", unidades: 366301, peso: 99027 },
  { animal: "Bovinos", mes: "Ago/24", unidades: 327034, peso: 89000 },
  { animal: "Bovinos", mes: "Set/24", unidades: 302343, peso: 83219 },
  { animal: "Bovinos", mes: "Out/24", unidades: 298056, peso: 81754 },
  { animal: "Bovinos", mes: "Nov/24", unidades: 280138, peso: 74810 },
  { animal: "Bovinos", mes: "Dez/24", unidades: 283964, peso: 75233 },
  { animal: "Frangos", mes: "Jan/24", unidades: 15413155, peso: 34612 },
  { animal: "Frangos", mes: "Fev/24", unidades: 15518095, peso: 35352 },
  { animal: "Frangos", mes: "Mar/24", unidades: 14534382, peso: 32574 },
  { animal: "Frangos", mes: "Abr/24", unidades: 15243979, peso: 33952 },
  { animal: "Frangos", mes: "Mai/24", unidades: 15982261, peso: 35781 },
  { animal: "Frangos", mes: "Jun/24", unidades: 15461667, peso: 33974 },
  { animal: "Frangos", mes: "Jul/24", unidades: 16685380, peso: 37470 },
  { animal: "Frangos", mes: "Ago/24", unidades: 16319013, peso: 36988 },
  { animal: "Frangos", mes: "Set/24", unidades: 14001694, peso: 32407 },
  { animal: "Frangos", mes: "Out/24", unidades: 15022616, peso: 35115 },
  { animal: "Frangos", mes: "Nov/24", unidades: 14785746, peso: 33365 },
  { animal: "Frangos", mes: "Dez/24", unidades: 14103548, peso: 32078 },
  { animal: "Suínos", mes: "Jan/24", unidades: 213038, peso: 19793 },
  { animal: "Suínos", mes: "Fev/24", unidades: 222708, peso: 20309 },
  { animal: "Suínos", mes: "Mar/24", unidades: 216918, peso: 19827 },
  { animal: "Suínos", mes: "Abr/24", unidades: 224842, peso: 21064 },
  { animal: "Suínos", mes: "Mai/24", unidades: 218401, peso: 20909 },
  { animal: "Suínos", mes: "Jun/24", unidades: 233695, peso: 22095 },
  { animal: "Suínos", mes: "Jul/24", unidades: 256198, peso: 23654 },
  { animal: "Suínos", mes: "Ago/24", unidades: 255631, peso: 23868 },
  { animal: "Suínos", mes: "Set/24", unidades: 235111, peso: 21586 },
  { animal: "Suínos", mes: "Out/24", unidades: 243346, peso: 22339 },
  { animal: "Suínos", mes: "Nov/24", unidades: 238414, peso: 21779 },
  { animal: "Suínos", mes: "Dez/24", unidades: 225338, peso: 20220 },
];
