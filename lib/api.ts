import { getAuthToken } from "@/lib/api-auth";

// Reads from the PizzaHub API (base URL comes from API_URL in .env).
// Public lists need no options. For a protected route pass { auth: true }:
// the logged-in user's token is then sent along. On any problem (API down,
// 401, 403) you get an empty list / null so pages can show an empty state.

type Options = { auth?: boolean };

async function get(path: string, options: Options) {
  const base = process.env.API_URL;
  if (!base) return null;

  const headers: Record<string, string> = {};
  if (options.auth) {
    const token = await getAuthToken();
    if (!token) return null;
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(new URL(path, base), { cache: "no-store", headers });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Get a JSON list
export async function getList<T>(path: string, options: Options = {}): Promise<T[]> {
  return (await get(path, options)) ?? [];
}

// Get one JSON object (for example /stats). null when it fails.
export async function getObject<T>(path: string, options: Options = {}): Promise<T | null> {
  return (await get(path, options)) ?? null;
}
