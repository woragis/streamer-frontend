function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '')
}

const apiUrl = trimTrailingSlash(import.meta.env.VITE_API_URL || 'http://localhost:8080')
const apiToken = (import.meta.env.VITE_STATE_API_TOKEN || '').trim()
const roomId = (import.meta.env.VITE_ROOM_ID || 'codes').trim() || 'codes'
const apiSyncRaw = (import.meta.env.VITE_API_SYNC || '').trim().toLowerCase()

/** Runtime config from Vite env (baked in at build time). */
export const env = {
  apiUrl,
  apiToken,
  roomId,
  hasApiToken: apiToken.length > 0,
  /** When true, frontend loads/pushes state via state-api and listens to WebSocket. */
  apiSyncEnabled: apiSyncRaw === 'true' || apiSyncRaw === '1' || apiSyncRaw === 'yes',
} as const
