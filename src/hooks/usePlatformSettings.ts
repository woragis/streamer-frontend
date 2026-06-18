import { useCallback, useEffect, useState } from 'react'
import { env } from '@/config/env'
import { ApiError } from '@/lib/api'
import {
  draftFromSettings,
  loadPlatformSettings,
  savePlatformSettings,
  type PlatformSettingsDraft,
} from '@/lib/api/platform-settings'
import type { StreamRoomId } from '@/lib/room'

export function usePlatformSettings(roomId: StreamRoomId | string, enabled: boolean) {
  const [draft, setDraft] = useState<PlatformSettingsDraft | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const reload = useCallback(async () => {
    if (!enabled || !env.hasApiToken) return
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const settings = await loadPlatformSettings(roomId)
      setDraft(draftFromSettings(settings))
      setUpdatedAt(settings.updatedAt)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao carregar plataformas')
      setDraft(null)
    } finally {
      setLoading(false)
    }
  }, [roomId, enabled])

  useEffect(() => {
    void reload()
  }, [reload])

  const save = useCallback(async () => {
    if (!draft || !env.hasApiToken) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const settings = await savePlatformSettings(roomId, draft)
      setDraft(draftFromSettings(settings))
      setUpdatedAt(settings.updatedAt)
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao salvar')
    } finally {
      setSaving(false)
    }
  }, [draft, roomId])

  const patch = useCallback((partial: Partial<PlatformSettingsDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...partial } : prev))
    setSaved(false)
  }, [])

  return { draft, updatedAt, loading, saving, error, saved, reload, save, patch }
}
