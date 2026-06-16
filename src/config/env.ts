function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '')
}

const apiUrl = trimTrailingSlash(import.meta.env.VITE_API_URL || 'http://localhost:8080')
const apiToken = (import.meta.env.VITE_STATE_API_TOKEN || '').trim()
const roomId = (import.meta.env.VITE_ROOM_ID || 'default').trim() || 'default'

/** Runtime config from Vite env (baked in at build time). */
export const env = {
  /** Base URL of state-api, without trailing slash. */
  apiUrl,
  /** Bearer token for mutating requests from /control. */
  apiToken,
  /** Room synced with the backend (default: `default`). */
  roomId,
  /** True when a token is set (control can PUT; overlays may still use GET/WS). */
  hasApiToken: apiToken.length > 0,
} as const
