# HANDOFF — Refino visual do portal SEMADES

> Documento de continuidade do plano de refinamento visual/UX/refatoração.
> Branch de trabalho: `refino-visual-semades`. Última atualização: 10/06/2026.
> **Fases 1 e 2 concluídas** (não commitadas — os commits ficam a cargo do dono do projeto;
> há um snapshot em `backup/refino-fases-1-2` com uma divisão sugerida de commits).

---

## 1. Contexto do projeto

- Portal institucional da SEMADES (Prefeitura de Campo Grande/MS), React 18 + Vite 7, React Router 7.
- Páginas: Home (`/home`), Dashboard de indicadores (`/dashboard`), Dados Centro (`/dados-centro`), Superintendências (`/superintendencias`, restrita por feature/auth), Login (`/login`, fora do fluxo principal — login real é via `LoginModal` no menu hambúrguer).
- Os "dashboards" são **links externos** para o Looker Studio (não iframes).
- `Root.jsx` serve duas rotas (`/dashboard` e `/dados-centro`) com `if (pathname)` — separação planejada na Fase 4.
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
- **Ícones**: substituir emojis por `lucide-react` (ainda NÃO instalado — Fase 2).
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

Commits sugeridos da Fase 1 (se ainda não commitados):
- `refactor(estilos): cria design tokens e unifica fundo das páginas`
- `feat(tipografia): adiciona fonte Inter e nova escala de títulos`
- `perf(imagens): comprime fotos do carrossel da home`

### Pendência de verificação
- Página **Superintendências** não foi verificada visualmente (exige login + feature). Os cards dela agora herdam o estilo base do Root.css (padding 1.5rem, gap 1.8rem) — checar logado.

## 4. FASE 2 — Cards e layout (CONCLUÍDA em 10/06/2026)

Tudo abaixo foi implementado: `lucide-react` instalado; `src/components/ui/`
(DashboardCard, StatCard, Badge, SectionTitle, PageHeader) com estilos em
`src/styles/ui.css`; dados extraídos para `src/data/`; emojis e ícones JPG
substituídos; badge `posicao` removido; botão MetroVerse restaurado ao local
original (após o grid, antes da seção econômica); card Looker de Dados Centro
e superintendências sem link mostram "Em breve"; CSS órfão removido e Print.css
adaptado às novas classes. Extra: `api.js` só exibe "backend não está rodando"
para falhas reais de rede (TypeError), demais erros sobem intactos.

1. Instalar `lucide-react`. Criar `src/components/ui/`:
   - `DashboardCard` — card de link para dashboard externo: ícone SVG, categoria (borda esquerda SEMPRE visível, não só no hover), título, fonte, descrição, ícone `external-link` (usuário precisa saber que sai do site), estado "Em breve" para itens sem `href` (hoje Superintendências tem 4 `<a>` sem href e o card Looker de Dados Centro idem — links comentados no código).
   - `StatCard` — unifica `resumo-card` (DadosCentro) e `economic-item` (EconomicSection): ícone + rótulo + valor (+ link opcional). Usar `font-variant-numeric: tabular-nums`.
   - `Badge` — chips de categoria com mapa central de cores (`--cat-*`).
   - `SectionTitle` — h2 com linha de acento (substitui `section-title`, `noticias-heading`, `env-title`, `carousel-title`).
   - `PageHeader` — título+subtítulo+legenda (substitui `dashboard-header` em Root/Superintendências/DadosCentro).
2. Substituir emojis por ícones lucide nos cards (Root.jsx: 🏢💼🐄🌾🚢📦; Superintendencias: 📃📈🏙️👜; EconomicSection: 🏢👥📈🏆; EventCarousel/EnvironmentCards).
3. Remover ou ressignificar o badge `posicao` ("1º…6º" — é só a ordem do array, não comunica nada).
4. Criar `src/data/` e extrair dados mockados: `indicadores.js` (Root.jsx), `superintendencias.js`, `noticias.js` (Noticias.jsx), `eventos.js` (EventCarousel.jsx hostEvents + HomePage events), `economia.js` (EconomicSection economicDataByYear), `dadosCentro.js` (4 arrays de DadosCentro.jsx).
5. Cards resumo de DadosCentro: trocar ícones JPG (quadrado branco visível: IconImoveis.jpg etc.) por ícones lucide.
6. Integrar o botão MetroVerse (hoje um banner solto preto/roxo com `Logo-Havard.jpeg`) como card "Fonte externa" discreto no grid.

Commits: `feat(ui): cria componentes DashboardCard, StatCard, Badge e PageHeader` · `refactor(dashboard): migra cards para o novo sistema` · `refactor(dados): extrai dados mockados para src/data`

