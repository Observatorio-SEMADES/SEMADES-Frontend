import React from "react";
import HomePage from "./HomePage";
import "../../styles/Root.css";
import HeaderNavTabs from "../navigation/HeaderNavTabs";
import AuthMenuItems from "../auth/AuthMenuItems";
import Footer from "../navigation/Footer";

export default function HomePageWrapper() {
  const toggleMenu = () => {
    document.body.classList.toggle("menu-open");
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
  };

  return (
    <div className="dashboard-container">
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
        {/* Login / sessão dentro do menu das três listras */}
        <AuthMenuItems />
      </div>

      <div className="menu-overlay no-print" onClick={closeMenu} />

      <HomePage />
      <Footer />
    </div>
  );
}
