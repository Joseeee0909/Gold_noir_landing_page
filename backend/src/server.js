require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  buildDashboard,
  buildStats,
  createContact,
  createOrder,
  deleteProduct,
  listCategories,
  listContacts,
  listEvents,
  listOrders,
  listProducts,
  listQuizResponses,
  replaceProducts,
  saveQuizResponse,
  trackEvent,
  updateProduct,
  addProduct,
} = require("./store");
const {
  buildClearSessionCookie,
  buildSessionCookie,
  createAdminSessionToken,
  getAdminCookieName,
  isValidAdminPassword,
  verifyAdminRecoveryCode,
  updateAdminPassword,
  verifyAdminSessionToken,
} = require("./auth");

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

function asyncHandler(handler) {
  return (request, response, next) => Promise.resolve(handler(request, response, next)).catch(next);
}

function jsonError(response, status, message) {
  return response.status(status).json({ error: message });
}

function getTokenFromCookies(cookieHeader = "") {
  const tokenPair = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${getAdminCookieName()}=`));
  if (!tokenPair) return "";
  return tokenPair.slice(getAdminCookieName().length + 1);
}

async function requireAdmin(request, response) {
  const token = getTokenFromCookies(request.headers.cookie || "");
  if (!(await verifyAdminSessionToken(token))) {
    jsonError(response, 401, "No autorizado");
    return false;
  }
  return true;
}

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "goldnoir-backend" });
});

app.get("/products", asyncHandler(async (_request, response) => {
  response.json({ products: await listProducts() });
}));

app.post("/products", asyncHandler(async (request, response) => {
  if (!(await requireAdmin(request, response))) return;
  const body = request.body || {};
  if (!body.name || body.price == null) return jsonError(response, 400, "name y price son requeridos");
  response.status(201).json({ product: await addProduct(body) });
}));

app.put("/products", asyncHandler(async (request, response) => {
  if (!(await requireAdmin(request, response))) return;
  const body = request.body || {};
  const products = Array.isArray(body.products) ? body.products : [];
  response.json({ products: await replaceProducts(products) });
}));

app.patch("/products/:id", asyncHandler(async (request, response) => {
  if (!(await requireAdmin(request, response))) return;
  const updated = await updateProduct(request.params.id, request.body || {});
  if (!updated) return jsonError(response, 404, "Producto no encontrado");
  response.json({ product: updated });
}));

app.delete("/products/:id", asyncHandler(async (request, response) => {
  if (!(await requireAdmin(request, response))) return;
  const deleted = await deleteProduct(request.params.id);
  if (!deleted) return jsonError(response, 404, "Producto no encontrado");
  response.json({ ok: true });
}));

app.get("/orders", asyncHandler(async (_request, response) => {
  response.json({ orders: await listOrders(100) });
}));

app.post("/orders", asyncHandler(async (request, response) => {
  const body = request.body || {};
  if (!body.productId || !body.name || !body.phone) return jsonError(response, 400, "productId, name y phone son requeridos");
  response.status(201).json({ order: await createOrder(body) });
}));

app.get("/contacts", asyncHandler(async (_request, response) => {
  response.json({ contacts: await listContacts(100) });
}));

app.post("/contacts", asyncHandler(async (request, response) => {
  const body = request.body || {};
  if (!body.message) return jsonError(response, 400, "message es requerido");
  response.status(201).json({ contact: await createContact(body) });
}));

app.get("/quiz", asyncHandler(async (_request, response) => {
  response.json({ quizResponses: await listQuizResponses(100) });
}));

app.post("/quiz", asyncHandler(async (request, response) => {
  const body = request.body || {};
  if (!body.answers || !body.results) return jsonError(response, 400, "answers y results son requeridos");
  response.status(201).json({ quizResponse: await saveQuizResponse({
    answers: body.answers,
    results: body.results,
    sessionId: body.sessionId,
    page: body.page || "/quiz",
  }) });
}));

app.post("/recommendations", asyncHandler(async (request, response) => {
  const body = request.body || {};
  const products = Array.isArray(body.products) && body.products.length > 0 ? body.products : await listProducts();
  const answers = body.answers || {};

  const recommendations = products
    .map((perfume) => {
      let score = 0;
      const price = Number(perfume.price) || 0;
      if (answers.gender && perfume.gender === answers.gender) score += 30;
      if (answers.occasion && perfume.occasion === answers.occasion) score += 25;
      if (answers.duration && String(perfume.duration || "").includes(String(answers.duration || ""))) score += 15;
      if (answers.favorites && String(answers.favorites).toLowerCase().includes(String(perfume.name || "").toLowerCase())) score += 25;
      if (price > 0) score += Math.max(5, Math.round(500000 / price));
      return { ...perfume, match: Math.max(55, Math.min(98, score)) };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);

  await saveQuizResponse({
    answers,
    results: recommendations.map((item) => item.id),
    sessionId: body.sessionId,
    page: body.page || "/quiz",
  });

  response.json({ recommendations });
}));

app.get("/categories", asyncHandler(async (_request, response) => {
  response.json({ categories: await listCategories() });
}));

app.get("/stats", asyncHandler(async (_request, response) => {
  response.json({ stats: await buildStats() });
}));

app.get("/dashboard", asyncHandler(async (_request, response) => {
  response.json(await buildDashboard());
}));

app.post("/track", asyncHandler(async (request, response) => {
  const body = request.body || {};
  if (!body.eventType || !body.action) return jsonError(response, 400, "eventType y action son requeridos");
  await trackEvent({
    sessionId: body.sessionId,
    eventType: body.eventType,
    page: body.page,
    action: body.action,
    label: body.label,
    metadata: body.metadata,
  });
  response.status(201).json({ ok: true });
}));

app.post("/admin/login", asyncHandler(async (request, response) => {
  const password = String(request.body?.password || "");
  if (!(await isValidAdminPassword(password))) return jsonError(response, 401, "Contraseña incorrecta");
  const token = await createAdminSessionToken();
  response.setHeader("Set-Cookie", buildSessionCookie(token));
  response.json({ ok: true });
}));

app.post("/admin/recover", asyncHandler(async (request, response) => {
  const cc = String(request.body?.cc || "").trim();
  const newPassword = String(request.body?.newPassword || "");

  if (!cc) return jsonError(response, 400, "cc es requerido");
  if (newPassword.length < 8) return jsonError(response, 400, "La nueva contraseña debe tener al menos 8 caracteres");
  if (!(await verifyAdminRecoveryCode(cc))) return jsonError(response, 401, "La cédula no coincide");

  await updateAdminPassword(newPassword);
  response.json({ ok: true });
}));

app.post("/admin/logout", asyncHandler(async (_request, response) => {
  response.setHeader("Set-Cookie", buildClearSessionCookie());
  response.json({ ok: true });
}));

app.get("/admin/me", asyncHandler(async (request, response) => {
  const token = getTokenFromCookies(request.headers.cookie || "");
  response.json({ authed: await verifyAdminSessionToken(token) });
}));

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Error interno del servidor" });
});

app.listen(port, () => {
  console.log(`GoldNoir backend running on port ${port}`);
});
