const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';
const PERMISSIONS_KEY = 'authPermissions';

// Evento interno (mesma aba) para a UI reagir a login/logout sem depender
// do evento "storage" do browser, que só dispara entre abas diferentes.
export const SESSION_CHANGE_EVENT = 'sessionchange';

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function notifySessionChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SESSION_CHANGE_EVENT));
}

export function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem(PERMISSIONS_KEY);
  notifySessionChanged();
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PERMISSIONS_KEY); // limpa cache de permissões no logout
  notifySessionChanged();
}

export function hasSession() {
  return Boolean(getStoredToken() && getStoredUser());
}
