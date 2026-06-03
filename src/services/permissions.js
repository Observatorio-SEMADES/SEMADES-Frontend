export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('authUser');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isAuthenticated() {
  const user = getCurrentUser();
  const token = localStorage.getItem('authToken');
  return Boolean(user && token);
}

export function getAllowedFeatures() {
  const user = getCurrentUser();
  if (!user) return [];
  return Array.isArray(user.allowedFeatures) ? user.allowedFeatures : [];
}

export function canAccessFeature(feature) {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === 'admin') return true;
  return getAllowedFeatures().includes(feature);
}
