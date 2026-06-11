import React, { useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/Login.css";
import { loginWithEmailPassword } from "../../services/authApi";

// Modal de login dentro do próprio site.
// props: isOpen, onClose, onLoginSuccess(user)
export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  if (!isOpen || typeof document === "undefined") return null;

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

  return createPortal(
    <div
      className="login-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Login"
      onClick={handleClose}
    >
      <div className="login-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="login-modal-close"
          onClick={handleClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="login-modal-header">
          <span className="login-modal-eyebrow">Acesso interno</span>
          <h2>Entrar</h2>
          <p className="login-modal-subtitle">
            Use seu e-mail e senha para acessar recursos restritos do observatório.
          </p>
        </div>

        {erro && <p className="login-error login-modal-error">{erro}</p>}

        <form onSubmit={handleSubmit} className="register-form login-modal-form">
          <input
            className="login-modal-input"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="login-modal-input"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="login-modal-submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
