import React from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import "../../styles/Root.css";
import HeaderNavTabs from "../navigation/HeaderNavTabs";
import Footer from "../navigation/Footer";

export default function HomePageWrapper() {
  const navigate = useNavigate();

  const loggedUser = (() => {
    if (typeof window === "undefined") return "";
    const raw = localStorage.getItem("authUser");
    if (!raw) return "";
    try {
      const parsed = JSON.parse(raw);
      return parsed?.name || parsed?.email || "";
    } catch {
      return "";
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/");
  };

  const toggleMenu = () => {
    document.body.classList.toggle("menu-open");
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
  };

  return (
    <div className="dashboard-container">
      {loggedUser ? (
        <div className="login-status">Logado como {loggedUser}</div>
      ) : null}

      <nav className="navbar no-print">
        <div className="navbar-left">
          <img
            src="/logo/prefcg1.png"
            alt="Prefeitura"
            className="navbar-logo"
          />
        </div>

        <HeaderNavTabs />

        <div className="navbar-burger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <div className="side-menu no-print">
        <button
          onClick={() => {
            handleLogout();
            closeMenu();
          }}
          className="logout-btn"
        >
          Sair
        </button>
      </div>

      <div className="menu-overlay no-print" onClick={closeMenu} />

      <HomePage />
      <Footer />
    </div>
  );
}
