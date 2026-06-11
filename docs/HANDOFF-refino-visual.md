# HANDOFF — Refino visual do portal SEMADES

> Documento de continuidade do plano de refinamento visual/UX/refatoração.
> Branch de trabalho: `refino-visual-semades`. Última atualização: 10/06/2026.
> **Fases 1–5 concluídas** + **Fase 6 concluída** (não commitadas — commits a cargo do dono do projeto).

---

## 1. Contexto do projeto

- Portal institucional da SEMADES (Prefeitura de Campo Grande/MS), React 18 + Vite 7, React Router 7.
- Páginas: Home (`/home`), Dashboard de indicadores (`/dashboard`), Dados Centro (`/dados-centro`), Superintendências (`/superintendencias`, restrita por feature/auth), Login (`/login`, fora do fluxo principal — login real é via `LoginModal` no menu hambúrguer).
- Os "dashboards" são **links externos** para o Looker Studio (não iframes).
- `AppShell.jsx` serve de casca comum (container + `<main>` + Footer). Cada página tem seu próprio arquivo em `src/pages/`.
- A TopBar global é renderizada em `main.jsx` fora do `SlideRoutes` (transição de rotas).

### Regras invioláveis (do dono do projeto)
- **Não mexer** em backend, autenticação, regras de acesso, URLs de API, variáveis de ambiente, rotas protegidas ou permissões (`src/services/*`, `src/hooks/useAuthSession.js`, `PrivateRoute`, `FeatureRoute`).
- Não remover funcionalidades; não reescrever do zero; mudanças incrementais e testáveis por fase.

## 2. Direção visual decidida

**"Portal institucional claro, sóbrio e data-driven"** — referência: gov.br DS / observatórios estaduais.

- **Fundo único claro** `#f4f7fa` em todas as páginas (definido SOMENTE em `global.css`). Conteúdo em cards brancos. Faixas escuras navy apenas no footer e na seção de Eventos.
- **Âncora da identidade**: a navbar branca com abas azuis `#0a4f9f` + sublinhado amarelo `#efbb07` (cores da marca da Prefeitura).
- **Tokens CSS** em `src/styles/global.css` (`:root`): `--brand-50..900`, `--accent`, `--cat-economia/sustentabilidade/inovacao`, `--gray-50..900`, `--bg`, `--surface`, `--radius-sm/md/lg`, `--shadow-sm/md/lg`, `--font-sans`. **Sempre usar tokens em código novo.**
- **Tipografia**: Inter self-hosted via `@fontsource/inter` (pesos 400–800, importados em `main.jsx`). h1 `clamp(1.9rem→2.6rem)` peso 800; corpo 1rem/1.6; peso máximo 800.
- **Cards**: raio 12px, borda `1px solid var(--gray-200)`, sombra suave em repouso, hover `translateY(-4px)` + sombra média, 180–220ms ease-out, borda esquerda colorida por categoria.
- **Movimento**: 150–250ms; respeitar `prefers-reduced-motion` (já tem regra global). ⚠️ Nunca usar animação de entrada com `opacity: 0` + fill `both` (foi causa de seção invisível — ver §3.7).
- **Ícones**: `lucide-react` instalado (`^1.17.0`). Não usar emojis.
- Amarelo `--accent` nunca como fundo de texto branco (contraste); sobre amarelo usar texto `--gray-900`.

## 3. O que a FASE 1 já fez (concluída)

