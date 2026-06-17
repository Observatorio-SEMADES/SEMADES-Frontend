import { apiRequest, hasApiUrl } from './api.js';
import { clearSession } from './authSession.js';

const PERMISSIONS_KEY = 'authPermissions';

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
    if (feature === 'superintendencias')
      return Boolean(cached.canAccessSuperintendencias ?? (Array.isArray(cached.allowedFeatures) && cached.allowedFeatures.includes(feature)));
    if (feature === 'ferramentas')
      return Boolean(cached.canAccessFerramentas ?? (Array.isArray(cached.allowedFeatures) && cached.allowedFeatures.includes(feature)));
    if (feature === 'prodes')
      return Boolean(cached.canAccessProdes ?? (Array.isArray(cached.allowedFeatures) && cached.allowedFeatures.includes(feature)));
    return Array.isArray(cached.allowedFeatures) && cached.allowedFeatures.includes(feature);
  }

  const user = getCurrentUser();
  if (!user) return false;

  // Com backend configurado, a fonte de verdade é o cache validado por
  // /permissions/me. Sem cache ainda, bloqueia a feature restrita (não confia
  // no allowedFeatures local). Sem API (dev offline), usa o usuário local.
  if (hasApiUrl()) {
    return false;
  }

  if (user.role === 'admin') return true;
  return getAllowedFeatures().includes(feature);
}