## 5. FASE 3 — Responsividade e fluidez (CONCLUÍDA em 10/06/2026)

1. **Navbar sem números mágicos**: TopBar.jsx mede a altura real da navbar (ref + `ResizeObserver`) e publica `--navbar-h` em `:root`. `side-menu`/`menu-overlay` agora usam `top: var(--navbar-h, 60px)` — removidos os `top: 96px/104px` chumbados dos breakpoints 900px/620px em Root.css.
2. Transição de rota: `DURATION_MS 800 → 250` e `SlideRoutes.css` reescrito para fade + deslize curto (24px) com opacity, em vez de empurrão de 100vw. Mantido `prefers-reduced-motion`.
3. Hero da Home: corrigido o recuo em 769–1024px (o `padding-left` vive em `.carousel-slide`, não em `.carousel-hero` — reduzido para 3.5rem no breakpoint 1024px); autoplay pausa no hover/foco (`isCarouselPaused` + `onMouseEnter/Leave`/`onFocusCapture/BlurCapture`) e é desligado sob `prefers-reduced-motion` (JS + CSS); ticker de Eventos ganhou `:focus-within` e `prefers-reduced-motion` (animação parada).
4. Calendário: já empilhava as 2 colunas em ≤900px e as células de dia têm ≥40px (56px padrão, 40px em ≤400px) — verificado, sem mudança necessária.
5. Tabela Arbolink: já tinha `overflow-x: auto` + `min-width` nos breakpoints (EnvironmentCards.css) — verificado, sem mudança necessária.
6. Hambúrguer: virou `<button aria-expanded aria-controls="side-menu" aria-label>`; estado do menu migrado de `document.body.classList` para React state em TopBar.jsx (efeito sincroniza a classe `.menu-open` no body para o CSS continuar funcionando); fecha com `Esc` e ao trocar de rota. Filhos (HeaderNavTabs, AuthMenuItems) fecham via novo `MenuContext` (`useMenu().closeMenu()`) em vez de tocar no body.

Commits sugeridos: `fix(responsivo): navbar sem números mágicos e hambúrguer acessível` (TopBar.jsx, menuContext.js, HeaderNavTabs.jsx, AuthMenuItems.jsx, Root.css) · `feat(fluidez): transição de rotas curta + carrosséis com prefers-reduced-motion` (SlideRoutes.jsx/.css, HomePage.jsx/.css, EventCarousel.css)

## 6. FASE 4 — Componentização estrutural (CONCLUÍDA em 10/06/2026)

1. **`components/layout/AppShell.jsx`** criado (container `.dashboard-container` + UM `<main>` semântico + `<Footer />` + `#print-header` via prop `printable`). Removida a duplicação de Footer/container que existia em Root, HomePageWrapper e Superintendências. O `.card-grid` deixou de ser `<main>` (agora é `<div>`; o `<main>` é do AppShell).
2. **`Root.jsx` eliminado** → `pages/DashboardPage.jsx` + `pages/DadosCentroPage.jsx` (acabou o `if (isDadosCentro)`). `HomePageWrapper.jsx` removido (absorvido pelo AppShell). Rotas em `main.jsx` agora envolvem cada página no `<AppShell>`; a proteção de `/superintendencias` continua no `FeatureRoute`.
3. **`HomePage.jsx` (546 → ~110 linhas)** virou orquestrador do estado das notas; seções extraídas para `HeroCarousel`, `AboutSection`, `CalendarSection`, `NoteModal` (todos em `components/dashboard/`). O ciclo de vida dos object URLs dos anexos foi preservado (criados no NoteModal, revogados no HomePage ao desmontar / excluir).
4. **Gráficos unificados em recharts**: a pizza chart.js de `EnvironmentCards.jsx` virou `PieChart`; os 2 donuts SVG + 2 barras feitos à mão de `DadosCentro.jsx` viraram `PieChart`/`BarChart` (componentes `DonutCard`/`BarCard` internos, com `ResponsiveContainer`). A legenda lateral dos donuts e o hover-dim foram mantidos. `chart.js` + `react-chartjs-2` removidos do package.json — **bundle 725KB → 586KB** (gzip 230 → 181KB).
5. **Código morto deletado** (sem imports): `EconomicCards.jsx`+css, `EnvironmentIndicators.jsx`+css, `IndicatorEvolution.css`. `rss-parser` removido do package.json (sem uso).

> Pendência opcional: `DadosCentro.css` ainda tem ~150 linhas de estilos das barras/tooltip antigos (`.bar-plot`, `.bar-grid*`, `.bar-tooltip`, `.bar-ylabels`, `.bar-xlabel*`, `.bars-row`, `.bar-col`, `.bar-rect`) que ficaram órfãos após o recharts. Podem ser removidos numa limpeza futura (não quebram nada).

