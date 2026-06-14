import { useStreamStore } from '@/hooks/useStreamStore'

interface StreamHeaderProps {
  statusLabel?: string
  statusDot?: 'live' | 'soon' | 'brb' | 'none'
  theme?: 'codes' | 'calisthenics'
}

export function StreamHeader({
  statusLabel,
  statusDot = 'live',
  theme = 'codes',
}: StreamHeaderProps) {
  const brandTitle = useStreamStore((s) => s.brandTitle)
  const handle = useStreamStore((s) => s.handle)

  const dotColors = {
    live: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    soon: 'bg-codes-accent shadow-[0_0_8px_#3b82f6]',
    brb: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
    none: 'hidden',
  }

  const accent = theme === 'codes' ? 'text-codes-accent' : 'text-cal-accent'

  return (
    <header className="flex h-[52px] items-center justify-between border-b border-codes-border/80 px-8">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold tracking-[0.2em] text-white">{brandTitle}</span>
        {statusLabel && (
          <>
            <span className={`h-2 w-2 rounded-full ${dotColors[statusDot]}`} />
            <span className={`text-xs font-semibold tracking-wider uppercase ${accent}`}>
              {statusLabel}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 text-xs text-codes-muted">
        <SocialIcon label="YT" />
        <SocialIcon label="K" />
        <span className="font-medium text-codes-text">{handle}</span>
      </div>
    </header>
  )
}

function SocialIcon({ label }: { label: string }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-slate-400">
      {label}
    </span>
  )
}

export function CalisthenicsHeader() {
  const handle = useStreamStore((s) => s.handle)
  const streamTime = useStreamStore((s) => s.streamTimeSeconds)

  const h = Math.floor(streamTime / 3600)
  const m = Math.floor((streamTime % 3600) / 60)
  const sec = streamTime % 60
  const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`

  return (
    <header className="flex h-[60px] items-center justify-between border-b-2 border-cal-accent/30 px-8">
      <div className="flex h-10 w-10 items-center justify-center rounded border border-cal-accent text-lg font-black text-cal-accent">
        W
      </div>
      <div className="flex items-center gap-8 text-xs font-semibold tracking-wider text-cal-muted uppercase">
        <span className="flex items-center gap-2">
          <span className="text-cal-accent">▶</span> {handle.replace('@', 'YouTube /')}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-cal-accent">K</span> {handle.replace('@', 'Kick /')}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-cal-accent">IG</span> {handle.replace('@', 'Instagram /')}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
        <span className="text-sm font-bold tracking-widest text-white uppercase">Live</span>
        <span className="font-mono text-sm text-cal-text">{time}</span>
      </div>
    </header>
  )
}
