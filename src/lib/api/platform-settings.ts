import { apiFetch } from '@/lib/api'
import type { StreamRoomId } from '@/lib/room'

export type PlatformSettings = {
  roomId: string
  youtube: {
    enabled: boolean
    channelId: string
    hasApiKey: boolean
    idleSeconds: number
  }
  kick: {
    enabled: boolean
    channelSlug: string
    webhookSkipVerify: boolean
  }
  updatedAt: string
}

export type PlatformSettingsDraft = {
  youtubeEnabled: boolean
  youtubeChannelId: string
  youtubeApiKey: string
  youtubeHasApiKey: boolean
  youtubeIdleSeconds: number
  kickEnabled: boolean
  kickChannelSlug: string
  kickWebhookSkipVerify: boolean
}

export function draftFromSettings(s: PlatformSettings): PlatformSettingsDraft {
  return {
    youtubeEnabled: s.youtube.enabled,
    youtubeChannelId: s.youtube.channelId ?? '',
    youtubeApiKey: '',
    youtubeHasApiKey: s.youtube.hasApiKey,
    youtubeIdleSeconds: s.youtube.idleSeconds || 30,
    kickEnabled: s.kick.enabled,
    kickChannelSlug: s.kick.channelSlug ?? '',
    kickWebhookSkipVerify: s.kick.webhookSkipVerify,
  }
}

export async function loadPlatformSettings(roomId: StreamRoomId | string): Promise<PlatformSettings> {
  return apiFetch<PlatformSettings>('platform-settings', {}, roomId)
}

export async function savePlatformSettings(
  roomId: StreamRoomId | string,
  draft: PlatformSettingsDraft,
): Promise<PlatformSettings> {
  const youtube: Record<string, unknown> = {
    enabled: draft.youtubeEnabled,
    channelId: draft.youtubeChannelId.trim(),
    idleSeconds: draft.youtubeIdleSeconds,
  }
  const apiKey = draft.youtubeApiKey.trim()
  if (apiKey) {
    youtube.apiKey = apiKey
  }

  const kick: Record<string, unknown> = {
    enabled: draft.kickEnabled,
    channelSlug: draft.kickChannelSlug.trim(),
    webhookSkipVerify: draft.kickWebhookSkipVerify,
  }

  return apiFetch<PlatformSettings>(
    'platform-settings',
    {
      method: 'PUT',
      body: JSON.stringify({ youtube, kick }),
    },
    roomId,
  )
}
