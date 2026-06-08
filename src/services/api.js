const getApiBaseUrl = () =>
  (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export const hasApiUrl = () => Boolean(import.meta.env.VITE_API_URL);

export const getAuthToken = () =>
  (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null) ?? null;

export async function apiRequest(path, options = {}) {
  const base = getApiBaseUrl();
  if (!base) throw new Error('VITE_API_URL não configurado.');

  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  let response;
  try {
    response = await fetch(`${base}${path}`, { ...options, headers });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está rodando.');
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = null; }
  }

  if (!response.ok) {
    const err = new Error(data?.message ?? `Erro ${response.status}`);
    err.status = response.status;
    throw err;
  }
  return data ?? {};
}
