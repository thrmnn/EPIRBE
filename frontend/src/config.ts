// Backend URL for the VPS. Leave empty for same-origin (Docker dev).
// Set VITE_BACKEND_URL in Vercel env vars, e.g. "https://radio.yourdomain.com"
const backend = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") ?? "";

function wsOrigin(): string {
  if (backend) {
    const url = new URL(backend);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}`;
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}`;
}

export const config = {
  apiBase: `${backend}/api`,
  streamUrl: `${backend}/stream`,
  wsBase: wsOrigin(),
  wsUrl: (path: string) => `${wsOrigin()}${path}`,
};
