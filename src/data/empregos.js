// Empregos formais de Campo Grande - MS (/dashboard/empregos). Fonte: CAGED/MTE.
// Período: Jan/25 – Abr/26 (16 meses). Gerado de "CAGED - DADOS.csv" (agregado mês x grande grupamento).
// v3: série por setor com `tempo` por ponto + `empregosAnos`, para os filtros de setor e período.

export const empregosPeriodo = "Jan/25 – Abr/26";

export const empregosSetores = ["Serviços", "Comércio", "Construção", "Indústria", "Agropecuária"];

export const empregosAnos = ["2025", "2026"];

// Totais de todos os setores no período (tempo = média ponderada por desligados).
export const empregosResumoTotal = { admitidos: 199523, desligados: 193301, saldo: 6210, estoque: 235839, tempo: 15.7 };

// Acumulado por grande grupamento no período (estoque = último mês do setor).
export const empregosPorSetor = [
  { label: "Serviços", admitidos: 99161, desligados: 97070, saldo: 2109, estoque: 124646, tempo: 16.9 },
  { label: "Comércio", admitidos: 54892, desligados: 54760, saldo: 132, estoque: 59884, tempo: 14.6 },
  { label: "Construção", admitidos: 21396, desligados: 18600, saldo: 2796, estoque: 18742, tempo: 10.7 },
  { label: "Indústria", admitidos: 18272, desligados: 17929, saldo: 313, estoque: 26140, tempo: 18.0 },
  { label: "Agropecuária", admitidos: 5802, desligados: 4942, saldo: 860, estoque: 6427, tempo: 14.1 },
];

// Série mensal somando todos os setores (filtro = "Todos").
export const empregosSerie = [
  { mes: "Jan/25", admitidos: 12876, desligados: 12005, saldo: 871, estoque: 242370, tempo: 15.8 },
  { mes: "Fev/25", admitidos: 13324, desligados: 11755, saldo: 1569, estoque: 243939, tempo: 15.9 },
  { mes: "Mar/25", admitidos: 13747, desligados: 12927, saldo: 820, estoque: 244759, tempo: 16.0 },
  { mes: "Abr/25", admitidos: 13827, desligados: 12524, saldo: 1303, estoque: 246062, tempo: 15.2 },
  { mes: "Mai/25", admitidos: 12752, desligados: 11912, saldo: 840, estoque: 253609, tempo: 15.1 },
  { mes: "Jun/25", admitidos: 11641, desligados: 11295, saldo: 346, estoque: 253998, tempo: 15.7 },
  { mes: "Jul/25", admitidos: 12809, desligados: 12192, saldo: 617, estoque: 254615, tempo: 16.4 },
  { mes: "Ago/25", admitidos: 12375, desligados: 11730, saldo: 645, estoque: 255260, tempo: 14.9 },
  { mes: "Set/25", admitidos: 12822, desligados: 12211, saldo: 611, estoque: 255909, tempo: 15.4 },
  { mes: "Out/25", admitidos: 12199, desligados: 12287, saldo: -88, estoque: 255821, tempo: 15.1 },
  { mes: "Nov/25", admitidos: 10463, desligados: 10379, saldo: 84, estoque: 255905, tempo: 14.5 },
  { mes: "Dez/25", admitidos: 7930, desligados: 12040, saldo: -4140, estoque: 251765, tempo: 15.8 },
  { mes: "Jan/26", admitidos: 12404, desligados: 12085, saldo: 319, estoque: 252084, tempo: 16.2 },
  { mes: "Fev/26", admitidos: 13567, desligados: 12315, saldo: 1252, estoque: 253336, tempo: 17.0 },
  { mes: "Mar/26", admitidos: 14434, desligados: 13006, saldo: 1446, estoque: 254764, tempo: 15.9 },
  { mes: "Abr/26", admitidos: 12353, desligados: 12638, saldo: -285, estoque: 235839, tempo: 16.1 },
];

