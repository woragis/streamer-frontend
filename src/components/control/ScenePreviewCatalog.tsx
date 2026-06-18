import { useEffect, useRef, useState, type ComponentType } from 'react'
import { Link } from '@tanstack/react-router'
import { CANVAS_ASPECT, CANVAS_HEIGHT, CANVAS_WIDTH } from '@/constants/canvas'
import type { Scene } from '@/stores/types'
import { dispatch } from '@/stores/app-store'
import { setScene } from '@/stores/actions'

export type SceneCatalogEntry = {
  id: string
  label: string
  path: string
  scene: Scene
  group: 'codes' | 'calisthenics'
  Page: ComponentType
}

type Props = {
  entries: SceneCatalogEntry[]
  activeScene: Scene
  roomFilter?: 'codes' | 'calisthenics' | 'all'
}

export function ScenePreviewCatalog({ entries, activeScene, roomFilter = 'all' }: Props) {
  const [expanded, setExpanded] = useState<SceneCatalogEntry | null>(null)
  const filtered =
    roomFilter === 'all' ? entries : entries.filter((e) => e.group === roomFilter)

  const groups: { key: 'codes' | 'calisthenics'; title: string }[] = [
    { key: 'codes', title: 'Woragis Codes' },
    { key: 'calisthenics', title: 'Woragis Calisthenics' },
  ]

  return (
    <>
      {groups.map(({ key, title }) => {
        const items = filtered.filter((e) => e.group === key)
        if (items.length === 0) return null
        return (
          <div key={key} className="mb-8">
            <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-500 uppercase">
              {title}
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {items.map((entry) => (
                <ScenePreviewCard
                  key={entry.id}
                  entry={entry}
                  isActive={activeScene === entry.scene}
                  onExpand={() => setExpanded(entry)}
                />
              ))}
            </div>
          </div>
        )
      })}

      {expanded && (
        <ScenePreviewModal entry={expanded} onClose={() => setExpanded(null)} />
      )}
    </>
  )
}

function ScenePreviewCard({
  entry,
  isActive,
  onExpand,
}: {
  entry: SceneCatalogEntry
  isActive: boolean
  onExpand: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.15)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (w > 0) setScale(w / CANVAS_WIDTH)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      className={`group rounded-xl border bg-slate-900/40 p-2 transition-colors ${
        isActive ? 'border-codes-accent ring-1 ring-codes-accent/40' : 'border-slate-800 hover:border-slate-600'
      }`}
    >
      <button
        type="button"
        onClick={onExpand}
        className="block w-full text-left"
        aria-label={`Expand preview: ${entry.label}`}
      >
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-lg bg-black"
          style={{ aspectRatio: `${CANVAS_ASPECT}` }}
        >
          <div
            className="pointer-events-none absolute top-0 left-0 origin-top-left"
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `scale(${scale})`,
            }}
          >
            <entry.Page />
          </div>
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100"
          >
            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white">
              Expandir
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 px-0.5">
          <span className="truncate text-sm font-medium text-slate-200">{entry.label}</span>
          {isActive && (
            <span className="shrink-0 rounded bg-codes-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-codes-accent">
              ATIVA
            </span>
          )}
        </div>
      </button>

      <div className="mt-1.5 flex flex-wrap gap-1.5 px-0.5">
        <button
          type="button"
          onClick={() => dispatch((s) => setScene(s, entry.scene))}
          className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 hover:bg-codes-accent hover:text-white"
        >
          Set scene
        </button>
        <Link
          to={entry.path}
          className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-codes-accent hover:underline"
        >
          Abrir
        </Link>
        <a
          href={`${entry.path}?obs=1`}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-400"
        >
          OBS
        </a>
      </div>
    </div>
  )
}

function ScenePreviewModal({
  entry,
  onClose,
}: {
  entry: SceneCatalogEntry
  onClose: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      if (w > 0) setScale(Math.min(w / CANVAS_WIDTH, 1))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scaledHeight = CANVAS_HEIGHT * scale

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={entry.label}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-white">{entry.label}</h2>
            <p className="text-xs text-slate-500">{entry.path}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch((s) => setScene(s, entry.scene))}
              className="rounded-lg bg-codes-accent px-3 py-1.5 text-xs font-semibold"
            >
              Set scene
            </button>
            <a
              href={`${entry.path}?obs=1`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-emerald-600/50 px-3 py-1.5 text-xs font-semibold text-emerald-400"
            >
              OBS URL
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="overflow-auto p-5">
          <div
            ref={containerRef}
            className="mx-auto overflow-hidden rounded-lg border border-slate-700 bg-black"
            style={{ width: '100%', maxWidth: CANVAS_WIDTH, aspectRatio: `${CANVAS_ASPECT}` }}
          >
            <div
              style={{
                width: CANVAS_WIDTH,
                height: scaledHeight,
                overflow: 'hidden',
              }}
            >
              <div
                className="origin-top-left"
                style={{
                  width: CANVAS_WIDTH,
                  height: CANVAS_HEIGHT,
                  transform: `scale(${scale})`,
                }}
              >
                <entry.Page />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
