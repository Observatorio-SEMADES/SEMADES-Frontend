# Migração das Superintendências: do Looker para BIs nativos

> **Objetivo:** repetir, na área **Superintendências**, exatamente o que já foi feito
> nos **Indicadores** — tirar os dashboards do Looker Studio e reconstruí-los
> nativos no site (React + Recharts), lendo os dados a partir dos CSVs exportados
> do Looker e das imagens dos relatórios.

Este documento é a referência de trabalho. O fluxo será:

1. Você envia, por superintendência, **os CSVs do Looker** + **prints de cada página/visual** do relatório.
2. Eu identifico quais informações existem (KPIs, gráficos, filtros, layout).
3. Eu construo o BI nativo seguindo o padrão abaixo e troco o card de "abre Looker" para "página interna".
4. Repetimos para a próxima superintendência.

---

## 1. Estado atual

A página **`/superintendencias`** (restrita) lista 4 cards que hoje **abrem o Looker em nova aba**:

| Sigla | Nome | Cor | Looker |
|------|------|-----|--------|
| SUAF | Superintendência de Administração e Finanças | economia | externo (`link`) |
| SUDE | Superintendência de Desenvolvimento | economia | externo (`link`) |
| SURB | Superintendência de Urbanismo | sustentabilidade | externo (`link`) |
| SCAR | Superintendência de Contratos e Processos de Aquisições | sustentabilidade | externo (`link`) |

Fonte: `src/data/superintendencias.js` (hub) + `src/components/superintendencias/Superintendencias.jsx`.

**Meta:** cada card passa a apontar para uma página nativa (`/superintendencias/<sigla>`),
igual aos indicadores que viraram `/dashboard/empresas`, `/dashboard/empregos` etc.

> ⚠️ **Diferença crítica em relação aos Indicadores:** os indicadores (`/dashboard/*`)
> são **públicos**. As Superintendências são **restritas** — protegidas pelo
> `FeatureRoute` (feature `superintendencias`). **Toda sub-página nova também precisa
> ser protegida** (ver §5).

---

## 2. O padrão dos Indicadores (modelo a copiar)

Cada BI nativo (ex.: Empregos) é composto por **6 peças**:

### a) Registro no hub — `src/data/indicadores.js`
Array de cards. O que define o comportamento do card:
- `to: "/dashboard/empregos"` → **página interna** (seta →). É o estado "migrado".
- `link: "https://lookerstudio…"` → **abre Looker** (ícone de link externo).
- sem `to` nem `link` → card "Em breve".

Campos: `icone` (componente lucide), `cor` (`economia` | `sustentabilidade` | `inovacao` | `externo`), `titulo`, `fonte`, `subtitulo`.

### b) Hub (página de cards) — `src/pages/DashboardPage.jsx`
Faz `indicadores.map(...)` para `<DashboardCard ... to={item.to} href={item.link} />`.
O `DashboardCard` (`src/components/ui/DashboardCard.jsx`) escolhe sozinho entre `<Link to>` interno e `<a href>` externo.

### c) Rota — `src/main.jsx`
```jsx
<Route path="/dashboard/empregos" element={<AppShell printable><EmpregosPage /></AppShell>} />
```
`AppShell` = container + `<main>` + rodapé (+ `#print-header` quando `printable`).

### d) Página wrapper — `src/pages/EmpregosPage.jsx` (~27 linhas)
Importa o CSS da página, o `PageHeader` e o componente do BI. Tem o link "← Voltar aos indicadores" e o `<PageHeader title subtitle />`, depois renderiza `<Empregos />`.

### e) Dados — `src/data/empregos.js`
**Só dados puros**, derivados do CSV do Looker. Sem JSX. Exporta:
- string do período (`empregosPeriodo`)
- listas de dimensões para os filtros (`empregosSetores`, `empregosAnos`)
- agregados (`empregosPorSetor`)
- séries: a geral (`empregosSerie`) e a por dimensão num objeto indexado (`empregosSeriePorSetor[setor]`)
- comentários no topo citando **o CSV de origem e o período**.

### f) Componente do BI — `src/components/dashboard/empregos/Empregos.jsx`
A peça grande. Convenções fixas (ver §3): Recharts, paleta institucional, filtros, `StatCard`s de KPI, abas, gráficos com **cross-filter** (clicar numa barra filtra), tabela ordenável e rodapé de fonte.

---

## 3. Convenções obrigatórias (para manter tudo igual)

**Biblioteca de gráficos:** [Recharts] (`BarChart`, `LineChart`, `AreaChart`, `Bar`, `Line`, `Area`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `Cell`, `ReferenceLine`, `ResponsiveContainer`). Ícones: `lucide-react`.

**Paleta institucional (única):**
```js
const NAVY = "#0a4f9f";   // azul escuro
const AZUL = "#2f86d6";   // azul claro
const AMARELO = "#efbb07"; // amarelo
```
Grade `#eef2f7`, textos de eixo `#374151`/`#6b7280`, tooltip com borda `#e5e7eb`.

