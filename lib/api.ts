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
