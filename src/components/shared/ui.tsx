import type { Difficulty } from '@/stores/types'

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  medium: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  hard: 'bg-red-500/20 text-red-400 border-red-500/40',
}

interface DifficultyBadgeProps {
  difficulty: Difficulty
  size?: 'sm' | 'md'
}

export function DifficultyBadge({ difficulty, size = 'sm' }: DifficultyBadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
  return (
    <span
      className={`inline-flex rounded border font-bold uppercase tracking-wider ${sizeClass} ${difficultyStyles[difficulty]}`}
    >
      {difficulty}
    </span>
  )
}

export function ProgressBar({
  current,
  target,
  accent = 'codes',
}: {
  current: number
  target: number
  accent?: 'codes' | 'calisthenics'
}) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0
  const fill = accent === 'codes' ? 'bg-codes-accent' : 'bg-cal-accent'

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
      <div className={`h-full rounded-full transition-all duration-500 ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Panel({
  children,
  className = '',
  theme = 'codes',
}: {
  children: React.ReactNode
  className?: string
  theme?: 'codes' | 'calisthenics'
}) {
  const border = theme === 'codes' ? 'border-codes-border' : 'border-cal-border'
  const bg = theme === 'codes' ? 'bg-codes-panel/80' : 'bg-cal-panel/90'

  return (
    <div className={`rounded-lg border ${border} ${bg} backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}

export function WidgetTitle({
  icon,
  children,
  theme = 'codes',
}: {
  icon?: React.ReactNode
  children: React.ReactNode
  theme?: 'codes' | 'calisthenics'
}) {
  const accent = theme === 'codes' ? 'text-codes-accent' : 'text-cal-accent'
  return (
    <div className={`mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase ${accent}`}>
      {icon}
      <span>{children}</span>
    </div>
  )
}
