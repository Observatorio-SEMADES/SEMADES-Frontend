import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser, clearSession } from "../../services/authSession";

const badgeStyle = {
  position: "fixed",
  bottom: "16px",
  right: "16px",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  gap: "10px",
  background: "rgba(20, 20, 20, 0.85)",
  color: "#e0e0e0",
  borderRadius: "8px",
  padding: "8px 14px",
  fontSize: "0.78rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
  backdropFilter: "blur(4px)",
};

const sairBtnStyle = {
  background: "transparent",
  border: "1px solid #555",
  color: "#ccc",
  borderRadius: "4px",
  padding: "2px 8px",
  fontSize: "0.72rem",
  cursor: "pointer",
  lineHeight: 1.4,
};

export default function LoginStatusBadge() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getStoredUser());

    const onStorage = () => setUser(getStoredUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!user) return null;

  const displayName = user.name || user.email || "Usuário";

  const handleLogout = () => {
    clearSession();
    setUser(null);
    navigate("/home");
  };

  return (
    <div style={badgeStyle} role="status" aria-label="Sessão ativa">
      <span>Logado como: <strong>{displayName}</strong></span>
      <button style={sairBtnStyle} onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
