export const STORAGE_VERSION = 3

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Scene = 'offline' | 'starting-soon' | 'live' | 'brb' | 'whiteboard' | 'workout'

export type TimerId = 'stream' | 'startingSoon' | 'brb' | 'rest' | 'focus'

export type TimerMode = 'stopwatch' | 'countdown'

export type ProblemStatus = 'queued' | 'active' | 'solved' | 'skipped'

export type ExerciseStatus = 'pending' | 'active' | 'done'

export interface BrandingState {
  /** @deprecated use codesHandle — kept for migration */
  handle?: string
  codesHandle: string
  calisthenicsHandle: string
  brandTitle: string
  motto: string
  calisthenicsMotto: string
  schedule: string
  social: {
    discord: string
    twitter: string
    youtube: string
    kick: string
  }
}

export interface SessionState {
  scene: Scene
  startedAt: string | null
  streamEvents: {
    latestSubscriber: string
    latestFollower: string
    latestDonation: string
  }
}

export interface TimerConfig {
  id: TimerId
  mode: TimerMode
  label: string
  durationSeconds: number
  accumulatedSeconds: number
  running: boolean
  startedAt: number | null
  endsAt: number | null
}

export interface TimersState {
  timers: Record<TimerId, TimerConfig>
}

export interface PlanItem {
  id: string
  label: string
  done: boolean
  order: number
}

export interface Problem {
  id: number
  title: string
  difficulty: Difficulty
  description: string
  status: ProblemStatus
  solvedAt: string | null
  order: number
}

export interface CodesCopy {
  startingSoonSubtext: string
  brbSubtext: string
  brbMessage: string
  upNextLabel: string
}

export interface CodesState {
  plan: PlanItem[]
  problems: Problem[]
  code: {
    fileName: string
    content: string
  }
  whiteboard: {
    title: string
    bullets: string[]
    notes: string[]
    approach: string
  }
  goals: {
    dailyTarget: number
    weeklyTarget: number
    streak: number
  }
  copy: CodesCopy
  loadingProgress: number
}

export interface Exercise {
  id: string
  name: string
  sets: number
  repTarget: number
  completedSets: number
  repsInCurrentSet: number
  totalReps: number
  status: ExerciseStatus
  order: number
}

export interface CalisthenicsState {
  workoutType: string
  exercises: Exercise[]
  todayGoal: {
    label: string
    progress: number
  }
}

export interface AppState {
  version: typeof STORAGE_VERSION
  branding: BrandingState
  session: SessionState
  timers: TimersState
  codes: CodesState
  calisthenics: CalisthenicsState
}

/** @deprecated v1 flat shape — kept for migration only */
export interface LegacyStreamState {
  handle?: string
  brandTitle?: string
  streamStatus?: string
  streamTimeSeconds?: number
  streamTimeRunning?: boolean
  startingSoonCountdown?: number
  startingSoonRunning?: boolean
  brbCountdown?: number
  brbRunning?: boolean
  loadingProgress?: number
  currentProblem?: {
    id: number
    title: string
    difficulty: Difficulty
    description: string
  }
  todayPlan?: { id: string; label: string; done: boolean }[]
  recentProblems?: {
    id: number
    title: string
    done: boolean
    difficulty?: Difficulty
  }[]
  progressToday?: { current: number; target: number }
  weekGoal?: { current: number; target: number }
  streak?: number
  schedule?: string
  discord?: string
  twitter?: string
  youtube?: string
  kick?: string
  whiteboardTitle?: string
  whiteboardBullets?: string[]
  whiteboardNotes?: string[]
  currentApproach?: string
  codeContent?: string
  codeFileName?: string
  workoutType?: string
  currentExercise?: string
  currentSet?: { current: number; total: number }
  currentReps?: { current: number; target: number }
  restTimerSeconds?: number
  restTimerRunning?: boolean
  totalReps?: number
  todayGoalProgress?: number
  todayGoalLabel?: string
  upNextExercise?: string
  upNextSets?: number
  motto?: string
  calisthenicsMotto?: string
  latestSubscriber?: string
  latestFollower?: string
  latestDonation?: string
  brbMessage?: string
  startingSoonSubtext?: string
  brbSubtext?: string
  upNextLabel?: string
  version?: number
}

export type TimerDisplay = {
  id: TimerId
  label: string
  mode: TimerMode
  running: boolean
  seconds: number
  formatted: string
}

export type ProgressPair = { current: number; target: number }
