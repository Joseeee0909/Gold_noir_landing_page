const ADMIN_COOKIE_NAME = "gn_admin";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_SESSION_SECRET = process.env.GOLDNOIR_ADMIN_SECRET || "goldnoir-secret-key";

function hex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(text) {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return hex(new Uint8Array(digest));
}

export async function createAdminSessionToken() {
  const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
  const signature = await sha256(`${expiresAt}:${ADMIN_SESSION_SECRET}`);
  return `${expiresAt}.${signature}`;
}

export async function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string") return false;
  const [expiresAtText, signature] = token.split(".");
  const expiresAt = Number(expiresAtText);
  if (!expiresAt || Number.isNaN(expiresAt) || expiresAt < Date.now()) return false;
  const expected = await sha256(`${expiresAt}:${ADMIN_SESSION_SECRET}`);
  return signature === expected;
}

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}