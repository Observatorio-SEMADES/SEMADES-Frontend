import { apiRequest, hasApiUrl } from './api.js';
import { clearSession } from './authSession.js';

const PERMISSIONS_KEY = 'authPermissions';

const LOCALHOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const isLocalhost = () =>
  typeof window !== 'undefined' && LOCALHOSTS.has(window.location?.hostname ?? '');

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('authUser');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isAuthenticated() {
  const user = getCurrentUser();
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return Boolean(user && token);
}

export function getAllowedFeatures() {
  const user = getCurrentUser();
  if (!user) return [];
  return Array.isArray(user.allowedFeatures) ? user.allowedFeatures : [];
}

// ── Cache de permissões validadas pelo backend (localStorage) ────────────────
function getCachedPermissions() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(PERMISSIONS_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function setCachedPermissions(perms) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(perms));
}

export function clearPermissionsCache() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PERMISSIONS_KEY);
}

// GET /permissions/me — valida no backend e cacheia. Em 401/403 limpa a sessão.
export async function fetchMyPermissions() {
  if (!hasApiUrl()) return null;
  try {
    const perms = await apiRequest('/permissions/me');
    setCachedPermissions(perms);
    return perms;
  } catch (err) {
    if (err?.status === 401 || err?.status === 403) {
      clearSession(); // remove token, usuário e cache de permissões
    }
    return null;
  }
}

// Síncrona, para renderização imediata. Prioriza o cache validado pelo backend.
export function canAccessFeature(feature) {
  const cached = getCachedPermissions();
  if (cached) {
    if (cached.role === 'admin') return true;
    if (feature === 'superintendencias') return Boolean(cached.canAccessSuperintendencias);
    if (feature === 'prodes') return Boolean(cached.canAccessProdes);
    return Array.isArray(cached.allowedFeatures) && cached.allowedFeatures.includes(feature);
  }

  const user = getCurrentUser();
  if (!user) return false;

  // Com API configurada mas sem permissão validada ainda: em produção bloqueia
  // a feature restrita; em DEV+localhost libera apenas para teste manual.
  if (hasApiUrl() && !(import.meta.env.DEV && isLocalhost())) {
    return false;
  }

  if (user.role === 'admin') return true;
  return getAllowedFeatures().includes(feature);
}
