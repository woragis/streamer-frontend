import { apiFetch } from '@/lib/api'
import type { StreamRoomId } from '@/lib/room'

export type RestreamSettings = {
  roomId: string
  enabled: boolean
  ingestPath: string
  ingestKey?: string
  hasIngestKey: boolean
  hasKickKey: boolean
  hasYouTubeKey: boolean
  kickRtmpUrl: string
  youtubeRtmpUrl: string
  obsServer: string
  obsStreamKey?: string
  lastPublishAt?: string
  updatedAt: string
}

export type RestreamSettingsDraft = {
  enabled: boolean
  kickRtmpUrl: string
  kickStreamKey: string
  youtubeRtmpUrl: string
  youtubeStreamKey: string
}

export function draftFromRestreamSettings(s: RestreamSettings): RestreamSettingsDraft {
  return {
    enabled: s.enabled,
    kickRtmpUrl: s.kickRtmpUrl,
    kickStreamKey: '',
    youtubeRtmpUrl: s.youtubeRtmpUrl || 'rtmp://a.rtmp.youtube.com/live2',
    youtubeStreamKey: '',
  }
}

export async function loadRestreamSettings(roomId: StreamRoomId | string) {
  return apiFetch<RestreamSettings>('restream-settings', {}, roomId)
}

export async function saveRestreamSettings(
  roomId: StreamRoomId | string,
  draft: RestreamSettingsDraft,
) {
  const body: Record<string, unknown> = {
    enabled: draft.enabled,
    kickRtmpUrl: draft.kickRtmpUrl.trim(),
    youtubeRtmpUrl: draft.youtubeRtmpUrl.trim(),
  }
  const kickKey = draft.kickStreamKey.trim()
  if (kickKey) body.kickStreamKey = kickKey
  const ytKey = draft.youtubeStreamKey.trim()
  if (ytKey) body.youtubeStreamKey = ytKey
  return apiFetch<RestreamSettings>(
    'restream-settings',
    { method: 'PUT', body: JSON.stringify(body) },
    roomId,
  )
}

export async function regenerateRestreamIngestKey(roomId: StreamRoomId | string) {
  return apiFetch<RestreamSettings>(
    'restream-settings/regenerate-ingest-key',
    { method: 'POST', body: '{}' },
    roomId,
  )
}
