import { Navigate } from "react-router-dom";
import { isAuthorizedGoogleProfile } from "../../services/authAccess";

const LOCALHOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const isLocalhost = () => {
  if (typeof window === "undefined") return false;
  const hostname = window.location?.hostname || "";
  return LOCALHOSTS.has(hostname);
};

// Espelha o mesmo controle de Login.jsx
const admin_mode = import.meta.env.DEV;

function PrivateRoute({ element }) {
  const user = localStorage.getItem("authUser");
  const token = localStorage.getItem("authToken");
  let parsedUser = null;

  try {
    parsedUser = user ? JSON.parse(user) : null;
  } catch {
    parsedUser = null;
  }

  const isAuthorizedUser =
    parsedUser?.provider === "local" || isAuthorizedGoogleProfile(parsedUser);
  const isAuth = Boolean(parsedUser && token && isAuthorizedUser);

  if (isLocalhost() && admin_mode) {
    if (!isAuth) {
      localStorage.setItem("authToken", "local-admin");
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          name: "admin",
          email: "admin@localhost",
          picture: "",
          provider: "local",
          role: "admin",
          allowedFeatures: ["superintendencias", "prodes"],
        })
      );
    }
    return element;
  }

  if (!isAuth) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  }

  return isAuth ? element : <Navigate to="/" replace />;
}

export default PrivateRoute;
