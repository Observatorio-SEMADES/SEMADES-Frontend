import { apiRequest, hasApiUrl, getAuthToken } from './api.js';
import { setSession, clearSession, getStoredUser } from './authSession.js';

export async function loginWithEmailPassword({ email, password }) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setSession({ token: data.token, user: data.user });
  return data.user;
}

// GET /auth/me → backend responde { user: {...} }
export async function getMe() {
  const data = await apiRequest('/auth/me');
  return data?.user ?? null;
}

export function logout() {
  clearSession();
}

// Valida a sessão atual contra o backend.
// - Sem token → null
// - Com VITE_API_URL → chama /auth/me; em 401/403 limpa sessão; em sucesso
//   atualiza authUser com a resposta do backend.
// - Erro de rede → mantém a sessão local (mas não a considera validada).
// - DEV sem API → fallback local (usuário armazenado).
// - Produção sem API → null (não confiar em sessão local p/ área restrita).
export async function validateCurrentSession() {
  const token = getAuthToken();
  if (!token) return null;

  if (hasApiUrl()) {
    try {
      const user = await getMe();
      if (!user) {
        clearSession();
        return null;
      }
      const current = getStoredUser();
      setSession({ token, user: { ...current, ...user } }, { preservePermissions: true });
      return user;
    } catch (err) {
      if (err?.status === 401 || err?.status === 403) {
        clearSession();
        return null;
      }
      // Erro de rede/servidor: não derruba a sessão, mas não valida.
      return getStoredUser();
    }
  }

  if (import.meta.env.DEV) {
    return getStoredUser();
  }
  return null;
}

export async function devLoginWithBackend() {
  if (!import.meta.env.DEV) return null;
  const data = await apiRequest('/auth/dev-login', { method: 'POST' });
  setSession({ token: data.token, user: data.user });
  return data.user;
}
