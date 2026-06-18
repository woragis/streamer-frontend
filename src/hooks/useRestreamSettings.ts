import { useCallback, useEffect, useState } from 'react'
import { env } from '@/config/env'
import { ApiError } from '@/lib/api'
import {
  draftFromRestreamSettings,
  loadRestreamSettings,
  regenerateRestreamIngestKey,
  saveRestreamSettings,
  type RestreamSettingsDraft,
} from '@/lib/api/restream-settings'
import type { StreamRoomId } from '@/lib/room'

export function useRestreamSettings(roomId: StreamRoomId | string, enabled: boolean) {
  const [draft, setDraft] = useState<RestreamSettingsDraft | null>(null)
  const [ingestKey, setIngestKey] = useState<string | null>(null)
  const [obsServer, setObsServer] = useState('')
  const [ingestPath, setIngestPath] = useState('')
  const [lastPublishAt, setLastPublishAt] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const applySettings = useCallback((settings: Awaited<ReturnType<typeof loadRestreamSettings>>) => {
    setDraft(draftFromRestreamSettings(settings))
    setObsServer(settings.obsServer)
    setIngestPath(settings.ingestPath)
    setLastPublishAt(settings.lastPublishAt ?? null)
    setUpdatedAt(settings.updatedAt)
    if (settings.ingestKey) setIngestKey(settings.ingestKey)
    else if (settings.obsStreamKey) setIngestKey(settings.obsStreamKey)
  }, [])

  const reload = useCallback(async () => {
    if (!enabled || !env.hasApiToken) return
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const settings = await loadRestreamSettings(roomId)
      applySettings(settings)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao carregar restream')
      setDraft(null)
    } finally {
      setLoading(false)
    }
  }, [roomId, enabled, applySettings])

  useEffect(() => {
    void reload()
  }, [reload])

  const save = useCallback(async () => {
    if (!draft || !env.hasApiToken) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const settings = await saveRestreamSettings(roomId, draft)
      applySettings(settings)
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao salvar')
    } finally {
      setSaving(false)
    }
  }, [draft, roomId, applySettings])

  const regenerateKey = useCallback(async () => {
    if (!env.hasApiToken) return
    setSaving(true)
    setError(null)
    try {
      const settings = await regenerateRestreamIngestKey(roomId)
      applySettings(settings)
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Falha ao regenerar chave')
    } finally {
      setSaving(false)
    }
  }, [roomId, applySettings])

  const patch = useCallback((partial: Partial<RestreamSettingsDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...partial } : prev))
    setSaved(false)
  }, [])

  return {
    draft,
    ingestKey,
    obsServer,
    ingestPath,
    lastPublishAt,
    updatedAt,
    loading,
    saving,
    error,
    saved,
    reload,
    save,
    regenerateKey,
    patch,
  }
}
