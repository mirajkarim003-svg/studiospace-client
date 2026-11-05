import { exchangeToken } from "./token";

const BASE = "/backend/api";

// Small fetch wrapper: JSON in/out, cookies included, nice error messages.
// If the server answers 401 we refresh the cookie once and retry.
export async function api(path, { method = "GET", body } = {}, retried = false) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      credentials: "include",
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !retried) {
    try {
      await exchangeToken();
      return api(path, { method, body }, true);
    } catch {
      /* fall through to the error below */
    }
  }
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}
