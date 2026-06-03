import { Navigate } from "react-router-dom";
import { isAuthenticated, canAccessFeature } from "../../services/permissions";

const LOCALHOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalhost = () => {
  if (typeof window === "undefined") return false;
  return LOCALHOSTS.has(window.location?.hostname ?? "");
};
const DEV_MODE = import.meta.env.DEV;

const DEV_USER = {
  name: "admin",
  email: "admin@localhost",
  picture: "",
  provider: "local",
  role: "admin",
  allowedFeatures: ["superintendencias", "prodes"],
};

export default function FeatureRoute({ feature, element }) {
  if (DEV_MODE && isLocalhost()) {
    if (!localStorage.getItem("authToken")) {
      localStorage.setItem("authToken", "local-admin");
      localStorage.setItem("authUser", JSON.stringify(DEV_USER));
    }
    return element;
  }

  if (!isAuthenticated()) return <Navigate to="/" replace />;
  if (!canAccessFeature(feature)) return <Navigate to="/home" replace />;
  return element;
}
