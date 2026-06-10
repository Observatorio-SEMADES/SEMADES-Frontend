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

## 5. FASE 3 — Responsividade e fluidez

1. **Navbar responsiva sem números mágicos**: hoje em ≤900px/≤620px as abas quebram em 2ª linha e `side-menu`/`menu-overlay` usam `top: 96px/104px` hardcoded (Root.css). Solução: mover abas para dentro do menu hambúrguer abaixo de 768px, ou medir altura real via CSS custom property.
2. Transição de rota: `SlideRoutes.jsx` `DURATION_MS = 800` → ~250ms, com fade + slide curto (24px) em vez de empurrão de 100vw. Manter sincronizado com `SlideRoutes.css`.
3. Hero da Home: `padding-left: 6.5rem` só ajustado em 1024px (769–1024px fica colado); pausar autoplay no hover/focus (autoplay de 4s em HomePage.jsx); `prefers-reduced-motion` para carrosséis (ticker de Eventos tem `animation-play-state: paused` no hover, falta reduced-motion).
4. Calendário: empilhar grid 2 colunas antes de 900px; células de dia ≥ 40px de toque.
5. Tabela Arbolink: conferir `overflow-x: auto` no mobile (4 colunas).
6. Hambúrguer: virar `<button aria-expanded aria-controls>`; estado do menu por React state em vez de `document.body.classList` (TopBar.jsx `toggleMenu`); fechar com `Esc`. ⚠️ TopBar é compartilhada por todas as páginas — testar navegação com menu aberto.

Commits: `fix(responsivo): corrige quebras da navbar, calendário e tabela` · `feat(transicoes): suaviza transição de rotas e respeita prefers-reduced-motion`

## 6. FASE 4 — Componentização estrutural

1. `layout/AppShell` (TopBar + `<main>` + Footer): hoje cada página renderiza o próprio `<Footer />` (Root.jsx, HomePageWrapper.jsx, Superintendencias.jsx). Garantir UM `<main>` semântico por página (hoje `.card-grid` é `<main>` dentro de div — invertido).
2. Separar `Root.jsx` em `pages/DashboardPage.jsx` + `pages/DadosCentroPage.jsx` (eliminar o `if (isDadosCentro)`); atualizar rotas em `main.jsx`. `HomePageWrapper` é absorvido pelo AppShell.
3. Quebrar `HomePage.jsx` (546 linhas) em: `HeroCarousel`, `AboutSection`, `CalendarSection`, `NoteModal` (modal de notas é demo em memória — se quiser persistir, `localStorage` é mudança pequena sem backend).
4. **Unificar gráficos em recharts** (já instalado): migrar pizza chart.js de `EnvironmentCards.jsx` e os gráficos SVG/divs feitos à mão de `DadosCentro.jsx` (~200 linhas de tooltip/grid manual) para recharts (`ResponsiveContainer` resolve responsividade). Depois remover `chart.js` + `react-chartjs-2` do package.json (~180KB de bundle).
5. Deletar código morto (conferido por grep — sem imports): `EconomicCards.jsx` + `EconomicCards.css`, `EnvironmentIndicators.jsx` + `EnvironmentIndicators.css`, `IndicatorEvolution.css`. Conferir uso de `rss-parser` antes de remover do package.json (não encontrei uso).

Commits: `refactor(layout): cria AppShell e separa páginas Dashboard e Dados Centro` · `refactor(home): divide HomePage em componentes menores` · `refactor(graficos): unifica gráficos em recharts e remove chart.js` · `chore: remove componentes e estilos não utilizados`

## 7. FASE 5 — Polish final

1. Modais (nota/evento): focus trap, `role="dialog"`, `aria-modal`, fechar com `Esc`, devolver foco ao gatilho.
2. Carrosséis: `aria-live="polite"`, botão pausar.
3. `EmptyState`/`Skeleton` aplicados (substituir "Carregando imagens..." do Login e estados vazios improvisados).
4. Footer: links reais ou remoção dos `href="#"` (Email, Telefone, LGPD, Política de Privacidade — falha WCAG 2.4.4).
5. Revisão de contraste AA (tags de legenda; texto sobre amarelo → `--gray-900`).
6. Revisar `Print.css` com o novo layout (botão Exportar usa `window.print()` via TopBar).
7. Hero: `<link rel="preload">` da primeira imagem; considerar `srcset`/WebP.

Commits: `feat(a11y): melhora foco, modais e carrosséis` · `feat(ui): adiciona estados vazios e skeletons` · `style: ajustes finais de contraste, espaçamento e rodapé`

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
