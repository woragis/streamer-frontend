import {
  StartingSoonPage,
  MainCodingPage,
  BreakPage,
  WhiteboardPage,
  ProblemAnalysisPage,
  EndScreenPage,
} from '@/routes/codes/pages'
import { CalisthenicsMainPage, CalisthenicsReactPage, CalisthenicsEndScreenPage } from '@/routes/calisthenics/pages'
import type { SceneCatalogEntry } from '@/components/control/ScenePreviewCatalog'
import type { Scene } from '@/stores/types'

export const SCENE_CATALOG: SceneCatalogEntry[] = [
  {
    id: 'codes-starting-soon',
    label: 'Starting Soon',
    path: '/codes/starting-soon',
    scene: 'starting-soon',
    group: 'codes',
    Page: StartingSoonPage,
  },
  {
    id: 'codes-main',
    label: 'Main',
    path: '/codes/main',
    scene: 'live',
    group: 'codes',
    Page: MainCodingPage,
  },
  {
    id: 'codes-break',
    label: 'Break',
    path: '/codes/break',
    scene: 'brb',
    group: 'codes',
    Page: BreakPage,
  },
  {
    id: 'codes-whiteboard',
    label: 'Whiteboard',
    path: '/codes/whiteboard',
    scene: 'whiteboard',
    group: 'codes',
    Page: WhiteboardPage,
  },
  {
    id: 'codes-problem-analysis',
    label: 'Problem Analysis',
    path: '/codes/problem-analysis',
    scene: 'problem-analysis',
    group: 'codes',
    Page: ProblemAnalysisPage,
  },
  {
    id: 'codes-end-screen',
    label: 'End Screen',
    path: '/codes/end-screen',
    scene: 'end-screen',
    group: 'codes',
    Page: EndScreenPage,
  },
  {
    id: 'cal-main',
    label: 'Main Workout',
    path: '/calisthenics/main',
    scene: 'workout',
    group: 'calisthenics',
    Page: CalisthenicsMainPage,
  },
  {
    id: 'cal-react',
    label: 'React Alert',
    path: '/calisthenics/react',
    scene: 'react',
    group: 'calisthenics',
    Page: CalisthenicsReactPage,
  },
  {
    id: 'cal-end-screen',
    label: 'End Screen',
    path: '/calisthenics/end-screen',
    scene: 'end-screen',
    group: 'calisthenics',
    Page: CalisthenicsEndScreenPage,
  },
]

export const CONTROL_SCENES: { id: Scene; label: string }[] = [
  { id: 'offline', label: 'Offline' },
  { id: 'starting-soon', label: 'Starting Soon' },
  { id: 'live', label: 'Main' },
  { id: 'brb', label: 'Break' },
  { id: 'whiteboard', label: 'Whiteboard' },
  { id: 'problem-analysis', label: 'Problem Analysis' },
  { id: 'end-screen', label: 'End Screen' },
  { id: 'workout', label: 'Workout' },
  { id: 'react', label: 'React' },
]
