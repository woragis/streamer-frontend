import { useStreamStore } from '@/hooks/useStreamStore'
import { DifficultyBadge, Panel } from '@/components/shared/ui'

export function LeetCodePanel() {
  const problem = useStreamStore((s) => s.currentProblem)

  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-codes-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-amber-500">LeetCode</span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-codes-muted">
            Problem List
          </span>
        </div>
        <span className="text-codes-muted">‹ ›</span>
      </div>
      <div className="overlay-scroll flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h2 className="text-base font-bold text-white">
            {problem.id}. {problem.title}
          </h2>
          <DifficultyBadge difficulty={problem.difficulty} />
        </div>
        <div className="mb-4 flex gap-3 text-xs text-codes-muted">
          <span>👍 2.1K</span>
          <span>💬 489</span>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-codes-text">{problem.description}</p>
        <div className="rounded-lg border border-codes-border bg-slate-900/50 p-4">
          <p className="mb-2 text-xs font-semibold text-codes-muted">Example 1:</p>
          <TreeDiagram />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-codes-border px-4 py-2 text-[10px] text-codes-muted">
        <span>9.6K Online</span>
        <span>💬 489 Comments</span>
      </div>
    </Panel>
  )
}

function TreeDiagram() {
  return (
    <div className="flex flex-col items-center py-2 font-mono text-sm text-codes-text">
      <span className="rounded border border-codes-border px-3 py-1">1</span>
      <div className="flex gap-16 pt-2">
        <div className="flex flex-col items-center">
          <span className="rounded border border-codes-border px-3 py-1">2</span>
          <div className="mt-2 flex gap-6">
            <span className="rounded border border-codes-border px-2 py-0.5 text-xs">3</span>
            <span className="rounded border border-codes-border px-2 py-0.5 text-xs">4</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="rounded border border-codes-border px-3 py-1">5</span>
          <div className="mt-2">
            <span className="rounded border border-codes-border px-2 py-0.5 text-xs">6</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CodeEditorPanel() {
  const code = useStreamStore((s) => s.codeContent)
  const fileName = useStreamStore((s) => s.codeFileName)
  const lines = code.split('\n')

  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-codes-border px-4 py-2">
        <span className="rounded-t bg-slate-800 px-3 py-1 text-xs text-white">{fileName}</span>
        <span className="text-[10px] text-codes-muted">› maxPathSum</span>
      </div>
      <div className="overlay-scroll flex-1 overflow-auto bg-[#0d1117] p-4 font-mono text-[13px] leading-6">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-4 w-6 shrink-0 text-right text-slate-600 select-none">
              {i + 1}
            </span>
            <span className="text-codes-text">
              <HighlightedLine line={line} />
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 border-t border-codes-border bg-codes-accent/20 px-4 py-1 text-[10px] text-codes-text">
        <span>Ln 18, Col 1</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>Python 3.11.6</span>
      </div>
    </Panel>
  )
}

function HighlightedLine({ line }: { line: string }) {
  if (line.startsWith('class ') || line.startsWith('def '))
    return <span className="text-purple-400">{line}</span>
  if (line.includes('self.') || line.includes('return'))
    return <span className="text-blue-400">{line}</span>
  if (line.includes("'") || line.includes('"'))
    return <span className="text-emerald-400">{line}</span>
  if (line.trim().startsWith('#'))
    return <span className="text-slate-500">{line}</span>
  return <span>{line || ' '}</span>
}

export function WhiteboardPanel() {
  const title = useStreamStore((s) => s.whiteboardTitle)
  const bullets = useStreamStore((s) => s.whiteboardBullets)

  return (
    <Panel className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-codes-border px-4 py-3">
        <span className="text-codes-accent">✏️</span>
        <span className="text-sm font-bold tracking-wider text-white uppercase">Whiteboard</span>
      </div>
      <div className="overlay-scroll flex-1 overflow-y-auto p-6">
        <h2 className="mb-4 text-xl font-bold text-white">{title}</h2>
        <ul className="mb-6 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-codes-text">
              <span className="text-codes-accent">•</span> {b}
            </li>
          ))}
        </ul>
        <WhiteboardDiagram />
      </div>
    </Panel>
  )
}

function WhiteboardDiagram() {
  return (
    <div className="relative rounded-xl border border-dashed border-codes-border bg-slate-900/30 p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <span className="rounded-lg border-2 border-purple-400/60 bg-purple-500/10 px-4 py-2 font-mono text-lg font-bold text-white">
            -10
          </span>
          <div className="mt-4 flex justify-center gap-20">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-emerald-400">left gain = 4</span>
              <span className="mt-1 rounded-lg border border-emerald-400/50 px-3 py-1 font-mono text-white">
                2
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-sky-400">right gain = 5</span>
              <span className="mt-1 rounded-lg border border-sky-400/50 px-3 py-1 font-mono text-white">
                9
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-purple-400/40 bg-purple-500/10 px-4 py-2 font-mono text-sm text-purple-200">
          max = left_gain + right_gain + node.val
        </div>
        <p className="mt-4 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 font-mono text-emerald-300">
          Global Max = 11
        </p>
      </div>
    </div>
  )
}

export function CurrentApproachBar() {
  const approach = useStreamStore((s) => s.currentApproach)
  return (
    <Panel className="flex items-center gap-2 px-4 py-3">
      <span className="text-codes-accent">&lt;/&gt;</span>
      <div>
        <p className="text-[10px] font-bold tracking-wider text-codes-muted uppercase">
          Current Approach
        </p>
        <p className="text-sm font-semibold text-white">{approach}</p>
      </div>
    </Panel>
  )
}
