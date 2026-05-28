const { createHash } = require("crypto");

const ADMIN_COOKIE_NAME = "gn_admin";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_PASSWORD = process.env.GOLDNOIR_ADMIN_PASSWORD || "goldnoir2024";
const ADMIN_SESSION_SECRET = process.env.GOLDNOIR_ADMIN_SECRET || "goldnoir-secret-key";

function hash(text) {
  return createHash("sha256").update(text).digest("hex");
}

async function createAdminSessionToken() {
  const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
  return `${expiresAt}.${hash(`${expiresAt}:${ADMIN_SESSION_SECRET}`)}`;
}

async function verifyAdminSessionToken(token) {
  if (!token || typeof token !== "string") return false;
  const [expiresAtText, signature] = token.split(".");
  const expiresAt = Number(expiresAtText);
  if (!expiresAt || Number.isNaN(expiresAt) || expiresAt < Date.now()) return false;
  const expected = hash(`${expiresAt}:${ADMIN_SESSION_SECRET}`);
  return signature === expected;
}

function isValidAdminPassword(password) {
  return password === ADMIN_PASSWORD;
}

function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

function buildSessionCookie(token, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const secure = String(process.env.NODE_ENV || "development") === "production";
  return `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure ? "; Secure" : ""}`;
}

function buildClearSessionCookie() {
  const secure = String(process.env.NODE_ENV || "development") === "production";
  return `${ADMIN_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`;
}

module.exports = {
  createAdminSessionToken,
  verifyAdminSessionToken,
  isValidAdminPassword,
  getAdminCookieName,
  buildSessionCookie,
  buildClearSessionCookie,
};
