import { apiRequest } from './api.js';
import { setSession } from './authSession.js';

export async function loginWithEmailPassword({ email, password }) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setSession({ token: data.token, user: data.user });
  return data.user;
}

export async function registerWithEmailPassword({ name, email, password }) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setSession({ token: data.token, user: data.user });
  return data.user;
}

export async function getMe() {
  return apiRequest('/auth/me');
}

export async function devLoginWithBackend() {
  if (!import.meta.env.DEV) return null;
  const data = await apiRequest('/auth/dev-login', { method: 'POST' });
  setSession({ token: data.token, user: data.user });
  return data.user;
}

// Mantido para compatibilidade com Register.jsx legado
export const registerUser = ({ name, email, password, username }) =>
  registerWithEmailPassword({ name: name ?? username, email, password });
