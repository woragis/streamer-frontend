import { env } from '@/config/env'
import { useRestreamSettings } from '@/hooks/useRestreamSettings'
import type { StreamRoomId } from '@/lib/room'

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-codes-accent'

type Props = {
  roomId: StreamRoomId | string
  apiSyncEnabled: boolean
}

export function RestreamSettingsPanel({ roomId, apiSyncEnabled }: Props) {
  const {
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
  } = useRestreamSettings(roomId, apiSyncEnabled && env.hasApiToken)

  if (!apiSyncEnabled) {
    return (
      <Panel title="Restream RTMP">
        <p className="text-sm text-slate-400">
          Ative <code className="text-codes-accent">VITE_API_SYNC=true</code> para configurar multistream.
        </p>
      </Panel>
    )
  }

  if (!env.hasApiToken) {
    return (
      <Panel title="Restream RTMP">
        <p className="text-sm text-slate-400">
          Defina <code className="text-codes-accent">VITE_STATE_API_TOKEN</code> para salvar destinos RTMP.
        </p>
      </Panel>
    )
  }

  const obsUrl =
    obsServer && ingestPath ? `${obsServer.replace(/\/$/, '')}/${ingestPath}` : '—'

  return (
    <Panel title={`Restream RTMP — room: ${roomId}`}>
      <p className="mb-4 text-xs text-slate-500">
        OBS envia 1 stream para o servidor Woragis; FFmpeg repete para Kick + YouTube. Hospede o serviço{' '}
        <code className="text-codes-accent">restream</code> em VPS (porta 1935) — não no Railway.
      </p>

      {loading && !draft ? (
        <p className="text-sm text-slate-400">Carregando…</p>
      ) : draft ? (
        <>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.enabled}
              onChange={(e) => patch({ enabled: e.target.checked })}
            />
            Restream ativo
          </label>

          <Field label="OBS — Servidor RTMP">
            <input className={inputClass} readOnly value={obsUrl} />
            <p className="mt-1 text-[10px] text-slate-500">
              Custom service no OBS. Path: <code>{ingestPath}</code>
            </p>
          </Field>

          <Field label="OBS — Stream Key (ingest)">
            <div className="flex gap-2">
              <input
                className={inputClass}
                readOnly
                value={ingestKey ?? '(oculta — clique Regenerar para ver nova chave)'}
              />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-slate-700 px-3 text-xs font-semibold"
                onClick={() => void regenerateKey()}
                disabled={saving}
              >
                Regenerar
              </button>
            </div>
          </Field>

          <Field label="Kick RTMP URL (servidor)">
            <input
              className={inputClass}
              value={draft.kickRtmpUrl}
              onChange={(e) => patch({ kickRtmpUrl: e.target.value })}
              placeholder="rtmps://fa723fc1b171.global-contribute.live-video.net/app"
            />
          </Field>
          <Field label="Kick stream key">
            <input
              type="password"
              className={inputClass}
              value={draft.kickStreamKey}
              onChange={(e) => patch({ kickStreamKey: e.target.value })}
              placeholder="sk_us-west-2_… (deixe vazio para manter)"
              autoComplete="off"
            />
          </Field>

          <Field label="YouTube RTMP URL">
            <input
              className={inputClass}
              value={draft.youtubeRtmpUrl}
              onChange={(e) => patch({ youtubeRtmpUrl: e.target.value })}
            />
          </Field>
          <Field label="YouTube stream key">
            <input
              type="password"
              className={inputClass}
              value={draft.youtubeStreamKey}
              onChange={(e) => patch({ youtubeStreamKey: e.target.value })}
              placeholder="xxxx-xxxx-xxxx (deixe vazio para manter)"
              autoComplete="off"
            />
          </Field>

          {lastPublishAt && (
            <p className="mb-3 text-xs text-emerald-400/80">
              Último publish: {new Date(lastPublishAt).toLocaleString()}
            </p>
          )}
          {updatedAt && (
            <p className="mb-3 text-xs text-slate-500">Config: {new Date(updatedAt).toLocaleString()}</p>
          )}

          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          {saved && <p className="mb-3 text-sm text-emerald-400">Salvo.</p>}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              className="rounded-lg bg-codes-accent px-4 py-2 text-sm font-semibold disabled:opacity-50"
              onClick={() => void save()}
            >
              {saving ? 'Salvando…' : 'Salvar restream'}
            </button>
            <button
              type="button"
              disabled={loading}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300"
              onClick={() => void reload()}
            >
              Recarregar
            </button>
          </div>
        </>
      ) : (
        <p className="text-sm text-red-400">{error ?? 'Não foi possível carregar.'}</p>
      )}
    </Panel>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">{title}</h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      {children}
    </label>
  )
}