1. `global.css` reescrito: tokens, reset, fundo claro único, anel de foco `:focus-visible`, `prefers-reduced-motion`. Classes fantasma removidas.
2. `@fontsource/inter` instalado e importado (400/500/600/700/800) em `main.jsx`.
3. Removidas as 4 definições conflitantes de `body` (Root.css, HomePage.css — incluía degradê escuro ANIMADO —, Superintendencias.css; Login.css não tinha).
4. h1: 5.5rem/900 → `clamp(1.9rem, 1.2rem+2.4vw, 2.6rem)`/800 em `--brand-800`; classe/regra `titulo-degrade` removida do CSS e dos JSX (`Root.jsx`, `Superintendencias.jsx`).
5. **Limpeza de duplicatas de cascata** (causa raiz da inconsistência — TODO CSS é global no Vite):
   - `Superintendencias.css`: 390 → 14 linhas (era cópia de Root.css e vencia a cascata por carregar por último).
   - `DadosCentro.css`: −131 linhas (navbar/menu/cabeçalho duplicados).
   - `HomePage.css`: removidos 2 blocos `.navbar` concorrentes. **A aparência da navbar/menu lateral vive APENAS em `Root.css`** (branca, fixa, 60px) — não redefinir em outra folha.
   - Folga da navbar fixa: `.dashboard-header { margin-top: 64px }` em Root.css.
6. Contraste no fundo claro (Home): section-title escuro; "Sobre" virou seção branca com texto escuro; modal de notas claro; seção Eventos virou faixa navy sólida `#083a63→#052640` (mesma família do footer) com fades laterais `rgba(8,58,99,…)`; acentos teal/ciano (`#00bfa5`, `#00d4ff`, `#2a7ae2`) → tokens.
7. **Bugfix**: removida a animação `noticiasFadeUp ... both` de `.noticias-section` (começava `opacity:0`; quando não disparava, a seção de Notícias inteira sumia).
8. Imagens comprimidas (mesmos nomes): campo4 6,4MB→414KB, campo5 7,7MB→367KB, campo1/2/3 e semades-about-bg 196–363KB. `theme-color` do index.html → `#0a4f9f`.
9. Botões do menu lateral: brancos com texto escuro; `.logout-btn` em `--brand-700`.

## 4. FASE 2 — Cards e layout (concluída)

`lucide-react` instalado; `src/components/ui/` criado (DashboardCard, StatCard, Badge, SectionTitle, PageHeader) com estilos em `src/styles/ui.css`; dados extraídos para `src/data/`; emojis e ícones JPG substituídos; badge `posicao` removido; botão MetroVerse restaurado ao local original (após o grid, antes da seção econômica); card Looker de Dados Centro e superintendências sem link mostram "Em breve"; CSS órfão removido e Print.css adaptado às novas classes. Extra: `api.js` só exibe "backend não está rodando" para falhas reais de rede (TypeError), demais erros sobem intactos.

## 5. FASE 3 — Responsividade e fluidez (concluída)

1. **Navbar sem números mágicos**: TopBar.jsx mede a altura real da navbar (ref + `ResizeObserver`) e publica `--navbar-h` em `:root`. `side-menu`/`menu-overlay` usam `top: var(--navbar-h, 60px)`.
2. Transição de rota: `DURATION_MS 800 → 250` e `SlideRoutes.css` reescrito para fade + deslize curto (24px).
3. Hero da Home: recuo corrigido em 769–1024px; autoplay pausa no hover/foco; ticker de Eventos com `:focus-within` e `prefers-reduced-motion`.
4. Hambúrguer: `<button aria-expanded aria-controls aria-label>`; estado migrado de `document.body.classList` para React state + `MenuContext`; fecha com `Esc` e ao trocar de rota.

## 6. FASE 4 — Componentização estrutural (concluída)

1. **`AppShell.jsx`** criado; Footer/container centralizados.
2. **`Root.jsx` eliminado** → `pages/DashboardPage.jsx` + `pages/DadosCentroPage.jsx`.
3. **`HomePage.jsx` (546 → ~110 linhas)** virou orquestrador; seções extraídas para `HeroCarousel`, `AboutSection`, `CalendarSection`, `NoteModal`.
4. **Gráficos unificados em recharts**: chart.js + react-chartjs-2 removidos. Bundle 725KB → 586KB (gzip 230 → 181KB).
5. **Código morto deletado**: `EconomicCards.jsx`, `EnvironmentIndicators.jsx`, `IndicatorEvolution.css`, `rss-parser`.

## 7. FASE 5 — Polish final (concluída)

