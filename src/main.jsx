import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import AppShell from "./components/layout/AppShell";
import HomePage from "./components/dashboard/HomePage";
import DashboardPage from "./pages/DashboardPage";
import EmpresasPage from "./pages/EmpresasPage";
import EmpregosPage from "./pages/EmpregosPage";
import AgronegocioPage from "./pages/AgronegocioPage";
import AgriculturaFamiliarPage from "./pages/AgriculturaFamiliarPage";
import ComercioExteriorPage from "./pages/ComercioExteriorPage";
import DadosCentroPage from "./pages/DadosCentroPage";
import FeatureRoute from "./components/routes/FeatureRoute";
import TopBar from "./components/navigation/TopBar";
import SlideRoutes from "./components/transitions/SlideRoutes";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      {/* Topbar estática: fica fora do SlideRoutes para não deslizar junto */}
      <TopBar />
      <SlideRoutes>
        {/* Entrada pública: o site abre direto, sem tela de login obrigatória */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        {/* Rotas públicas — acessíveis sem login */}
        <Route path="/home" element={<AppShell><HomePage /></AppShell>} />
        <Route path="/dashboard" element={<AppShell printable><DashboardPage /></AppShell>} />
        <Route path="/dashboard/empresas" element={<AppShell printable><EmpresasPage /></AppShell>} />
        <Route path="/dashboard/empregos" element={<AppShell printable><EmpregosPage /></AppShell>} />
        <Route path="/dashboard/agronegocio" element={<AppShell printable><AgronegocioPage /></AppShell>} />
        <Route
          path="/dashboard/agricultura-familiar"
          element={
            <FeatureRoute
              allowDevBypass={false}
              requireServerValidation
              element={<AppShell printable><AgriculturaFamiliarPage /></AppShell>}
            />
          }
        />
        <Route path="/dashboard/comercio-exterior" element={<AppShell printable><ComercioExteriorPage /></AppShell>} />
        {/* Rotas antigas (painéis separados de pecuária/agricultura) — mantidas
            como redirect para não quebrar links já compartilhados. */}
        <Route path="/dashboard/agro-pecuaria" element={<Navigate to="/dashboard/agronegocio" replace />} />
        <Route path="/dashboard/agro-agricultura" element={<Navigate to="/dashboard/agronegocio" replace />} />
        <Route
          path="/dados-centro"
          element={
            <FeatureRoute
              element={<AppShell printable><DadosCentroPage /></AppShell>}
            />
          }
        />
      </SlideRoutes>
    </Router>
  </React.StrictMode>
);
