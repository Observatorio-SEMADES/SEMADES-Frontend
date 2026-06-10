import React from "react";
import HomePage from "./HomePage";
import "../../styles/Root.css";
import Footer from "../navigation/Footer";

// A topbar/menu lateral vivem no TopBar global (main.jsx), fora da transição.
export default function HomePageWrapper() {
  return (
    <div className="dashboard-container">
      <HomePage />
      <Footer />
    </div>
  );
}
