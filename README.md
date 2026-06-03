# SEMADES Frontend

Portal de visualização de indicadores econômicos e ambientais da SEMADES — Secretaria Municipal de Meio Ambiente, Gestão Urbana e Desenvolvimento Econômico, Turístico e Sustentável da Prefeitura de Campo Grande - MS.

## Stack

- React 18
- Vite 7
- React Router DOM v7
- Recharts
- Chart.js + react-chartjs-2
- Autenticação via Google Identity Services (OAuth)

## Instalação

```bash
npm install
```

## Rodar em desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento sobe em `http://localhost:5173`.

Em modo de desenvolvimento local, o auto-login pode ser ativado via variável de ambiente (veja abaixo).

## Gerar build de produção

```bash
npm run build
```

O build é gerado na pasta `dist/`.

Para pré-visualizar o build localmente:

```bash
npm run preview
```

## Variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e preencha os valores:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Sim (produção) | ID do app OAuth no Google Cloud Console |
| `VITE_ALLOWED_GOOGLE_EMAILS` | Sim (produção) | E-mails autorizados, separados por vírgula |
| `VITE_ALLOWED_GOOGLE_DOMAINS` | Não | Domínios autorizados, separados por vírgula |
| `VITE_AUTH_API_URL` | Não | URL base da API de autenticação (se houver backend próprio) |
| `VITE_ADMIN_MODE` | Não | `true` para auto-login em localhost durante desenvolvimento |

Exemplo de `.env` local para desenvolvimento:

```
VITE_GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
VITE_ALLOWED_GOOGLE_EMAILS=usuario@exemplo.com,outro@exemplo.com
VITE_ADMIN_MODE=true
```

## Segurança

- **Nunca commite o arquivo `.env`** — ele contém segredos e está listado no `.gitignore`.
- A variável `VITE_ADMIN_MODE=true` é apenas para desenvolvimento local. Nunca configure essa variável em produção.
- `VITE_ALLOWED_GOOGLE_EMAILS` e `VITE_ALLOWED_GOOGLE_DOMAINS` controlam quem pode acessar o sistema em produção. Sem essas variáveis, o login externo fica bloqueado.

## Backend e API de autenticação

Este repositório contém **apenas o frontend**.

O backend Express (serve de produção + proxy RSS) e a API de autenticação (Node.js + MongoDB) ficam em repositórios separados. Consulte a equipe responsável para obter as URLs de deploy de cada serviço.

## Autores

- Bianca Sabka
- Magnum Abreu
- Roberto Neto
- Pedro Antonio
