import { useMemo } from 'react'
import { useAppStore, useNow, useTimerDisplay } from '@/hooks/useAppStore'
import {
  selectCurrentProblem,
  selectLoadingProgress,
  selectProgressToday,
  selectRecentProblemItems,
  selectSortedPlan,
  selectWeekGoal,
  selectActiveExercise,
  selectNextExercise,
  selectTotalReps,
} from '@/stores/selectors'

export function useBranding() {
  return useAppStore((s) => s.branding)
}

export function useSession() {
  return useAppStore((s) => s.session)
}

export function useCodesCopy() {
  return useAppStore((s) => s.codes.copy)
}

export function useCodesGoals() {
  return useAppStore((s) => s.codes.goals)
}

export function useCodesCode() {
  return useAppStore((s) => s.codes.code)
}

export function useWhiteboard() {
  return useAppStore((s) => s.codes.whiteboard)
}

export function useCalisthenics() {
  return useAppStore((s) => s.calisthenics)
}

export function useCurrentProblem() {
  return useAppStore(selectCurrentProblem)
}

export function useTodayPlan() {
  return useAppStore(selectSortedPlan)
}

export function useRecentProblems() {
  return useAppStore(selectRecentProblemItems)
}

export function useProgressToday() {
  const now = useNow()
  return useAppStore((s) => selectProgressToday(s, now))
}

export function useWeekGoal() {
  const now = useNow()
  return useAppStore((s) => selectWeekGoal(s, now))
}

export function useLoadingProgress() {
  const now = useNow()
  return useAppStore((s) => selectLoadingProgress(s, now))
}

export function useStreamTimerDisplay() {
  return useTimerDisplay('stream')
}

export function useStartingSoonTimer() {
  return useTimerDisplay('startingSoon')
}

export function useBrbTimer() {
  return useTimerDisplay('brb')
}

export function useRestTimer() {
  return useTimerDisplay('rest')
}

export function useFocusTimer() {
  return useTimerDisplay('focus')
}

export function useActiveExercise() {
  return useAppStore(selectActiveExercise)
}

export function useNextExercise() {
  return useAppStore(selectNextExercise)
}

export function useTotalReps() {
  return useAppStore(selectTotalReps)
}

export function useWorkoutStats() {
  const active = useActiveExercise()
  const next = useNextExercise()
  const totalReps = useTotalReps()
  const cal = useCalisthenics()
  const rest = useRestTimer()
  const stream = useStreamTimerDisplay()

  return useMemo(
    () => ({
      workoutType: cal.workoutType,
      active,
      next,
      totalReps,
      rest,
      stream,
      todayGoal: cal.todayGoal,
    }),
    [active, next, totalReps, cal, rest, stream],
  )
}