1. **Modais acessíveis**: hook `hooks/useDialog.js` (foco preso Tab/Shift+Tab, Esc, scroll-lock, foco de volta). Aplicado ao `NoteModal` e `EventModal`.
2. **Carrosséis**: botão pausar/retomar no hero e no ticker de Eventos; `aria-live="polite"` no hero.
3. **EmptyState + Skeleton** em `components/ui/`.
4. **Footer**: removidos 4 `href="#"` quebrados.
5. **Contraste AA dos badges**: economia → `#01679b`; sustentabilidade/inovação → texto `--gray-900`.
6. **Preload do hero**: `<link rel="preload" as="image" href="/imagens-cg/campo1.jpg">` no `index.html`.

## 8. FASE 6 — Melhorias de dados e UX (concluída em 10/06/2026)

### 8.1 Dados Centro (`/dados-centro`)

**Donuts lado a lado** — criado `.donut-cards-row` (espelho do `.bar-cards-row`). `DonutCard` agora usa layout coluna (`.donut-compact`): gráfico 210×210 centralizado, legenda em grid 2×5 abaixo. Label do centro do donut era hardcoded "Área de Lote" para ambos — corrigido: primeiro donut "Por Bairro", segundo "Proprietário".

**Barras horizontais** — `BarCard` usa `layout="vertical"` no recharts: `YAxis` vira eixo de labels (sem rotação, `width: 96`), `XAxis` vira eixo de valores. `radius` ajustado para `[0, 3, 3, 0]`. Altura 280 → 310px.

**CSS limpo** — removidos ~150 linhas de CSS morto (`.bar-plot`, `.bar-grid*`, `.bar-ylabels`, `.bar-xlabel*`, `.bars-row`, `.bar-col`, `.bar-rect`, `.bar-tooltip*`), bloco `.resumo-row` duplicado, classes nunca usadas `.looker-icon` / `.looker-topbadge`. Arquivo 524 → 260 linhas.

**StatCards legíveis** — valores grandes exibem forma curta em destaque (`R$ 2,52 bi`, `R$ 97,9 bi`, `7,6 mi m²`) com valor completo em fonte menor via nova prop `detail` em `StatCard` (acessível via `title`). Dados atualizados em `src/data/dadosCentro.js`.

**Looker card** — mudado de `<a>` (sem href) para `<div>` com classe `.looker-disabled`; badge "Em breve" adicionado (`.looker-soon-badge`, posição absoluta top-right). Hover desabilitado via `.looker-disabled:hover .looker-card`.

### 8.2 Sustentabilidade e Meio Ambiente (`/dashboard` — `EnvironmentCards`)

**Dados extraídos** para `src/data/sustentabilidade.js`: `forestData`, `plantingRate`, `arbolinkTableData` e `arbolinkTotals` (pré-computados: Poda 1.903, Avaliadas 3.563, Supressão 2.172). Cores hardcoded substituídas por `var(--cat-sustentabilidade)`, `var(--gray-*)`.

**Pizza eliminada** — substituída por 3 `StatCard` em grid (`env-stats-row`): Mudas Doadas | Mudas Plantadas | `TaxaCard`. O `TaxaCard` é um bloco local (reutiliza classes `.stat-card*` de `ui.css`) com barra de progresso verde mostrando os 34,7% — a taxa de plantio agora é o destaque visual, não mais texto de rodapé.

**Tabela removida do corpo** — substituída por:
- 3 `StatCard` com totais anuais (Poda | Avaliadas | Supressão)
- Gráfico de barras agrupadas 12 meses (recharts, 3 séries em verde escuro/médio/claro)
- Botão `.arbolink-table-trigger` com borda dashed verde, label "Ver solicitações mensais completas" + período alinhado à direita. No hover: borda vira sólida + fundo `#f0faf1`.

**Modal slide-from-top** — ao clicar no trigger: overlay fade-in 280ms + dialog `translateY(-28px)→0` opacity 0→1, 380ms `cubic-bezier(0.22, 1, 0.36, 1)`. Usa `useDialog` (Esc, foco preso, scroll-lock). Tabela completa com linha `<tfoot>` de totais. `prefers-reduced-motion` desabilita a animação. Botão fechar: retângulo arredondado `7px`, borda `1px solid gray-200`, `padding: 0; line-height: 1` (evita descentramento de browser).

