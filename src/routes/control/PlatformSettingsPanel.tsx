import { env } from '@/config/env'
import { usePlatformSettings } from '@/hooks/usePlatformSettings'
import type { StreamRoomId } from '@/lib/room'

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-codes-accent'

type Props = {
  roomId: StreamRoomId | string
  apiSyncEnabled: boolean
}

export function PlatformSettingsPanel({ roomId, apiSyncEnabled }: Props) {
  const kickWebhookUrl = `${env.apiUrl}/api/v1/webhooks/kick`
  const { draft, updatedAt, loading, saving, error, saved, reload, save, patch } = usePlatformSettings(
    roomId,
    apiSyncEnabled && env.hasApiToken,
  )

  if (!apiSyncEnabled) {
    return (
      <Panel title="YouTube & Kick">
        <p className="text-sm text-slate-400">
          Ative <code className="text-codes-accent">VITE_API_SYNC=true</code> no build do frontend para
          configurar plataformas pela interface.
        </p>
      </Panel>
    )
  }

  if (!env.hasApiToken) {
    return (
      <Panel title="YouTube & Kick">
        <p className="text-sm text-slate-400">
          Defina <code className="text-codes-accent">VITE_STATE_API_TOKEN</code> no build (mesmo valor da API)
          para salvar credenciais.
        </p>
      </Panel>
    )
  }

  const youtubeReady =
    draft?.youtubeEnabled && draft.youtubeHasApiKey && draft.youtubeChannelId.trim().length > 0
  const kickReady = draft?.kickEnabled && draft.kickChannelSlug.trim().length > 0

  return (
    <Panel title={`YouTube & Kick — room: ${roomId}`}>
      {loading && !draft ? (
        <p className="text-sm text-slate-400">Carregando…</p>
      ) : draft ? (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <StatusPill ok={youtubeReady} label="YouTube" />
            <StatusPill ok={kickReady} label="Kick" />
            {updatedAt && (
              <span className="text-xs text-slate-500">Atualizado: {new Date(updatedAt).toLocaleString()}</span>
            )}
          </div>

          <h4 className="mb-2 text-xs font-bold tracking-wider text-red-400 uppercase">YouTube</h4>
          <p className="mb-3 text-xs text-slate-500">
            Worker faz poll do live chat quando o canal estiver ao vivo. API Key do Google Cloud (YouTube Data API
            v3).
          </p>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.youtubeEnabled}
              onChange={(e) => patch({ youtubeEnabled: e.target.checked })}
            />
            YouTube ativo
          </label>
          <Field label="Channel ID (UC…)">
            <input
              className={inputClass}
              value={draft.youtubeChannelId}
              onChange={(e) => patch({ youtubeChannelId: e.target.value })}
              placeholder="UCxxxxxxxxxxxxxxxx"
            />
          </Field>
          <Field
            label={
              draft.youtubeHasApiKey
                ? 'Google API Key (deixe vazio para manter a atual)'
                : 'Google API Key'
            }
          >
            <input
              type="password"
              className={inputClass}
              value={draft.youtubeApiKey}
              onChange={(e) => patch({ youtubeApiKey: e.target.value })}
              placeholder={draft.youtubeHasApiKey ? '•••••••• (salva no servidor)' : 'AIza…'}
              autoComplete="off"
            />
          </Field>
          <Field label="Poll interval offline (segundos)">
            <input
              type="number"
              min={10}
              className={inputClass}
              value={draft.youtubeIdleSeconds}
              onChange={(e) => patch({ youtubeIdleSeconds: Number(e.target.value) || 30 })}
            />
          </Field>

          <h4 className="mt-6 mb-2 text-xs font-bold tracking-wider text-emerald-400 uppercase">Kick</h4>
          <p className="mb-3 text-xs text-slate-500">
            Registre o webhook no{' '}
            <a
              href="https://kick.com/settings/developer"
              target="_blank"
              rel="noreferrer"
              className="text-codes-accent hover:underline"
            >
              Kick Developer
            </a>{' '}
            e inscreva eventos de chat/follow/donation.
          </p>
          <Field label="Webhook URL (copiar no Kick)">
            <div className="flex gap-2">
              <input className={inputClass} readOnly value={kickWebhookUrl} />
              <button
                type="button"
                className="shrink-0 rounded-lg bg-slate-700 px-3 text-xs font-semibold"
                onClick={() => void navigator.clipboard.writeText(kickWebhookUrl)}
              >
                Copiar
              </button>
            </div>
          </Field>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.kickEnabled}
              onChange={(e) => patch({ kickEnabled: e.target.checked })}
            />
            Kick ativo
          </label>
          <Field label="Channel slug">
            <input
              className={inputClass}
              value={draft.kickChannelSlug}
              onChange={(e) => patch({ kickChannelSlug: e.target.value })}
              placeholder="woragiscodes"
            />
          </Field>
          <label className="mb-3 flex items-center gap-2 text-sm text-amber-200/80">
            <input
              type="checkbox"
              checked={draft.kickWebhookSkipVerify}
              onChange={(e) => patch({ kickWebhookSkipVerify: e.target.checked })}
            />
            Pular verificação RSA (só dev/local)
          </label>

          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          {saved && <p className="mb-3 text-sm text-emerald-400">Salvo — worker detecta em ~15s.</p>}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              className="rounded-lg bg-codes-accent px-4 py-2 text-sm font-semibold disabled:opacity-50"
              onClick={() => void save()}
            >
              {saving ? 'Salvando…' : 'Salvar plataformas'}
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

function StatusPill({ ok, label }: { ok: boolean | undefined; label: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        ok ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-400'
      }`}
    >
      {label}: {ok ? 'pronto' : 'incompleto'}
    </span>
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
