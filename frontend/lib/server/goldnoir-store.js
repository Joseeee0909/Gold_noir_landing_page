const { randomUUID } = require("crypto");

let Pool;
try {
  ({ Pool } = require("pg"));
} catch {
  Pool = null;
}

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const postgresEnabled = hasDatabaseUrl && Boolean(Pool);
const shouldUseSsl = ["true", "1", "yes"].includes(String(process.env.POSTGRES_SSL || "").toLowerCase());

const seedProducts = [
  {
    id: "goldnoir-212-vip-rose",
    name: "212 VIP Rose",
    brand: "Carolina Herrera",
    price: 389000,
    gender: "Femenino",
    occasion: "Noche & eventos",
    duration: "6-8 horas",
    notes: "Champagne, florales, madera suave",
    inspiration: "Una fragancia vibrante para destacar con elegancia.",
    image: "",
    category: "Femenino",
    createdAt: new Date().toISOString(),
  },
  {
    id: "goldnoir-voyage",
    name: "Voyage",
    brand: "Nautica",
    price: 289000,
    gender: "Masculino",
    occasion: "Uso diario",
    duration: "4-6 horas",
    notes: "Manzana verde, notas acuaticas, almizcle",
    inspiration: "Fresco, limpio y versatil para todos los dias.",
    image: "",
    category: "Masculino",
    createdAt: new Date().toISOString(),
  },
  {
    id: "goldnoir-black-opium",
    name: "Black Opium",
    brand: "YSL",
    price: 499000,
    gender: "Femenino",
    occasion: "Noche",
    duration: "8+ horas",
    notes: "Cafe, vainilla, flores blancas",
    inspiration: "Un perfil intenso y seductor para noches especiales.",
    image: "",
    category: "Femenino",
    createdAt: new Date().toISOString(),
  },
];

const defaultStore = {
  categories: [
    { id: "femenino", name: "Femenino", slug: "femenino" },
    { id: "masculino", name: "Masculino", slug: "masculino" },
    { id: "unisex", name: "Unisex", slug: "unisex" },
  ],
  products: seedProducts,
  orders: [],
  contacts: [],
  quizResponses: [],
  events: [],
};

let pool = null;
let initPromise = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function perfumeSignature(perfume = {}) {
  return [
    String(perfume.name || "").trim().toLowerCase(),
    String(perfume.brand || "").trim().toLowerCase(),
    String(perfume.gender || "").trim().toLowerCase(),
    String(perfume.occasion || "").trim().toLowerCase(),
    String(perfume.duration || "").trim().toLowerCase(),
    String(perfume.notes || "").trim().toLowerCase(),
    String(perfume.inspiration || "").trim().toLowerCase(),
    String(perfume.price ?? "").trim().toLowerCase(),
  ].join("|");
}

function dedupePerfumes(perfumes = []) {
  const seen = new Set();
  const unique = [];

  for (const perfume of perfumes) {
    const signature = perfumeSignature(perfume);
    if (seen.has(signature)) continue;
    seen.add(signature);
    unique.push(perfume);
  }

  return unique;
}

function normalizeStore(store) {
  return {
    ...defaultStore,
    ...store,
    categories: Array.isArray(store.categories) ? store.categories : defaultStore.categories,
    products: Array.isArray(store.products) ? store.products : defaultStore.products,
    orders: Array.isArray(store.orders) ? store.orders : [],
    contacts: Array.isArray(store.contacts) ? store.contacts : [],
    quizResponses: Array.isArray(store.quizResponses) ? store.quizResponses : [],
    events: Array.isArray(store.events) ? store.events : [],
  };
}

async function ensureStore() {
  throw new Error("DATABASE_URL is required. Local JSON storage is disabled.");
}

async function saveStore(store) {
  if (!store) {
    throw new Error("DATABASE_URL is required. Local JSON storage is disabled.");
  }
  return clone(store);
}

function safeJson(value) {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value;
}

function percent(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return `${Math.max(0, Math.min(100, Math.round(safe * 10) / 10))}%`;
}

