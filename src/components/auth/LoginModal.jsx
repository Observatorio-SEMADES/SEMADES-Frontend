import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Login.css";
import { loginWithEmailPassword } from "../../services/authApi";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  padding: "16px",
};

const panelStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "28px 24px 22px",
  width: "100%",
  maxWidth: "380px",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
  position: "relative",
};

const closeBtnStyle = {
  position: "absolute",
  top: "8px",
  right: "12px",
  background: "transparent",
  border: "none",
  fontSize: "1.6rem",
  lineHeight: 1,
  cursor: "pointer",
  color: "#666",
};

// Modal de login dentro do próprio site.
// props: isOpen, onClose, onLoginSuccess(user)
export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setErro("");
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const user = await loginWithEmailPassword({ email: email.trim(), password });
      setEmail("");
      setPassword("");
      await onLoginSuccess?.(user);
      onClose?.();
    } catch (err) {
      setErro(err?.message ?? "Falha ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Login"
      onClick={handleClose}
    >
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          style={closeBtnStyle}
          onClick={handleClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <h2 style={{ margin: "0 0 0.4rem" }}>Entrar</h2>
        <p className="login-instructions">Acesse com e-mail e senha.</p>

        {erro && <p className="login-error">{erro}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{ marginTop: "0.5rem" }}
          />
          <button type="submit" disabled={loading} style={{ marginTop: "0.75rem" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="login-helper" style={{ marginTop: "0.75rem" }}>
          Não tem acesso? <Link to="/cadastro" onClick={handleClose}>Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}
