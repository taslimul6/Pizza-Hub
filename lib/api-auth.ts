import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Server only. Gets a short-lived JWT for the logged-in user from Better Auth.
// The token is sent to the Express API as "Authorization: Bearer <token>".
// It never goes to the browser. Returns null when nobody is logged in.
export async function getAuthToken(): Promise<string | null> {
  try {
    const result = await auth.api.getToken({ headers: await headers() });
    return result?.token ?? null;
  } catch {
    return null;
  }
}

// Like fetch(), for the protected routes of the Express API:
// authFetch("/orders", { method: "POST", body: ... })
// Without a login the request is sent without a token, and the API answers 401.
export async function authFetch(path: string, init: RequestInit = {}) {
  const token = await getAuthToken();
  return fetch(new URL(path, process.env.API_URL), {
    ...init,
    headers: {
      ...(init.headers as Record<string, string> | undefined),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
}
