import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, canAccessFeature, fetchMyPermissions } from "../../services/permissions";
import { validateCurrentSession } from "../../services/authApi";
import { hasApiUrl } from "../../services/api";

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

// Estados: 'pending' (validando) | 'allowed' | 'denied' | 'unauth'
export default function FeatureRoute({ feature, element }) {
  const devBypass = DEV_MODE && isLocalhost();
  const apiConfigured = hasApiUrl();

  const [state, setState] = useState(() => {
    if (devBypass) return "allowed";
    if (!apiConfigured) {
      if (!isAuthenticated()) return "unauth";
      return canAccessFeature(feature) ? "allowed" : "denied";
    }
    return "pending";
  });

  useEffect(() => {
    if (devBypass) {
      // Bypass de desenvolvimento local apenas para teste manual.
      if (!localStorage.getItem("authToken")) {
        localStorage.setItem("authToken", "local-admin");
        localStorage.setItem("authUser", JSON.stringify(DEV_USER));
      }
      return;
    }

    if (!apiConfigured) return;

    let active = true;
    (async () => {
      const user = await validateCurrentSession();
      if (!active) return;
      if (!user) {
        setState("unauth");
        return;
      }
      await fetchMyPermissions();
      if (!active) return;
      setState(canAccessFeature(feature) ? "allowed" : "denied");
    })();

    return () => {
      active = false;
    };
  }, [feature, devBypass, apiConfigured]);

  if (devBypass) return element;
  if (state === "pending") return null; // valida a sessão antes de renderizar (sem layout)
  if (state === "unauth") return <Navigate to="/" replace />;
  if (state === "denied") return <Navigate to="/home" replace />;
  return element;
}
