const SESSION_KEY = "goldnoir_session_id";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSessionId() {
  if (!canUseBrowserStorage()) return "server-session";

  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackClientEvent({ eventType, action, label = "", metadata = {}, page }) {
  if (typeof window === "undefined") return;

  const payload = {
    sessionId: getSessionId(),
    eventType,
    action,
    label,
    metadata,
    page: page || window.location.pathname,
  };

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  void fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}