// Série mensal por setor (usada quando um setor é selecionado no filtro).
export const empregosSeriePorSetor = {
  "Serviços": [
    { mes: "Jan/25", admitidos: 6549, desligados: 6160, saldo: 389, estoque: 136761, tempo: 17.5 },
    { mes: "Fev/25", admitidos: 7053, desligados: 5957, saldo: 1096, estoque: 137857, tempo: 16.2 },
    { mes: "Mar/25", admitidos: 7332, desligados: 6889, saldo: 443, estoque: 138300, tempo: 16.7 },
    { mes: "Abr/25", admitidos: 6963, desligados: 6259, saldo: 704, estoque: 139004, tempo: 16.0 },
    { mes: "Mai/25", admitidos: 6204, desligados: 5940, saldo: 264, estoque: 142433, tempo: 15.5 },
    { mes: "Jun/25", admitidos: 5842, desligados: 5650, saldo: 192, estoque: 142729, tempo: 17.0 },
    { mes: "Jul/25", admitidos: 6181, desligados: 6159, saldo: 22, estoque: 142751, tempo: 17.8 },
    { mes: "Ago/25", admitidos: 5937, desligados: 5919, saldo: 18, estoque: 142769, tempo: 15.8 },
    { mes: "Set/25", admitidos: 6190, desligados: 6192, saldo: -2, estoque: 142766, tempo: 16.5 },
    { mes: "Out/25", admitidos: 5994, desligados: 6078, saldo: -84, estoque: 142682, tempo: 16.7 },
    { mes: "Nov/25", admitidos: 5004, desligados: 4924, saldo: 80, estoque: 142762, tempo: 15.3 },
    { mes: "Dez/25", admitidos: 3861, desligados: 6215, saldo: -2354, estoque: 140408, tempo: 18.1 },
    { mes: "Jan/26", admitidos: 6004, desligados: 6109, saldo: -105, estoque: 140303, tempo: 18.0 },
    { mes: "Fev/26", admitidos: 6593, desligados: 6190, saldo: 403, estoque: 140706, tempo: 18.2 },
    { mes: "Mar/26", admitidos: 7318, desligados: 6383, saldo: 953, estoque: 141641, tempo: 17.2 },
    { mes: "Abr/26", admitidos: 6136, desligados: 6046, saldo: 90, estoque: 124646, tempo: 18.2 },
  ],
  "Comércio": [
    { mes: "Jan/25", admitidos: 3180, desligados: 3457, saldo: -277, estoque: 60605, tempo: 13.9 },
    { mes: "Fev/25", admitidos: 3362, desligados: 3400, saldo: -38, estoque: 60567, tempo: 15.9 },
    { mes: "Mar/25", admitidos: 3552, desligados: 3457, saldo: 95, estoque: 60662, tempo: 15.8 },
    { mes: "Abr/25", admitidos: 3842, desligados: 3565, saldo: 277, estoque: 60939, tempo: 15.0 },
    { mes: "Mai/25", admitidos: 3591, desligados: 3478, saldo: 113, estoque: 62742, tempo: 14.7 },
    { mes: "Jun/25", admitidos: 3257, desligados: 3220, saldo: 37, estoque: 62774, tempo: 14.2 },
    { mes: "Jul/25", admitidos: 3685, desligados: 3527, saldo: 158, estoque: 62932, tempo: 15.6 },
    { mes: "Ago/25", admitidos: 3635, desligados: 3307, saldo: 328, estoque: 63260, tempo: 13.7 },
    { mes: "Set/25", admitidos: 3549, desligados: 3429, saldo: 120, estoque: 63411, tempo: 14.0 },
    { mes: "Out/25", admitidos: 3477, desligados: 3496, saldo: -19, estoque: 63392, tempo: 13.9 },
    { mes: "Nov/25", admitidos: 3345, desligados: 3030, saldo: 315, estoque: 63707, tempo: 14.0 },
    { mes: "Dez/25", admitidos: 2768, desligados: 3193, saldo: -425, estoque: 63282, tempo: 13.2 },
    { mes: "Jan/26", admitidos: 3081, desligados: 3537, saldo: -456, estoque: 62826, tempo: 13.8 },
    { mes: "Fev/26", admitidos: 3448, desligados: 3444, saldo: 4, estoque: 62830, tempo: 15.4 },
    { mes: "Mar/26", admitidos: 3775, desligados: 3702, saldo: 73, estoque: 62903, tempo: 14.8 },
    { mes: "Abr/26", admitidos: 3345, desligados: 3518, saldo: -173, estoque: 59884, tempo: 15.1 },
  ],
  "Construção": [
    { mes: "Jan/25", admitidos: 1581, desligados: 1033, saldo: 548, estoque: 14098, tempo: 11.7 },
    { mes: "Fev/25", admitidos: 1347, desligados: 926, saldo: 421, estoque: 14519, tempo: 10.3 },
    { mes: "Mar/25", admitidos: 1177, desligados: 1065, saldo: 112, estoque: 14631, tempo: 10.5 },
    { mes: "Abr/25", admitidos: 1333, desligados: 1203, saldo: 130, estoque: 14761, tempo: 9.3 },
    { mes: "Mai/25", admitidos: 1321, desligados: 1034, saldo: 287, estoque: 15369, tempo: 11.4 },
    { mes: "Jun/25", admitidos: 1124, desligados: 1144, saldo: -20, estoque: 15338, tempo: 11.9 },
    { mes: "Jul/25", admitidos: 1341, desligados: 1035, saldo: 306, estoque: 15644, tempo: 10.0 },
    { mes: "Ago/25", admitidos: 1321, desligados: 1064, saldo: 257, estoque: 15901, tempo: 9.7 },
    { mes: "Set/25", admitidos: 1469, desligados: 1169, saldo: 300, estoque: 16194, tempo: 11.9 },
    { mes: "Out/25", admitidos: 1187, desligados: 1246, saldo: -59, estoque: 16135, tempo: 9.5 },
    { mes: "Nov/25", admitidos: 868, desligados: 1200, saldo: -332, estoque: 15803, tempo: 10.7 },
    { mes: "Dez/25", admitidos: 492, desligados: 1353, saldo: -861, estoque: 14942, tempo: 10.3 },
    { mes: "Jan/26", admitidos: 1912, desligados: 1032, saldo: 880, estoque: 15822, tempo: 12.7 },
    { mes: "Fev/26", admitidos: 1923, desligados: 1144, saldo: 779, estoque: 16601, tempo: 10.2 },
    { mes: "Mar/26", admitidos: 1679, desligados: 1399, saldo: 280, estoque: 16881, tempo: 11.1 },
    { mes: "Abr/26", admitidos: 1321, desligados: 1553, saldo: -232, estoque: 18742, tempo: 10.5 },
  ],
  "Indústria": [
    { mes: "Jan/25", admitidos: 1152, desligados: 1027, saldo: 125, estoque: 25888, tempo: 16.4 },
    { mes: "Fev/25", admitidos: 1142, desligados: 1155, saldo: -13, estoque: 25875, tempo: 20.6 },
    { mes: "Mar/25", admitidos: 1288, desligados: 1182, saldo: 106, estoque: 25981, tempo: 18.9 },
    { mes: "Abr/25", admitidos: 1308, desligados: 1138, saldo: 170, estoque: 26151, tempo: 18.3 },
    { mes: "Mai/25", admitidos: 1190, desligados: 1167, saldo: 23, estoque: 27292, tempo: 17.6 },
    { mes: "Jun/25", admitidos: 1048, desligados: 1034, saldo: 14, estoque: 27256, tempo: 17.7 },
    { mes: "Jul/25", admitidos: 1178, desligados: 1152, saldo: 26, estoque: 27282, tempo: 18.0 },
    { mes: "Ago/25", admitidos: 1114, desligados: 1146, saldo: -32, estoque: 27250, tempo: 18.2 },
    { mes: "Set/25", admitidos: 1202, desligados: 1082, saldo: 120, estoque: 27388, tempo: 17.3 },
    { mes: "Out/25", admitidos: 1172, desligados: 1132, saldo: 40, estoque: 27428, tempo: 16.8 },
    { mes: "Nov/25", admitidos: 976, desligados: 963, saldo: 13, estoque: 27441, tempo: 17.0 },
    { mes: "Dez/25", admitidos: 651, desligados: 978, saldo: -357, estoque: 27084, tempo: 17.4 },
    { mes: "Jan/26", admitidos: 1116, desligados: 1140, saldo: -24, estoque: 27060, tempo: 17.2 },
    { mes: "Fev/26", admitidos: 1271, desligados: 1182, saldo: 89, estoque: 27149, tempo: 22.0 },
    { mes: "Mar/26", admitidos: 1312, desligados: 1228, saldo: 84, estoque: 27233, tempo: 17.9 },
    { mes: "Abr/26", admitidos: 1152, desligados: 1223, saldo: -71, estoque: 26140, tempo: 16.6 },
  ],
  "Agropecuária": [
    { mes: "Jan/25", admitidos: 414, desligados: 328, saldo: 86, estoque: 5018, tempo: 14.4 },
    { mes: "Fev/25", admitidos: 420, desligados: 317, saldo: 103, estoque: 5121, tempo: 11.2 },
    { mes: "Mar/25", admitidos: 398, desligados: 334, saldo: 64, estoque: 5185, tempo: 12.8 },
    { mes: "Abr/25", admitidos: 381, desligados: 359, saldo: 22, estoque: 5207, tempo: 12.2 },
    { mes: "Mai/25", admitidos: 446, desligados: 293, saldo: 153, estoque: 5773, tempo: 14.8 },
    { mes: "Jun/25", admitidos: 370, desligados: 247, saldo: 123, estoque: 5901, tempo: 13.0 },
    { mes: "Jul/25", admitidos: 424, desligados: 319, saldo: 105, estoque: 6006, tempo: 13.6 },
    { mes: "Ago/25", admitidos: 368, desligados: 294, saldo: 74, estoque: 6080, tempo: 15.3 },
    { mes: "Set/25", admitidos: 412, desligados: 339, saldo: 73, estoque: 6150, tempo: 14.1 },
    { mes: "Out/25", admitidos: 369, desligados: 335, saldo: 34, estoque: 6184, tempo: 12.0 },
    { mes: "Nov/25", admitidos: 270, desligados: 262, saldo: 8, estoque: 6192, tempo: 11.7 },
    { mes: "Dez/25", admitidos: 158, desligados: 301, saldo: -143, estoque: 6049, tempo: 14.3 },
    { mes: "Jan/26", admitidos: 291, desligados: 267, saldo: 24, estoque: 6073, tempo: 18.0 },
    { mes: "Fev/26", admitidos: 332, desligados: 355, saldo: -23, estoque: 6050, tempo: 17.4 },
    { mes: "Mar/26", admitidos: 350, desligados: 294, saldo: 56, estoque: 6106, tempo: 16.3 },
    { mes: "Abr/26", admitidos: 399, desligados: 298, saldo: 101, estoque: 6427, tempo: 14.1 },
  ],
};
