import { useState, useEffect, useCallback } from "react";
import {
  getStoredUser,
  clearSession,
  SESSION_CHANGE_EVENT,
} from "../services/authSession";

// Estado de sessão reativo e compartilhável, sem refatoração grande.
// Reage a login/logout via evento "sessionchange" (mesma aba) e "storage"
// (outras abas).
export function useAuthSession() {
  const [user, setUser] = useState(() => getStoredUser());

  const refreshSession = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    refreshSession();
    window.addEventListener("storage", refreshSession);
    window.addEventListener(SESSION_CHANGE_EVENT, refreshSession);
    return () => {
      window.removeEventListener("storage", refreshSession);
      window.removeEventListener(SESSION_CHANGE_EVENT, refreshSession);
    };
  }, [refreshSession]);

  const logout = useCallback(() => {
    clearSession(); // limpa authToken, authUser e authPermissions + notifica
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    refreshSession,
    logout,
  };
}
