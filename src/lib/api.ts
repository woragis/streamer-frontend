import { env } from '@/config/env'

export function roomApiBase() {
  return `${env.apiUrl}/api/v1/rooms/${env.roomId}`
}

/** REST path under `/api/v1/rooms/{roomId}/…` */
export function roomApiPath(segment = '') {
  const base = roomApiBase()
  if (!segment) return base
  return `${base}/${segment.replace(/^\//, '')}`
}

/** WebSocket URL for overlay sync (`domain=all` by default). */
export function subscribeWsUrl(domain = 'all') {
  const wsOrigin = env.apiUrl.replace(/^http/i, 'ws')
  const params = new URLSearchParams({ domain })
  if (env.apiToken) {
    params.set('token', env.apiToken)
  }
  return `${wsOrigin}/api/v1/rooms/${env.roomId}/subscribe?${params.toString()}`
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T = unknown>(
  segment: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  if (env.apiToken) {
    headers.set('Authorization', `Bearer ${env.apiToken}`)
  }
  if (init.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(roomApiPath(segment), { ...init, headers })
  if (!res.ok) {
    let message = res.statusText
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // ignore non-json errors
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return (await res.json()) as T
}