**Formatação numérica (pt-BR):**
```js
const nf  = new Intl.NumberFormat("pt-BR");
const nf1 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
```

**Componentes de UI a reutilizar** (`src/components/ui/`): `PageHeader`, `Badge`, `StatCard` (KPIs), `FilterDropdown` (filtro com muitas opções, ex. anos/meses), `SectionTitle`, `EmptyState`, `Skeleton`. Filtro de poucas opções em "chips" segue o `ChipFilter` interno do `Empregos.jsx`.

**Interatividade esperada (estilo BI do Looker):**
- KPIs no topo (`StatCard`) que **recalculam** conforme o filtro.
- Abas (ex.: "Visão geral" / "Evolução mensal"), com `key` no painel para reanimar ao trocar filtro.
- Cross-filter: clicar numa barra de "por setor" filtra o resto; barras não selecionadas ficam esmaecidas (`fillOpacity`).
- `useMemo` para toda série/resumo derivado de filtro.
- Tabela ordenável por coluna.
- Rodapé: `Fonte: <b>ÓRGÃO/BASE</b> · período`.

**CSS:** um arquivo por página em `src/styles/`, com **prefixo de classe próprio** para escopo (ex.: Empregos usa `emg-`). Nada de estilo global novo.

**`isAnimationActive={false}`** nas barras/linhas (a animação vem do remount via `key`).

---

## 4. Estrutura de arquivos para cada superintendência

Espelhando o padrão dos indicadores, para a sigla `SUAF` (exemplo):

```
src/data/superintendencias/suaf.js              ← dados puros (do CSV)
src/components/superintendencias/suaf/Suaf.jsx  ← o BI (Recharts)
src/pages/superintendencias/SuafPage.jsx        ← wrapper (back link + PageHeader + <Suaf/>)
src/styles/superintendencias/Suaf.css           ← CSS escopado (prefixo `suaf-`)
```
> Uso de subpastas (`superintendencias/`) só para **não** colidir com o hub
> `src/data/superintendencias.js` e agrupar os ~4+ arquivos. Convenção de rota:
> `/superintendencias/suaf` (sigla em minúsculo). Prefixo de CSS = a sigla (`suaf-`, `sude-`…).

---

## 5. Passo a passo para migrar UMA superintendência

1. **Receber e ler** o(s) CSV(s) + prints do Looker daquela sigla.
2. **Criar o data file** (`src/data/superintendencias/<sigla>.js`) transcrevendo o CSV em arrays/objetos, com comentário citando o CSV e o período.
3. **Criar o BI** (`<Sigla>.jsx`) replicando os visuais do print com Recharts + as convenções do §3.
4. **Criar o CSS** escopado e a **página wrapper** (back link "← Voltar às superintendências" → `/superintendencias`).
5. **Registrar a rota protegida** em `main.jsx`:
   ```jsx
   <Route
     path="/superintendencias/suaf"
     element={
       <FeatureRoute
         feature="superintendencias"
         element={<AppShell printable><SuafPage /></AppShell>}
       />
     }
   />
   ```
6. **Trocar o card** em `src/data/superintendencias.js`: remover `link` (Looker) e por `to: "/superintendencias/suaf"`.
7. **Ajustar o hub** `Superintendencias.jsx` para passar `to={item.to}` no `<DashboardCard>` (hoje ele só passa `href={item.link}`) — uma vez só, serve para todas.
8. **Validar:** `npm run build` + abrir a rota logado com a feature.

---

## 6. O que eu preciso de cada superintendência (contrato de dados)

Para cada sigla, me mande:

- [ ] **CSV(s)** que alimentam os visuais (o "raw data" por trás de cada gráfico/tabela).
- [ ] **Prints de cada página/aba** do relatório no Looker (para eu ver layout, KPIs, gráficos e filtros).
- [ ] Por visual, idealmente: **tipo** (barra/linha/área/pizza/tabela/KPI), **dimensão** (eixo X / categoria), **métrica(s)** e **filtros/segmentações** (ex.: por ano, por setor).
- [ ] **Fonte/base** e **período** dos dados (vira o rodapé e o comentário do data file).
- [ ] Confirmar a **cor** do card (`economia` ou `sustentabilidade`) e o ícone, se quiser trocar.

> Se algum visual do Looker não fizer sentido reconstruir (ex.: tabelão gigante),
> a gente decide juntos: replicar, simplificar ou cortar.

---

## 7. Referências rápidas no código

- Hub indicadores: `src/data/indicadores.js`, `src/pages/DashboardPage.jsx`
- BI completo de exemplo: `src/components/dashboard/empregos/Empregos.jsx` + `src/data/empregos.js`
- Outros BIs: `empresas/`, `agricultura/`, `pecuaria/`
- UI compartilhada: `src/components/ui/`
- Casca/rotas: `src/components/layout/AppShell.jsx`, `src/main.jsx`
- Proteção de acesso: `src/components/routes/FeatureRoute.jsx`
- Hub superintendências (a migrar): `src/data/superintendencias.js`, `src/components/superintendencias/Superintendencias.jsx`