### 8.3 Alinhamento de seções (`/dashboard`)

`.economic-wrapper` em `Root.css` ganhou `max-width: 1200px; margin: 3rem auto 0`. EconomicSection e EnvironmentCards agora têm as mesmas bordas laterais que `.card-grid` e `.metroverse-button` (todos a 1200px centralizados no container de 1300px).

### 8.4 Home (`/home`) — remoção de seções

**Botões pausar/continuar removidos** do `HeroCarousel`: removidos imports `Pause`/`Play`, estado `isManuallyPaused`, botão `.carousel-pause` e o `<div class="carousel-controls">` que o envolvia. O autoplay ainda pausa no hover/foco. Indicadores de slide mantidos diretamente.

**Calendário removido** — `CalendarSection` e `NoteModal` removidos do `HomePage`. Todo o estado e handlers de notas removidos (`notes`, `currentMonth`, `selectedDate`, `showNoteModal`, `openAddNoteModal`, `handleSubmitNote`, `deleteNote`, `useEffect` de limpeza de object URLs). Import de `eventosCalendario` removido.

**EventCarousel removido** — seção de eventos animados (ticker) removida do `HomePage`. O `<div class="homepage-container">` que envolvia calendário + eventos foi removido junto.

`HomePage.jsx` ficou com 12 linhas: apenas `HeroCarousel`, `AboutSection` e `Noticias`.

Bundle: 590KB → 574KB (gzip 183 → 178KB).

---

## 9. Armadilhas conhecidas (ler antes de mexer)

- **Todo CSS é global** (imports em componentes viram um bundle único). Regra: aparência de navbar/menu SÓ em `Root.css`; fundo SÓ em `global.css`. Não reintroduzir duplicatas.
- A navbar é `position: fixed` com 60px — conteúdo precisa de `margin-top: 64px`. O hero usa `.under-navbar` com −72px/+72px (herança; funciona, mas alinhar quando mexer na navbar).
- `Superintendencias.css` e `DadosCentro.css` devem permanecer mínimos.
- O menu lateral abre/fecha via classe `menu-open` no `<body>` + `MenuContext` em TopBar.jsx.
- `EventCarousel` foi removido da Home. O componente e seu CSS ainda existem em disco — não foram deletados.
- `CalendarSection` e `NoteModal` foram removidos da Home. Os componentes ainda existem em disco.
- `DadosCentro.css` ainda tem ~20 linhas de estilos de `.bar-source` e `.bar-chart-wrap` que são usados pelo `BarCard` atual (recharts) — não remover.
- O `.looker-desc` dentro do looker-card usa `position: absolute; bottom: 14px` — depende de `.looker-card` ter `position: relative` (tem).

## 10. Pendências opcionais

- `DadosCentro.css` ainda tem alguns estilos de `.bar-source` / `.bar-chart-wrap` que podem ser revisados numa limpeza futura.
- `CalendarSection.jsx`, `NoteModal.jsx`, `EventCarousel.jsx` e seus CSS ainda estão em disco — podem ser deletados se o dono confirmar que não voltarão.
- `srcset`/WebP para imagens do hero carousel (melhora LCP em conexões lentas).
- Página **Superintendências** não foi verificada visualmente (exige login + feature).

## 11. Como validar

```bash
npm run build                       # deve passar sem erros
npm run preview -- --port 4173      # subir build
firefox --headless --screenshot out.png --window-size=1440,6200 http://localhost:4173/home
firefox --headless --screenshot dash.png --window-size=1440,6200 http://localhost:4173/dashboard
firefox --headless --screenshot dc.png --window-size=1440,6200 http://localhost:4173/dados-centro
```
Checar: fundo claro único, navbar branca consistente, nenhum texto branco sobre fundo claro, console sem erros, modal Arbolink abre/fecha com animação, donuts lado a lado em `/dados-centro`.
