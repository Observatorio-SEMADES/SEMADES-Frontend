import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Root from "./Root.jsx";
import HomePageWrapper from "./components/dashboard/HomePageWrapper.jsx";
import FeatureRoute from "./components/routes/FeatureRoute";
import LoginStatusBadge from "./components/auth/LoginStatusBadge";
import "./styles/global.css";
import Superintendencias from "./components/superintendencias/Superintendencias";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      {/* Badge global de sessão — aparece em todas as páginas quando logado */}
      <LoginStatusBadge />
      <Routes>
        {/* Entrada pública: o site abre direto, sem tela de login obrigatória */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        {/* Login antigo continua acessível, mas não é a entrada do site */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        {/* Rotas públicas — acessíveis sem login */}
        <Route path="/home" element={<HomePageWrapper />} />
        <Route path="/dashboard" element={<Root />} />
        <Route path="/dados-centro" element={<Root />} />
        {/* Rota restrita — exige autenticação + feature "superintendencias" */}
        <Route
          path="/superintendencias"
          element={<FeatureRoute feature="superintendencias" element={<Superintendencias />} />}
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
