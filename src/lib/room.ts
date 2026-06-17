import { env } from '@/config/env'

export type StreamRoomId = 'codes' | 'calisthenics' | 'default'

export function resolveRoomId(pathname: string, searchRoom?: string | null): StreamRoomId {
  if (searchRoom === 'codes' || searchRoom === 'calisthenics' || searchRoom === 'default') {
    return searchRoom
  }
  if (pathname.startsWith('/calisthenics')) return 'calisthenics'
  if (pathname.startsWith('/codes')) return 'codes'
  const fallback = env.roomId as StreamRoomId
  if (fallback === 'codes' || fallback === 'calisthenics' || fallback === 'default') {
    return fallback
  }
  return 'codes'
}

export const STREAM_ROOMS: { id: StreamRoomId; label: string }[] = [
  { id: 'codes', label: 'WoragisCodes' },
  { id: 'calisthenics', label: 'WoragisCalisthenics' },
]
