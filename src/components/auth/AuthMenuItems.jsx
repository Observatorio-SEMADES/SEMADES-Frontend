import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthSession } from "../../hooks/useAuthSession";
import { fetchMyPermissions } from "../../services/permissions";
import { notifySessionChanged } from "../../services/authSession";
import { hasApiUrl } from "../../services/api";
import LoginModal from "./LoginModal";
import { useMenu } from "../navigation/menuContext";

// Itens de autenticação exibidos DENTRO do menu das três listras (.side-menu):
// - deslogado: botão "Login" que abre o LoginModal
// - logado: botão "Sair" (o status da sessão aparece só no badge do canto direito)
export default function AuthMenuItems() {
  const { isAuthenticated, logout } = useAuthSession();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { closeMenu } = useMenu();

  const handleOpenLogin = () => {
    closeMenu(); // fecha o menu antes de abrir o modal centralizado
    setModalOpen(true);
  };

  // Após login: valida permissões no backend (quando há API) e notifica a UI
  // para a navbar reavaliar Superintendências e o badge atualizar.
  const handleLoginSuccess = async () => {
    if (hasApiUrl()) {
      await fetchMyPermissions();
    }
    notifySessionChanged();
  };

  const handleLogout = () => {
    logout(); // limpa authToken, authUser e authPermissions + notifica
    closeMenu();
    if (location.pathname === "/superintendencias") {
      navigate("/home");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      ) : (
        <button type="button" onClick={handleOpenLogin}>
          Login
        </button>
      )}

      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
