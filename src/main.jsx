import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import AppShell from "./components/layout/AppShell";
import HomePage from "./components/dashboard/HomePage";
import DashboardPage from "./pages/DashboardPage";
import EmpresasPage from "./pages/EmpresasPage";
import EmpregosPage from "./pages/EmpregosPage";
import AgroPecuariaPage from "./pages/AgroPecuariaPage";
import AgroAgriculturaPage from "./pages/AgroAgriculturaPage";
import DadosCentroPage from "./pages/DadosCentroPage";
import FeatureRoute from "./components/routes/FeatureRoute";
import LoginStatusBadge from "./components/auth/LoginStatusBadge";
import TopBar from "./components/navigation/TopBar";
import SlideRoutes from "./components/transitions/SlideRoutes";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./styles/global.css";
import Superintendencias from "./components/superintendencias/Superintendencias";
import SuafPage from "./pages/superintendencias/SuafPage";
import SudePage from "./pages/superintendencias/SudePage";
import SurbPage from "./pages/superintendencias/SurbPage";
import ScarPage from "./pages/superintendencias/ScarPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      {/* Badge global de sessão — aparece em todas as páginas quando logado */}
      <LoginStatusBadge />
      {/* Topbar estática: fica fora do SlideRoutes para não deslizar junto */}
      <TopBar />
      <SlideRoutes>
        {/* Entrada pública: o site abre direto, sem tela de login obrigatória */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Login antigo continua acessível, mas não é a entrada do site */}
        <Route path="/login" element={<Login />} />
        {/* Rotas públicas — acessíveis sem login */}
        <Route path="/home" element={<AppShell><HomePage /></AppShell>} />
        <Route path="/dashboard" element={<AppShell printable><DashboardPage /></AppShell>} />
        <Route path="/dashboard/empresas" element={<AppShell printable><EmpresasPage /></AppShell>} />
        <Route path="/dashboard/empregos" element={<AppShell printable><EmpregosPage /></AppShell>} />
        <Route path="/dashboard/agro-pecuaria" element={<AppShell printable><AgroPecuariaPage /></AppShell>} />
        <Route path="/dashboard/agro-agricultura" element={<AppShell printable><AgroAgriculturaPage /></AppShell>} />
        <Route path="/dados-centro" element={<AppShell printable><DadosCentroPage /></AppShell>} />
        {/* Rota restrita — exige autenticação + feature "superintendencias" */}
        <Route
          path="/superintendencias"
          element={
            <FeatureRoute
              feature="superintendencias"
              element={<AppShell printable><Superintendencias /></AppShell>}
            />
          }
        />
        {/* Sub-páginas restritas das superintendências (mesma feature) */}
        <Route
          path="/superintendencias/suaf"
          element={
            <FeatureRoute
              feature="superintendencias"
              element={<AppShell printable><SuafPage /></AppShell>}
            />
          }
        />
        <Route
          path="/superintendencias/sude"
          element={
            <FeatureRoute
              feature="superintendencias"
              element={<AppShell printable><SudePage /></AppShell>}
            />
          }
        />
        <Route
          path="/superintendencias/surb"
          element={
            <FeatureRoute
              feature="superintendencias"
              element={<AppShell printable><SurbPage /></AppShell>}
            />
          }
        />
        <Route
          path="/superintendencias/scar"
          element={
            <FeatureRoute
              feature="superintendencias"
              element={<AppShell printable><ScarPage /></AppShell>}
            />
          }
        />
      </SlideRoutes>
    </Router>
  </React.StrictMode>
);
