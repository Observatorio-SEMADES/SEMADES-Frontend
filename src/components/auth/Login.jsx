import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";
import GoogleAuth from "./Google_auth";
import {
  getGoogleAccessMessage,
  hasConfiguredGoogleAccessRules,
  isAuthorizedGoogleProfile,
} from "../../services/authAccess";
import { loginWithEmailPassword } from "../../services/authApi";
import { hasApiUrl } from "../../services/api";
import { setSession } from "../../services/authSession";

const LOCALHOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const admin_mode = import.meta.env.DEV;

const isLocalhost = () => {
  if (typeof window === "undefined") return false;
  return LOCALHOSTS.has(window.location?.hostname || "");
};

const DEV_USER = {
  name: "admin",
  email: "admin@localhost",
  picture: "",
  provider: "local",
  role: "admin",
  allowedFeatures: ["superintendencias", "prodes"],
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [slides, setSlides] = useState([]);
  const [slideAtual, setSlideAtual] = useState(0);
  const navigate = useNavigate();

  const apiConfigured = hasApiUrl();

  const handleGoogleLogin = ({ credential, profile }) => {
    if (!isAuthorizedGoogleProfile(profile)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setErro(getGoogleAccessMessage());
      return;
    }
    if (credential) localStorage.setItem("authToken", credential);
    if (profile) {
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          provider: "google",
        })
      );
    }
    navigate("/home");
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await loginWithEmailPassword({ email: email.trim(), password });
      navigate("/home");
    } catch (err) {
      setErro(err.message ?? "Falha ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin_mode && isLocalhost()) {
      // Em DEV: garante que o token local existe para rotas protegidas,
      // mas NÃO navega automaticamente se VITE_API_URL estiver configurado
      // para permitir testar o login manual.
      if (!localStorage.getItem("authToken")) {
        setSession({ token: "local-admin", user: DEV_USER });
      }
      if (!apiConfigured) {
        navigate("/home");
      }
      return;
    }

    const user = localStorage.getItem("authUser");
    const token = localStorage.getItem("authToken");
    if (user && token) {
      navigate("/home");
    }
  }, [navigate, apiConfigured]);

  // ── Slides ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fotos = [
      {
        src: "/imagens-cg/campo5.jpg",
        titulo: "Campo Grande em crescimento",
        descricao:
          "A SEMADES investe em inovação urbana e sustentabilidade para o futuro da capital.",
        link: "https://www.campogrande.ms.gov.br/semades/",
      },
      {
        src: "/imagens-cg/campo2.jpg",
        titulo: "Parques e áreas verdes",
        descricao:
          "Campo Grande é referência em gestão ambiental e expansão de espaços sustentáveis.",
        link: "https://www.campogrande.ms.gov.br/semades/",
      },
      {
        src: "/imagens-cg/campo3.jpg",
        titulo: "Investimentos em energia limpa",
        descricao:
          "A Prefeitura aposta em soluções inteligentes para o desenvolvimento sustentável.",
        link: "https://www.campogrande.ms.gov.br/semades/",
      },
      {
        src: "/imagens-cg/campo1.jpg",
        titulo: "Desenvolvimento urbano integrado",
        descricao:
          "Planejamento estratégico e inovação para melhorar a qualidade de vida dos cidadãos.",
        link: "https://www.campogrande.ms.gov.br/semades/",
      },
      {
        src: "/imagens-cg/campo4.jpg",
        titulo: "Crescimento com responsabilidade",
        descricao:
          "A SEMADES promove políticas sustentáveis para uma cidade mais verde e inclusiva.",
        link: "https://www.campogrande.ms.gov.br/semades/",
      },
    ];
    setSlides(fotos.sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const intervalo = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(intervalo);
  }, [slides]);

  return (
    <div className="login-wrapper">
      {/* ===== LADO ESQUERDO ===== */}
      <div className="login-left">
        <div className="login-box">
          <img
            src="/logo/prefcg1.png"
            alt="Prefeitura de Campo Grande"
            className="logo-prefeitura"
          />

          <h1 className="login-title">
            Seja bem-vindo ao
            <br />
            Dashboard da SEMADES
          </h1>

          {erro && <p className="login-error">{erro}</p>}

          {apiConfigured ? (
            /* ── Formulário e-mail / senha (backend configurado) ── */
            <>
              <p className="login-instructions">
                Acesse com e-mail e senha.
              </p>
              <form onSubmit={handleEmailLogin} className="register-form" style={{ marginTop: "1rem" }}>
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
                Não tem acesso?{" "}
                <a href="/cadastro">Cadastre-se</a>
              </p>
            </>
          ) : admin_mode && isLocalhost() ? (
            <p className="login-helper">Acesso local detectado. Redirecionando...</p>
          ) : !hasConfiguredGoogleAccessRules ? (
            <>
              <p className="login-instructions">
                Acesse com sua conta Google institucional para visualizar os indicadores.
              </p>
              <p className="login-helper">{getGoogleAccessMessage()}</p>
            </>
          ) : (
            <>
              <p className="login-instructions">
                Acesse com sua conta Google institucional para visualizar os indicadores.
              </p>
              <GoogleAuth onSuccess={handleGoogleLogin} onError={setErro} />
            </>
          )}
        </div>
      </div>

      {/* ===== LADO DIREITO (CARROSSEL INSTITUCIONAL) ===== */}
      <div className="login-right">
        {slides.length > 0 ? (
          <div className="carousel-container">
            {slides.map((slide, index) => (
              <a
                key={index}
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`slide ${index === slideAtual ? "ativo" : ""}`}
              >
                <img src={slide.src} alt={slide.titulo} />
                <div className="slide-overlay"></div>
                <div className="slide-texto">
                  <h4>{slide.titulo}</h4>
                  <p className="slide-descricao">{slide.descricao}</p>
                  <span className="slide-link">Visitar site →</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="carousel-loading">Carregando imagens...</div>
        )}
      </div>
    </div>
  );
}

export default Login;