Commits sugeridos: `chore(limpeza): remove componentes/estilos mortos e rss-parser` · `refactor(layout): cria AppShell e separa Dashboard/Dados Centro de Root` · `refactor(home): divide HomePage em HeroCarousel/AboutSection/CalendarSection/NoteModal` · `refactor(graficos): unifica gráficos em recharts e remove chart.js`

## 7. FASE 5 — Polish final (CONCLUÍDA em 10/06/2026)

1. **Modais acessíveis**: hook `hooks/useDialog.js` (foco preso com Tab/Shift+Tab, fecha no `Esc`, trava o scroll do fundo e devolve o foco ao gatilho ao fechar). Aplicado ao `NoteModal` e ao modal de detalhes do `EventCarousel` (extraído para o componente interno `EventModal`); ambos com `role="dialog"`, `aria-modal`, `aria-label`/`aria-labelledby` e `tabIndex={-1}`.
2. **Carrosséis**: botão pausar/retomar no hero (`HeroCarousel`, pausa manual além do hover/foco) e no ticker de Eventos (classe `.is-paused`); região `aria-live="polite"` anunciando o slide atual do hero (`aria-roledescription="carrossel"`).
3. **EmptyState + Skeleton** (`components/ui/`): `Skeleton` substitui o "Carregando imagens..." do Login; `EmptyState` aparece na lista lateral do calendário quando não há eventos no mês. Estilos + shimmer (com `prefers-reduced-motion`) em `ui.css`.
4. **Footer**: removidos os 4 `href="#"` quebrados (Email, Telefone, LGPD, Política) — viraram `<span class="semades-footer-text">` (placeholders com comentário indicando trocar por `<a href>`/`mailto:`/`tel:` reais). Resolve WCAG 2.4.4.
5. **Contraste AA dos badges**: economia → azul mais escuro (`#01679b`, texto branco passa); sustentabilidade/inovação (claros) → texto `--gray-900`. As cores `--cat-*` originais seguem nas bordas dos cards.
6. **Print.css revisado**: as classes que ele mira (`dash-card*`, `card-grid`, `page-header-legend .badge`) continuam batendo com o DOM após a Fase 4 — sem mudança necessária.
7. **Preload do hero**: `<link rel="preload" as="image" href="/imagens-cg/campo1.jpg">` no `index.html` (primeira imagem do carrossel da Home → melhora o LCP). `srcset`/WebP ficou de fora (exige gerar assets — follow-up opcional).

Commits sugeridos: `feat(a11y): modais com foco preso/Esc e carrosséis com pausar/aria-live` · `feat(ui): adiciona EmptyState e Skeleton e aplica no Login/calendário` · `fix(a11y): remove links href=# do rodapé e melhora contraste dos badges` · `perf(home): pré-carrega a primeira imagem do hero`

## 8. Armadilhas conhecidas (ler antes de mexer)

- **Todo CSS é global** (imports em componentes viram um bundle único). A ordem da cascata segue a ordem dos imports em `main.jsx`. Antes da Fase 1 havia 3+ definições da mesma classe vencendo por ordem de carga. Regra: aparência de navbar/menu/cabeçalho SÓ em `Root.css`; fundo SÓ em `global.css`. Não reintroduzir duplicatas.
- A navbar é `position: fixed` com 60px — conteúdo de página precisa de folga (`.dashboard-header { margin-top: 64px }`). O hero da Home usa `.under-navbar` com −72px/+72px (herança de quando a navbar tinha 72px; funciona, mas alinhar quando mexer na navbar).
- `Superintendencias.css` e `DadosCentro.css` devem permanecer mínimos (só estilos específicos da página).
- O menu lateral abre/fecha via classe `menu-open` no `<body>` (manipulação imperativa em TopBar.jsx) — migração para estado React planejada na Fase 3.
- `EventCarousel` duplica o array (`[...events, ...events]`) para o ticker infinito — qualquer mudança de dados mantém essa duplicação em mente.
- Headless Firefox foi usado para screenshots de verificação (`npm run preview` + `firefox --headless --screenshot`); útil para validar visual sem subir o app manualmente.

## 9. Como validar cada fase

```bash
npm run build                       # deve passar sem erros
npm run preview -- --port 4173      # subir build
# screenshots: /home, /dashboard, /dados-centro (Superintendências exige login)
firefox --headless --screenshot out.png --window-size=1440,6200 http://localhost:4173/home
```
Checar: fundo claro único, navbar branca consistente, nenhum texto branco sobre fundo claro, Notícias visível, console sem erros.
