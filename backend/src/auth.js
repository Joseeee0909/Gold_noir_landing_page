const { createHash, timingSafeEqual } = require("crypto");

let Pool;

try {
  ({ Pool } = require("pg"));
} catch {
  Pool = null;
}

const ADMIN_COOKIE_NAME = "gn_admin";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const ADMIN_SESSION_SECRET = process.env.GOLDNOIR_ADMIN_SECRET || "goldnoir-secret-key";
const ADMIN_PASSWORD_SEED = process.env.GOLDNOIR_ADMIN_PASSWORD || "goldNoir2026";
const ADMIN_RECOVERY_CC_SEED = process.env.GOLDNOIR_ADMIN_CC || "1110293098";
const ADMIN_AUTH_ID = "goldnoir-admin";
const postgresSsl = ["true", "1", "yes"].includes(String(process.env.POSTGRES_SSL || "").toLowerCase());

let adminAuthPromise = null;
let pool = null;

function hash(text) {
  return createHash("sha256").update(text).digest("hex");
}

function matchesHash(expected, actual) {
  if (!expected || !actual) return false;
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

function getPool() {
  if (!process.env.DATABASE_URL || !Pool) return null;
  if (pool) return pool;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: postgresSsl ? { rejectUnauthorized: false } : undefined,
  });
  return pool;
}

async function ensureAdminAuthSeed() {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error("DATABASE_URL is required. Admin auth must live in PostgreSQL.");
  }

  await currentPool.query(`
    CREATE TABLE IF NOT EXISTS admin_auth (
      id TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      cc_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const seeded = {
    passwordHash: hash(ADMIN_PASSWORD_SEED),
    ccHash: hash(ADMIN_RECOVERY_CC_SEED),
  };

  const existing = await currentPool.query(
    `SELECT id, password_hash, cc_hash FROM admin_auth WHERE id = $1 LIMIT 1`,
    [ADMIN_AUTH_ID],
  );

  if (existing.rows.length === 0) {
    await currentPool.query(
      `INSERT INTO admin_auth (id, password_hash, cc_hash) VALUES ($1, $2, $3)`,
      [ADMIN_AUTH_ID, seeded.passwordHash, seeded.ccHash],
    );
    return seeded;
  }

  const row = existing.rows[0];
  const nextConfig = {
    passwordHash: row.password_hash || seeded.passwordHash,
    ccHash: row.cc_hash || seeded.ccHash,
  };

  if (nextConfig.passwordHash !== row.password_hash || nextConfig.ccHash !== row.cc_hash) {
    await currentPool.query(
      `
      UPDATE admin_auth
      SET password_hash = $2, cc_hash = $3, updated_at = NOW()
      WHERE id = $1
      `,
      [ADMIN_AUTH_ID, nextConfig.passwordHash, nextConfig.ccHash],
    );
  }

  return nextConfig;
}

async function saveAdminAuthConfig(config) {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error("DATABASE_URL is required. Admin auth must live in PostgreSQL.");
  }

  await currentPool.query(
    `
    INSERT INTO admin_auth (id, password_hash, cc_hash, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      cc_hash = EXCLUDED.cc_hash,
      updated_at = NOW()
    `,
    [ADMIN_AUTH_ID, config.passwordHash, config.ccHash],
  );
}

async function getAdminAuthConfig() {
  if (!adminAuthPromise) {
    adminAuthPromise = ensureAdminAuthSeed();
  }
  return adminAuthPromise;
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

async function isValidAdminPassword(password) {
  const config = await getAdminAuthConfig();
  return matchesHash(config.passwordHash, hash(String(password || "")));
}

async function verifyAdminRecoveryCode(cc) {
  const config = await getAdminAuthConfig();
  if (!config.ccHash) return false;
  return matchesHash(config.ccHash, hash(String(cc || "")));
}

async function updateAdminPassword(newPassword) {
  const config = await getAdminAuthConfig();
  const nextConfig = {
    ...config,
    passwordHash: hash(String(newPassword || "")),
  };
  await saveAdminAuthConfig(nextConfig);
  adminAuthPromise = Promise.resolve(nextConfig);
  return true;
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
  verifyAdminRecoveryCode,
  updateAdminPassword,
  getAdminCookieName,
  buildSessionCookie,
  buildClearSessionCookie,
};
