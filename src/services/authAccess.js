const parseCsv = (value) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const allowedEmails = new Set(parseCsv(import.meta.env.VITE_ALLOWED_GOOGLE_EMAILS));
const allowedDomains = new Set(parseCsv(import.meta.env.VITE_ALLOWED_GOOGLE_DOMAINS));

export const hasConfiguredGoogleAccessRules =
  allowedEmails.size > 0 || allowedDomains.size > 0;

if (!hasConfiguredGoogleAccessRules && import.meta.env.DEV) {
  console.warn(
    "[authAccess] Nenhuma whitelist configurada.\n" +
    "Defina VITE_ALLOWED_GOOGLE_EMAILS ou VITE_ALLOWED_GOOGLE_DOMAINS no arquivo .env\n" +
    "para liberar o login Google em produção."
  );
}

const getEmailDomain = (email) => {
  const normalized = String(email ?? "").trim().toLowerCase();
  const atIndex = normalized.lastIndexOf("@");
  return atIndex >= 0 ? normalized.slice(atIndex + 1) : "";
};

export function isAuthorizedGoogleProfile(profile) {
  const email = String(profile?.email ?? "").trim().toLowerCase();
  if (!email) return false;

  if (!hasConfiguredGoogleAccessRules) {
    return false;
  }

  if (allowedEmails.has(email)) {
    return true;
  }

  const domain = getEmailDomain(email);
  return Boolean(domain && allowedDomains.has(domain));
}

export function getGoogleAccessMessage() {
  if (!hasConfiguredGoogleAccessRules) {
    return "Acesso externo temporariamente desabilitado. Configure os e-mails ou domínios autorizados para liberar o login.";
  }

  return "Acesso restrito a contas Google autorizadas pela SEMADES.";
}
