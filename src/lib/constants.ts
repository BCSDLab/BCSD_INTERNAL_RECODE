export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export function shortUrl(code: string): string {
  const base = API_BASE_URL || window.location.origin;
  return `${base.replace(/\/$/, "")}/s/${code}`;
}
