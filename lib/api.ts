// Get a JSON list from the PizzaHub API (base URL comes from API_URL in .env).
// Returns an empty list when the API is down so pages can show an empty state.
export async function getList<T>(path: string): Promise<T[]> {
  const base = process.env.API_URL;
  if (!base) return [];

  try {
    const res = await fetch(new URL(path, base), { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Get one JSON object from the API (for example /stats).
// Returns null when the API is down or sends an error.
export async function getObject<T>(path: string): Promise<T | null> {
  const base = process.env.API_URL;
  if (!base) return null;

  try {
    const res = await fetch(new URL(path, base), { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
