import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Mail, Lock, Check } from "lucide-react";
import "../../styles/Login.css";
import { loginWithEmailPassword } from "../../services/authApi";

// Modal de login dentro do próprio site.
// props: isOpen, onClose, onLoginSuccess(user)
export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // status: "idle" | "loading" | "success"
  const [status, setStatus] = useState("idle");
  const [erro, setErro] = useState("");

  if (!isOpen || typeof document === "undefined") return null;

  const handleClose = () => {
    setErro("");
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setStatus("loading");
    try {
      const user = await loginWithEmailPassword({ email: email.trim(), password });
      setEmail("");
      setPassword("");
      // Mostra o "certinho" de sucesso e fecha logo em seguida.
      setStatus("success");
      await onLoginSuccess?.(user);
      setTimeout(() => onClose?.(), 950);
    } catch (err) {
      setStatus("idle");
      setErro(err?.message ?? "Falha ao fazer login. Tente novamente.");
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
          <div className="login-modal-brand">
            <img
              src="/logo/prefcg1.png"
              alt="Prefeitura de Campo Grande"
              className="login-modal-logo"
            />
          </div>
          <h2>Entrar</h2>
          <p className="login-modal-subtitle">
            Use seu e-mail e senha para acessar recursos restritos do observatório.
          </p>
        </div>

        {erro && <p className="login-error login-modal-error">{erro}</p>}

        <form onSubmit={handleSubmit} className="register-form login-modal-form">
          <label className="login-modal-field">
            <Mail className="login-modal-field-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
            <input
              className="login-modal-input"
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="login-modal-field">
            <Lock className="login-modal-field-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
            <input
              className="login-modal-input"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            className={`login-modal-submit${status === "success" ? " is-success" : ""}`}
            disabled={status !== "idle"}
          >
            {status === "success" ? (
              <span className="login-modal-success">
                <Check className="login-modal-check" size={22} strokeWidth={3} aria-hidden="true" />
                Pronto!
              </span>
            ) : status === "loading" ? (
              "Entrando..."
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
