// "Where to go after signing in" comes from ?next=... in the address bar.
// Only paths inside this site are allowed ("/menu/123"), never another website
// ("//evil.com", "https://evil.com"), so the link cannot send people elsewhere.
export function safeNext(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return null;
  return value;
}

// Reads ?next=... from the current address (browser only)
export function nextFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  return safeNext(new URLSearchParams(window.location.search).get("next"));
}
