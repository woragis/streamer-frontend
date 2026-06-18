import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { ControlPage } from '@/routes/control/ControlPage'
import { CodesChatPage } from '@/routes/codes/chat'
import { CalisthenicsChatPage } from '@/routes/calisthenics/chat'
import {
  CodesCameraFramePage,
  CodesChatFramePage,
  CalisthenicsCameraFramePage,
  CalisthenicsChatFramePage,
} from '@/routes/shared/frame-pages'
import {
  StartingSoonPage,
  BrbPage,
  BreakPage,
  MainCodingPage,
  WhiteboardPage,
  ProblemAnalysisPage,
  EndScreenPage,
} from '@/routes/codes/pages'
import {
  CalisthenicsMainPage,
  CalisthenicsBrbPage,
  CalisthenicsBreakPage,
  CalisthenicsReactPage,
  CalisthenicsEndScreenPage,
} from '@/routes/calisthenics/pages'
import { ApiSyncProvider } from '@/hooks/useApiSync'

const obsSearch = (search: Record<string, unknown>) => ({
  obs: search.obs as string | boolean | undefined,
})

const rootRoute = createRootRoute({
  component: () => (
    <ApiSyncProvider>
      <Outlet />
    </ApiSyncProvider>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/control', search: { room: 'codes' } })
  },
})

const controlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/control',
  component: ControlPage,
  validateSearch: (search: Record<string, unknown>) => ({
    room: search.room as 'codes' | 'calisthenics' | 'default' | undefined,
  }),
})

const startingSoonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/starting-soon',
  component: StartingSoonPage,
  validateSearch: obsSearch,
})

const mainCodingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/main',
  component: MainCodingPage,
  validateSearch: obsSearch,
})

const brbRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/brb',
  component: BrbPage,
  validateSearch: obsSearch,
})

const breakRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/break',
  component: BreakPage,
  validateSearch: obsSearch,
})

const whiteboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/whiteboard',
  component: WhiteboardPage,
  validateSearch: obsSearch,
})

const problemAnalysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/problem-analysis',
  component: ProblemAnalysisPage,
  validateSearch: obsSearch,
})

const codesEndScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/end-screen',
  component: EndScreenPage,
  validateSearch: obsSearch,
})

const codesChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/chat',
  component: CodesChatPage,
  validateSearch: obsSearch,
})

const codesCameraFrameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/camera-frame',
  component: CodesCameraFramePage,
  validateSearch: obsSearch,
})

const codesChatFrameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/chat-frame',
  component: CodesChatFramePage,
  validateSearch: obsSearch,
})

const calisthenicsMainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/main',
  component: CalisthenicsMainPage,
  validateSearch: obsSearch,
})

const calisthenicsBreakRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/break',
  component: CalisthenicsBreakPage,
  validateSearch: obsSearch,
})

const calisthenicsBrbRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/brb',
  component: CalisthenicsBrbPage,
  validateSearch: obsSearch,
})

const calisthenicsReactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/react',
  component: CalisthenicsReactPage,
  validateSearch: obsSearch,
})

const calisthenicsEndScreenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/end-screen',
  component: CalisthenicsEndScreenPage,
  validateSearch: obsSearch,
})

const calisthenicsChatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/chat',
  component: CalisthenicsChatPage,
  validateSearch: obsSearch,
})

const calisthenicsCameraFrameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/camera-frame',
  component: CalisthenicsCameraFramePage,
  validateSearch: obsSearch,
})

const calisthenicsChatFrameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/chat-frame',
  component: CalisthenicsChatFramePage,
  validateSearch: obsSearch,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  controlRoute,
  startingSoonRoute,
  mainCodingRoute,
  brbRoute,
  breakRoute,
  whiteboardRoute,
  problemAnalysisRoute,
  codesEndScreenRoute,
  codesChatRoute,
  codesCameraFrameRoute,
  codesChatFrameRoute,
  calisthenicsMainRoute,
  calisthenicsBreakRoute,
  calisthenicsBrbRoute,
  calisthenicsReactRoute,
  calisthenicsEndScreenRoute,
  calisthenicsChatRoute,
  calisthenicsCameraFrameRoute,
  calisthenicsChatFrameRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
