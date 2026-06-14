import { useCodesCode, useCurrentProblem, useWhiteboard } from '@/hooks/useOverlayData'
import { DifficultyTag } from '@/components/codes/CodesLayout'
import {
  IconThumbsUp,
  IconComment,
  IconStar,
  IconShare,
  IconPython,
} from '@/components/codes/Icons'

export function LeetCodeMock() {
  const problem = useCurrentProblem()
  if (!problem) return null

  return (
    <div className="codes-glow-border flex h-full flex-col overflow-hidden rounded-xl bg-codes-panel">
      {/* LeetCode toolbar */}
      <div className="flex items-center justify-between border-b border-codes-border px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-black tracking-tight text-codes-leetcode">LeetCode</span>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-md bg-[#1a2030] px-2.5 py-1 text-[10px] text-codes-muted"
          >
            ☰ Problem List
          </button>
        </div>
        <div className="flex items-center gap-2 text-codes-muted">
          <button type="button" className="px-1.5 text-lg leading-none">
            ‹
          </button>
          <button type="button" className="px-1.5 text-lg leading-none">
            ›
          </button>
        </div>
      </div>

      <div className="overlay-scroll flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h2 className="text-[15px] font-bold leading-snug text-white">
            {problem.id}. {problem.title}
          </h2>
          <DifficultyTag difficulty={problem.difficulty} />
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-codes-muted">
          <span className="flex items-center gap-1">
            <IconThumbsUp /> 2.1K
          </span>
          <span className="flex items-center gap-1">
            <IconComment /> 489
          </span>
          <span className="flex items-center gap-1">
            <IconStar /> Save
          </span>
          <span className="flex items-center gap-1">
            <IconShare /> Share
          </span>
        </div>

        <div className="mb-3 flex gap-2">
          <span className="rounded border border-codes-border px-2 py-0.5 text-[10px] text-codes-muted">
            🔒 Companies
          </span>
          <span className="rounded border border-codes-border px-2 py-0.5 text-[10px] text-codes-muted">
            💡 Hint
          </span>
        </div>

        <div className="space-y-3 text-[13px] leading-relaxed text-codes-text">
          <p>{problem.description}</p>
          <p>
            The <strong className="text-white">path sum</strong> of a path is the sum of the
            node&apos;s values in the path.
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-codes-border bg-[#0a0e14] p-4">
          <p className="mb-3 text-[12px] font-semibold text-white">Example 1:</p>
          <BinaryTreeSvg />
          <p className="mt-3 font-mono text-[12px] text-codes-muted">
            Input: root = [1,2,3,4,5,6]
            <br />
            Output: 11
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-codes-border px-4 py-2 text-[10px] text-codes-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 9.6K Online
        </span>
        <span className="flex gap-3">
          <IconComment className="h-3 w-3" />
          <IconStar className="h-3 w-3" />
          <IconShare className="h-3 w-3" />
        </span>
      </div>
    </div>
  )
}

function BinaryTreeSvg() {
  return (
    <svg viewBox="0 0 220 130" className="mx-auto w-[200px]" fill="none">
      <line x1="110" y1="28" x2="60" y2="58" stroke="#334155" strokeWidth="1.5" />
      <line x1="110" y1="28" x2="160" y2="58" stroke="#334155" strokeWidth="1.5" />
      <line x1="60" y1="78" x2="35" y2="108" stroke="#334155" strokeWidth="1.5" />
      <line x1="60" y1="78" x2="85" y2="108" stroke="#334155" strokeWidth="1.5" />
      <line x1="160" y1="78" x2="160" y2="108" stroke="#334155" strokeWidth="1.5" />
      {[
        [110, 20, '1'],
        [60, 58, '2'],
        [160, 58, '5'],
        [35, 108, '3'],
        [85, 108, '4'],
        [160, 108, '6'],
      ].map(([x, y, label]) => (
        <g key={label as string}>
          <circle cx={x as number} cy={y as number} r="16" fill="#111820" stroke="#475569" />
          <text
            x={x as number}
            y={(y as number) + 4}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="12"
            fontFamily="JetBrains Mono"
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function CodeEditorMock() {
  const { content: code, fileName } = useCodesCode()
  const lines = code.split('\n')

  return (
    <div className="codes-glow-border flex h-full flex-col overflow-hidden rounded-xl bg-codes-editor">
      {/* Tab bar */}
      <div className="flex items-end border-b border-[#21262d] bg-[#010409] px-2 pt-2">
        <div className="flex items-center gap-2 rounded-t-md border border-b-0 border-[#30363d] bg-codes-editor px-3 py-1.5">
          <IconPython className="h-3.5 w-3.5 text-[#3572A5]" />
          <span className="text-[12px] text-codes-text">{fileName}</span>
          <span className="text-[10px] text-codes-muted">×</span>
        </div>
      </div>
      <div className="border-b border-[#21262d] px-4 py-1 text-[10px] text-codes-muted">
        {fileName} › <span className="text-codes-text">maxPathSum</span>
      </div>

      <div className="overlay-scroll flex-1 overflow-auto py-2 font-mono text-[13px] leading-[22px]">
        {lines.map((line, i) => (
          <div key={i} className="flex px-2 hover:bg-[#ffffff06]">
            <span className="w-10 shrink-0 pr-3 text-right text-[#484f58] select-none">
              {i + 1}
            </span>
            <span className="flex-1 whitespace-pre">
              <SyntaxLine line={line} />
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 border-t border-codes-accent/30 bg-[#1f6feb22] px-4 py-1 text-[10px] text-codes-text">
        <span>Ln {lines.length}, Col 1</span>
        <span>Spaces: 4</span>
        <span>UTF-8</span>
        <span>LF</span>
        <span className="flex items-center gap-1">
          <IconPython className="h-3 w-3 text-[#3572A5]" /> Python 3.11.6 64-bit
        </span>
      </div>
    </div>
  )
}

function SyntaxLine({ line }: { line: string }) {
  const trimmed = line.trim()
  if (!trimmed) return <span>{' '}</span>
  if (trimmed.startsWith('class ') || trimmed.startsWith('def '))
    return <span className="text-[#d2a8ff]">{line}</span>
  if (trimmed.startsWith('return') || trimmed.startsWith('self.'))
    return <span className="text-[#79c0ff]">{line}</span>
  if (line.includes("'") || line.includes('"'))
    return <span className="text-[#a5d6ff]">{line}</span>
  if (trimmed.startsWith('#'))
    return <span className="text-[#8b949e]">{line}</span>
  if (/\d/.test(line) && !line.includes('def'))
    return (
      <span>
        {line.split(/(\d+)/).map((part, i) =>
          /^\d+$/.test(part) ? (
            <span key={i} className="text-[#ffa657]">
              {part}
            </span>
          ) : (
            <span key={i} className="text-[#e6edf3]">
              {part}
            </span>
          ),
        )}
      </span>
    )
  return <span className="text-[#e6edf3]">{line}</span>
}

export function WhiteboardMock() {
  const { title, bullets } = useWhiteboard()

  return (
    <div className="codes-glow-border flex h-full flex-col overflow-hidden rounded-xl">
      <div className="flex items-center gap-2 border-b border-codes-border bg-codes-panel px-4 py-3">
        <span className="text-codes-accent">✏️</span>
        <span className="text-[12px] font-bold tracking-[0.14em] text-white uppercase">
          Whiteboard
        </span>
      </div>
      <div className="whiteboard-grid overlay-scroll flex-1 overflow-y-auto p-6">
        <h2 className="handwritten mb-4 text-[28px] text-white">{title}</h2>
        <ul className="mb-6 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="handwritten flex items-start gap-2 text-[18px] text-codes-text">
              <span className="text-codes-accent">→</span> {b}
            </li>
          ))}
        </ul>
        <WhiteboardDiagramSvg />
      </div>
    </div>
  )
}

function WhiteboardDiagramSvg() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-[500px]" fill="none">
      {/* tree lines - hand drawn style */}
      <path d="M260 40 L160 100" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <path d="M260 40 L360 100" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <path d="M160 120 L110 180" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <path d="M160 120 L210 180" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
      <path d="M360 120 L360 180" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

      {/* annotations */}
      <text x="90" y="95" fill="#34d399" fontSize="13" fontFamily="Caveat" fontWeight="600">
        left gain = 4
      </text>
      <text x="340" y="95" fill="#38bdf8" fontSize="13" fontFamily="Caveat" fontWeight="600">
        right gain = 5
      </text>
      <path d="M130 88 Q150 75 165 85" stroke="#34d399" strokeWidth="1.5" fill="none" />
      <path d="M350 88 Q370 75 355 85" stroke="#38bdf8" strokeWidth="1.5" fill="none" />

      {/* nodes */}
      {[
        [260, 30, '-10', '#a855f7'],
        [160, 110, '2', '#475569'],
        [360, 110, '9', '#475569'],
        [110, 200, '3', '#475569'],
        [210, 200, '4', '#475569'],
        [360, 200, '6', '#475569'],
      ].map(([x, y, label, color]) => (
        <g key={label as string}>
          <circle cx={x as number} cy={y as number} r="22" fill="#0f1419" stroke={color as string} strokeWidth="2" />
          <text
            x={x as number}
            y={(y as number) + 5}
            textAnchor="middle"
            fill="#fff"
            fontSize="14"
            fontFamily="Caveat"
            fontWeight="600"
          >
            {label}
          </text>
        </g>
      ))}

      {/* formula boxes */}
      <rect x="120" y="230" width="280" height="32" rx="6" fill="#a855f722" stroke="#a855f7" strokeWidth="1.5" />
      <text x="260" y="251" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontFamily="JetBrains Mono">
        left_gain + right_gain + node.val
      </text>

      <rect x="140" y="248" width="240" height="28" rx="6" fill="#22c55e22" stroke="#22c55e" strokeWidth="1.5" />
      <text x="260" y="267" textAnchor="middle" fill="#bbf7d0" fontSize="12" fontFamily="JetBrains Mono">
        node.val + max(left, right, 0)
      </text>

      <rect x="180" y="8" width="160" height="26" rx="6" fill="#3b82f622" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="260" y="26" textAnchor="middle" fill="#93c5fd" fontSize="14" fontFamily="Caveat" fontWeight="600">
        Global Max = 11
      </text>
    </svg>
  )
}

export function NotesWidgetPanel() {
  const { notes } = useWhiteboard()
  return (
    <div className="codes-widget p-3.5">
      <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-codes-accent uppercase">
        Notes
      </p>
      <ul className="space-y-1">
        {notes.map((n) => (
          <li key={n} className="flex items-start gap-2 text-[12px] text-codes-text">
            <span className="text-codes-accent">•</span> {n}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ApproachWidget() {
  const { approach } = useWhiteboard()
  return (
    <div className="codes-widget-accent p-3.5">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-codes-accent">&lt;/&gt;</span>
        <span className="text-[10px] font-bold tracking-[0.14em] text-codes-muted uppercase">
          Current Approach
        </span>
      </div>
      <p className="text-[13px] font-semibold text-emerald-400">{approach}</p>
    </div>
  )
}

import { dispatch } from '@/stores/app-store'
import { pauseTimer, resetTimer, startTimer } from '@/stores/actions'
import { useFocusTimer } from '@/hooks/useOverlayData'

export function TimerWidget() {
  const focus = useFocusTimer()

  return (
    <div className="codes-widget p-3.5">
      <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-codes-accent uppercase">
        Timer
      </p>
      <p className="mb-3 text-center font-mono text-[28px] font-bold text-white">
        {focus.formatted}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-md bg-codes-accent py-1.5 text-[11px] font-bold text-white"
          onClick={() =>
            dispatch((s) =>
              focus.running ? pauseTimer(s, 'focus') : startTimer(s, 'focus'),
            )
          }
        >
          {focus.running ? 'PAUSE' : 'START'}
        </button>
        <button
          type="button"
          className="flex-1 rounded-md border border-codes-border py-1.5 text-[11px] text-codes-muted"
          onClick={() => dispatch((s) => resetTimer(s, 'focus'))}
        >
          RESET
        </button>
      </div>
    </div>
  )
}
