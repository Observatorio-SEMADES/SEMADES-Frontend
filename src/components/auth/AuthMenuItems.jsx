import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthSession } from "../../hooks/useAuthSession";
import { fetchMyPermissions } from "../../services/permissions";
import { notifySessionChanged } from "../../services/authSession";
import { hasApiUrl } from "../../services/api";
import LoginModal from "./LoginModal";

// Fecha o menu lateral das três listras (mesma convenção dos demais botões).
function closeSideMenu() {
  if (typeof document !== "undefined") {
    document.body.classList.remove("menu-open");
  }
}

const userInfoStyle = {
  fontSize: "13px",
  color: "#333",
  padding: "4px 2px",
  lineHeight: 1.35,
  wordBreak: "break-word",
};

// Itens de autenticação exibidos DENTRO do menu das três listras (.side-menu):
// - deslogado: botão "Login" que abre o LoginModal
// - logado: "Logado como: nome/e-mail" + botão "Sair"
export default function AuthMenuItems() {
  const { user, isAuthenticated, logout } = useAuthSession();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = user?.name || user?.email || "Usuário";

  const handleOpenLogin = () => {
    closeSideMenu(); // fecha o menu antes de abrir o modal centralizado
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
    closeSideMenu();
    if (location.pathname === "/superintendencias") {
      navigate("/home");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          <div style={userInfoStyle} title={displayName}>
            Logado como:
            <br />
            <strong>{displayName}</strong>
          </div>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </>
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
