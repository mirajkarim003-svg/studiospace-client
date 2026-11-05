// Turns the Better Auth session into the HTTPOnly JWT cookie issued by the Express server.
let inflight = null;

export function exchangeToken() {
  if (inflight) return inflight;
  inflight = (async () => {
    const r = await fetch("/api/server-token", { cache: "no-store", credentials: "include" });
    if (!r.ok) throw new Error("No active session");
    const { token } = await r.json();
    const res = await fetch("/backend/api/auth/token", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) throw new Error("Could not start a secure session with the server");
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}