function pickTop(values) {
  const counts = new Map();
  for (const value of values) {
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  let best = null;
  let bestCount = -1;
  for (const [value, count] of counts.entries()) {
    if (count > bestCount) {
      best = value;
      bestCount = count;
    }
  }
  return best;
}

function normalizeEvent(input = {}) {
  return {
    id: input.id || randomUUID(),
    sessionId: input.sessionId || "anon",
    eventType: input.eventType || "click",
    page: input.page || "/",
    action: input.action || "unknown",
    label: input.label || "",
    metadata: input.metadata || {},
    createdAt: input.createdAt || new Date().toISOString(),
  };
}

function getPool() {
  if (!postgresEnabled) return null;
  if (pool) return pool;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
  });
  return pool;
}

async function initPostgres() {
  const pgPool = getPool();
  if (!pgPool) return false;
  if (!initPromise) {
    initPromise = (async () => {
      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          brand TEXT NOT NULL,
          price INTEGER NOT NULL,
          gender TEXT NOT NULL,
          occasion TEXT,
          duration TEXT,
          notes TEXT,
          inspiration TEXT,
          image TEXT,
          category TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          product_id TEXT,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          city TEXT,
          notes TEXT,
          channel TEXT,
          perfume_name TEXT,
          perfume_brand TEXT,
          price INTEGER,
          status TEXT NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS contacts (
          id TEXT PRIMARY KEY,
          name TEXT,
          phone TEXT,
          channel TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS quiz_responses (
          id TEXT PRIMARY KEY,
          session_id TEXT,
          answers JSONB NOT NULL,
          results JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id TEXT PRIMARY KEY,
          session_id TEXT NOT NULL,
          event_type TEXT NOT NULL,
          page TEXT NOT NULL,
          action TEXT NOT NULL,
          label TEXT,
          metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await pgPool.query("CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);");
      await pgPool.query("CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);");
      await pgPool.query("CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);");
      await pgPool.query("CREATE INDEX IF NOT EXISTS idx_quiz_created_at ON quiz_responses(created_at DESC);");
      await pgPool.query("CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at DESC);");
      await pgPool.query("CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events(event_type);");

      const existing = await pgPool.query("SELECT COUNT(*)::int AS count FROM products;");
      if ((existing.rows[0]?.count || 0) === 0) {
        for (const product of seedProducts) {
          await pgPool.query(
            `
            INSERT INTO products (
              id, name, brand, price, gender, occasion, duration, notes, inspiration, image, category, created_at, updated_at
            ) VALUES (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12
            );
            `,
            [
              product.id,
              product.name,
              product.brand,
              Number(product.price) || 0,
              product.gender || "Unisex",
              product.occasion || "",
              product.duration || "",
              product.notes || "",
              product.inspiration || "",
              product.image || "",
              product.category || product.gender || "Unisex",
              product.createdAt,
            ],
          );
        }
      }
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  await initPromise;
  return true;
}

function mapProductRow(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: Number(row.price),
    gender: row.gender,
    occasion: row.occasion || "",
    duration: row.duration || "",
    notes: row.notes || "",
    inspiration: row.inspiration || "",
    image: row.image || "",
    category: row.category || row.gender || "Unisex",
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapOrderRow(row) {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    phone: row.phone,
    city: row.city || "",
    notes: row.notes || "",
    channel: row.channel || "web",
    perfumeName: row.perfume_name || "",
    perfumeBrand: row.perfume_brand || "",
    price: row.price != null ? Number(row.price) : null,
    status: row.status || "new",
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapContactRow(row) {
  return {
    id: row.id,
    name: row.name || "",
    phone: row.phone || "",
    channel: row.channel || "web",
    message: row.message,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapQuizRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id || "",
    answers: safeJson(row.answers),
    results: safeJson(row.results),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapEventRow(row) {
  return {
    id: row.id,
    sessionId: row.session_id,
    eventType: row.event_type,
    page: row.page,
    action: row.action,
    label: row.label || "",
    metadata: safeJson(row.metadata),
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function dbReady() {
  if (!postgresEnabled) return false;
  try {
    await initPostgres();
    return true;
  } catch (error) {
    console.error("[goldnoir-store] PostgreSQL unavailable:", error.message);
    throw error;
  }
}

async function listProducts() {
  if (await dbReady()) {
    const rows = await getPool().query("SELECT * FROM products ORDER BY created_at DESC;");
    return rows.rows.map(mapProductRow);
  }

  const store = await ensureStore();
  return clone(store.products);
}

async function replaceProducts(products) {
  const normalized = dedupePerfumes(products).map((product) => ({
    id: product.id || randomUUID(),
    name: product.name,
    brand: product.brand || "GoldNoir",
    price: Number(product.price),
    gender: product.gender || "Unisex",
    occasion: product.occasion || "",
    duration: product.duration || "",
    notes: product.notes || "",
    inspiration: product.inspiration || "",
    image: product.image || "",
    category: product.category || product.gender || "Unisex",
    createdAt: product.createdAt || new Date().toISOString(),
  }));

  if (await dbReady()) {
    const pgPool = getPool();
    await pgPool.query("DELETE FROM products;");

    for (const product of normalized) {
      await pgPool.query(
        `
        INSERT INTO products (
          id, name, brand, price, gender, occasion, duration, notes, inspiration, image, category, created_at, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12
        );
        `,
        [
          product.id,
          product.name,
          product.brand,
          Number(product.price) || 0,
          product.gender,
          product.occasion,
          product.duration,
          product.notes,
          product.inspiration,
          product.image,
          product.category,
          product.createdAt,
        ],
      );
    }

    return listProducts();
  }

  const store = await ensureStore();
  store.products = normalized;
  await saveStore(store);
  return clone(store.products);
}

async function addProduct(product) {
  const created = {
    id: product.id || randomUUID(),
    name: product.name,
    brand: product.brand || "GoldNoir",
    price: Number(product.price),
    gender: product.gender || "Unisex",
    occasion: product.occasion || "",
    duration: product.duration || "",
    notes: product.notes || "",
    inspiration: product.inspiration || "",
    image: product.image || "",
    category: product.category || product.gender || "Unisex",
    createdAt: new Date().toISOString(),
  };

  if (await dbReady()) {
    const existing = await getPool().query(
      `SELECT id FROM products WHERE lower(name) = lower($1) AND lower(brand) = lower($2) AND lower(gender) = lower($3) LIMIT 1;`,
      [created.name, created.brand, created.gender],
    );

    if (existing.rows.length > 0) {
      await getPool().query(
        `
        UPDATE products
        SET price = $2,
            occasion = $3,
            duration = $4,
            notes = $5,
            inspiration = $6,
            image = $7,
            category = $8,
            updated_at = NOW()
        WHERE id = $1
        `,
        [
          existing.rows[0].id,
          Number(created.price) || 0,
          created.occasion,
          created.duration,
          created.notes,
          created.inspiration,
          created.image,
          created.category,
        ],
      );

      const updated = await getPool().query("SELECT * FROM products WHERE id = $1 LIMIT 1;", [existing.rows[0].id]);
      return mapProductRow(updated.rows[0]);
    }

    await getPool().query(
      `
      INSERT INTO products (
        id, name, brand, price, gender, occasion, duration, notes, inspiration, image, category, created_at, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12
      );
      `,
      [
        created.id,
        created.name,
        created.brand,
        Number(created.price) || 0,
        created.gender,
        created.occasion,
        created.duration,
        created.notes,
        created.inspiration,
        created.image,
        created.category,
        created.createdAt,
      ],
    );
    return created;
  }

  const store = await ensureStore();
  const existingIndex = store.products.findIndex((item) => perfumeSignature(item) === perfumeSignature(created));
  if (existingIndex !== -1) {
    store.products[existingIndex] = {
      ...store.products[existingIndex],
      ...created,
    };
    await saveStore(store);
    return clone(store.products[existingIndex]);
  }

  store.products.unshift(created);
  await saveStore(store);
  return clone(created);
}

async function updateProduct(id, patch) {
  if (await dbReady()) {
    const current = await getPool().query("SELECT * FROM products WHERE id = $1 LIMIT 1;", [id]);
    if (current.rows.length === 0) return null;

    const existing = mapProductRow(current.rows[0]);
    const updated = {
      ...existing,
      ...patch,
      brand: patch.brand || existing.brand || "GoldNoir",
      price: patch.price != null ? Number(patch.price) : existing.price,
      updatedAt: new Date().toISOString(),
    };

    await getPool().query(
      `
      UPDATE products
      SET name = $2,
          brand = $3,
          price = $4,
          gender = $5,
          occasion = $6,
          duration = $7,
          notes = $8,
          inspiration = $9,
          image = $10,
          category = $11,
          updated_at = $12
      WHERE id = $1;
      `,
      [
        id,
        updated.name,
        updated.brand,
        Number(updated.price) || 0,
        updated.gender || "Unisex",
        updated.occasion || "",
        updated.duration || "",
        updated.notes || "",
        updated.inspiration || "",
        updated.image || "",
        updated.category || updated.gender || "Unisex",
        updated.updatedAt,
      ],
    );

    return {
      ...updated,
      createdAt: existing.createdAt,
    };
  }

  const store = await ensureStore();
  const index = store.products.findIndex((item) => item.id === id);
  if (index === -1) return null;

  store.products[index] = {
    ...store.products[index],
    ...patch,
    brand: patch.brand || store.products[index].brand || "GoldNoir",
    price: patch.price != null ? Number(patch.price) : store.products[index].price,
  };

  await saveStore(store);
  return clone(store.products[index]);
}

async function deleteProduct(id) {
  if (await dbReady()) {
    const result = await getPool().query("DELETE FROM products WHERE id = $1;", [id]);
    return result.rowCount > 0;
  }

  const store = await ensureStore();
  const before = store.products.length;
  store.products = store.products.filter((item) => item.id !== id);
  await saveStore(store);
  return before !== store.products.length;
}

async function trackEvent(event) {
  const normalized = normalizeEvent(event);

  if (await dbReady()) {
    await getPool().query(
      `
      INSERT INTO analytics_events (id, session_id, event_type, page, action, label, metadata, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8);
      `,
      [
        normalized.id,
        normalized.sessionId,
        normalized.eventType,
        normalized.page,
        normalized.action,
        normalized.label,
        JSON.stringify(normalized.metadata || {}),
        normalized.createdAt,
      ],
    );
    return normalized;
  }

  const store = await ensureStore();
  store.events.unshift(normalized);
  if (store.events.length > 5000) {
    store.events = store.events.slice(0, 5000);
  }
  await saveStore(store);
  return clone(normalized);
}

async function createOrder(order) {
  const created = {
    id: randomUUID(),
    ...order,
    status: order.status || "new",
    createdAt: new Date().toISOString(),
  };

  if (await dbReady()) {
    await getPool().query(
      `
      INSERT INTO orders (
        id, product_id, name, phone, city, notes, channel, perfume_name, perfume_brand, price, status, created_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      );
      `,
      [
        created.id,
        created.productId || null,
        created.name,
        created.phone,
        created.city || "",
        created.notes || "",
        created.channel || "web",
        created.perfumeName || "",
        created.perfumeBrand || "",
        created.price != null ? Number(created.price) : null,
        created.status,
        created.createdAt,
      ],
    );

    await trackEvent({
      sessionId: created.sessionId || "anon",
      eventType: "conversion",
      page: created.page || "/perfume",
      action: "order_submit",
      label: created.perfumeName || created.productId || "order",
      metadata: {
        productId: created.productId || null,
        city: created.city || null,
        channel: created.channel || "web",
      },
    });

    return created;
  }

  const store = await ensureStore();
  store.orders.unshift(created);
  await trackEvent({
    sessionId: created.sessionId || "anon",
    eventType: "conversion",
    page: created.page || "/perfume",
    action: "order_submit",
    label: created.perfumeName || created.productId || "order",
  });
  await saveStore(store);
  return clone(created);
}

async function listOrders(limit = 100) {
  if (await dbReady()) {
    const rows = await getPool().query("SELECT * FROM orders ORDER BY created_at DESC LIMIT $1;", [Math.max(1, Number(limit) || 100)]);
    return rows.rows.map(mapOrderRow);
  }

  const store = await ensureStore();
  return clone(store.orders).slice(0, limit);
}

async function createContact(contact) {
  const created = {
    id: randomUUID(),
    ...contact,
    createdAt: new Date().toISOString(),
  };

  if (await dbReady()) {
    await getPool().query(
      `
      INSERT INTO contacts (id, name, phone, channel, message, created_at)
      VALUES ($1, $2, $3, $4, $5, $6);
      `,
      [
        created.id,
        created.name || "",
        created.phone || "",
        created.channel || "web",
        created.message,
        created.createdAt,
      ],
    );

    await trackEvent({
      sessionId: created.sessionId || "anon",
      eventType: "conversion",
      page: created.page || "/contacto",
      action: "contact_submit",
      label: created.channel || "web",
      metadata: {
        channel: created.channel || "web",
      },
    });

    return created;
  }

  const store = await ensureStore();
  store.contacts.unshift(created);
  await trackEvent({
    sessionId: created.sessionId || "anon",
    eventType: "conversion",
    page: created.page || "/contacto",
    action: "contact_submit",
    label: created.channel || "web",
  });
  await saveStore(store);
  return clone(created);
}

async function listContacts(limit = 100) {
  if (await dbReady()) {
    const rows = await getPool().query("SELECT * FROM contacts ORDER BY created_at DESC LIMIT $1;", [Math.max(1, Number(limit) || 100)]);
    return rows.rows.map(mapContactRow);
  }

  const store = await ensureStore();
  return clone(store.contacts).slice(0, limit);
}

async function saveQuizResponse(response) {
  const created = {
    id: randomUUID(),
    sessionId: response.sessionId || "anon",
    answers: response.answers || {},
    results: response.results || [],
    createdAt: new Date().toISOString(),
  };

  if (await dbReady()) {
    await getPool().query(
      `
      INSERT INTO quiz_responses (id, session_id, answers, results, created_at)
      VALUES ($1, $2, $3::jsonb, $4::jsonb, $5);
      `,
      [created.id, created.sessionId, JSON.stringify(created.answers), JSON.stringify(created.results), created.createdAt],
    );

    await trackEvent({
      sessionId: created.sessionId,
      eventType: "conversion",
      page: response.page || "/quiz",
      action: "quiz_submit",
      label: `${Object.keys(created.answers).length} respuestas`,
      metadata: {
        resultCount: Array.isArray(created.results) ? created.results.length : 0,
      },
    });

    return created;
  }

  const store = await ensureStore();
  store.quizResponses.unshift(created);
  await trackEvent({
    sessionId: created.sessionId,
    eventType: "conversion",
    page: response.page || "/quiz",
    action: "quiz_submit",
    label: `${Object.keys(created.answers).length} respuestas`,
  });
  await saveStore(store);
  return clone(created);
}

async function listQuizResponses(limit = 100) {
  if (await dbReady()) {
    const rows = await getPool().query("SELECT * FROM quiz_responses ORDER BY created_at DESC LIMIT $1;", [Math.max(1, Number(limit) || 100)]);
    return rows.rows.map(mapQuizRow);
  }

  const store = await ensureStore();
  return clone(store.quizResponses).slice(0, limit);
}

async function listEvents(limit = 300) {
  if (await dbReady()) {
    const rows = await getPool().query("SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT $1;", [Math.max(1, Number(limit) || 300)]);
    return rows.rows.map(mapEventRow);
  }

  const store = await ensureStore();
  return clone(store.events).slice(0, limit);
}

function lastSevenLabels() {
  const labels = [];
  const today = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push({
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", ""),
      date,
    });
  }
  return labels;
}

function buildDailySeriesFromEvents(events, leadsByDay) {
  const days = lastSevenLabels();
  const eventMap = new Map();

  for (const event of events) {
    const key = String(event.createdAt || "").slice(0, 10);
    if (!eventMap.has(key)) {
      eventMap.set(key, { views: 0, clicks: 0, conversions: 0 });
    }
    const bucket = eventMap.get(key);
    if (event.eventType === "page_view") bucket.views += 1;
    if (event.eventType === "click") bucket.clicks += 1;
    if (event.eventType === "conversion") bucket.conversions += 1;
  }

  return days.map((day) => {
    const bucket = eventMap.get(day.key) || { views: 0, clicks: 0, conversions: 0 };
    const leads = leadsByDay.get(day.key) || 0;
    return {
      label: day.label,
      date: day.key,
      views: bucket.views,
      clicks: bucket.clicks,
      conversions: Math.max(bucket.conversions, leads),
      leads,
    };
  });
}

async function buildDashboard() {
  const [products, orders, contacts, quizResponses, events] = await Promise.all([
    listProducts(),
    listOrders(200),
    listContacts(200),
    listQuizResponses(200),
    listEvents(1500),
  ]);

  const pageViews = events.filter((event) => event.eventType === "page_view");
  const clicks = events.filter((event) => event.eventType === "click");
  const conversions = events.filter((event) => event.eventType === "conversion");

  const visitorSessions = new Set(pageViews.map((event) => event.sessionId).filter(Boolean));
  const clickSessions = new Set(clicks.map((event) => event.sessionId).filter(Boolean));

  const leads = contacts.length + orders.length + quizResponses.length;
  const visits = Math.max(pageViews.length, visitorSessions.size);
  const conversionRate = visits > 0 ? (leads / visits) * 100 : 0;
  const clickRate = visits > 0 ? (clicks.length / visits) * 100 : 0;

  const topGender = pickTop(products.map((item) => item.gender)) || "Femenino";
  const topOccasion = pickTop(products.map((item) => item.occasion)) || "Noche & eventos";

  const topActionsMap = new Map();
  for (const event of clicks) {
    const actionKey = event.action || "click";
    topActionsMap.set(actionKey, (topActionsMap.get(actionKey) || 0) + 1);
  }

  const topActions = [...topActionsMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([action, count]) => ({ action, count }));

  const leadsByDay = new Map();
  const addLeadDay = (createdAt) => {
    const key = String(createdAt || "").slice(0, 10);
    if (!key) return;
    leadsByDay.set(key, (leadsByDay.get(key) || 0) + 1);
  };

  for (const order of orders) addLeadDay(order.createdAt);
  for (const contact of contacts) addLeadDay(contact.createdAt);
  for (const quiz of quizResponses) addLeadDay(quiz.createdAt);

  const daily = buildDailySeriesFromEvents(events, leadsByDay);

  return {
    source: postgresEnabled ? "postgres" : "local-json",
    configured: postgresEnabled,
    stats: {
      visits,
      uniqueVisitors: visitorSessions.size,
      activeVisitors: clickSessions.size,
      totalClicks: clicks.length,
      leads,
      catalog: products.length,
      conversion: percent(conversionRate),
      clickRate: percent(clickRate),
      topGender,
      topOccasion,
      categories: new Set(products.map((item) => item.category || item.gender || "Unisex")).size,
      orders: orders.length,
      contacts: contacts.length,
      quizResponses: quizResponses.length,
    },
    products,
    orders,
    contacts,
    quizResponses,
    recentContacts: contacts.slice(0, 5),
    recentOrders: orders.slice(0, 5),
    recentQuizResponses: quizResponses.slice(0, 5),
    analytics: {
      totalEvents: events.length,
      pageViews: pageViews.length,
      clicks: clicks.length,
      conversions: conversions.length,
      topActions,
      daily,
    },
  };
}

async function buildStats() {
  const dashboard = await buildDashboard();
  return dashboard.stats;
}

module.exports = {
  listProducts,
  replaceProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  listOrders,
  createContact,
  listContacts,
  saveQuizResponse,
  listQuizResponses,
  trackEvent,
  listEvents,
  buildDashboard,
  buildStats,
};
