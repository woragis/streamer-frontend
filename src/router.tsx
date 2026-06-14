import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { ControlPage } from '@/routes/control/ControlPage'
import {
  StartingSoonPage,
  BrbPage,
  MainCodingPage,
  WhiteboardPage,
} from '@/routes/codes/pages'
import { CalisthenicsMainPage } from '@/routes/calisthenics/pages'

const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/control' })
  },
})

const controlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/control',
  component: ControlPage,
})

const startingSoonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/starting-soon',
  component: StartingSoonPage,
  validateSearch: (search: Record<string, unknown>) => ({
    obs: search.obs as string | boolean | undefined,
  }),
})

const mainCodingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/main',
  component: MainCodingPage,
  validateSearch: (search: Record<string, unknown>) => ({
    obs: search.obs as string | boolean | undefined,
  }),
})

const brbRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/brb',
  component: BrbPage,
  validateSearch: (search: Record<string, unknown>) => ({
    obs: search.obs as string | boolean | undefined,
  }),
})

const whiteboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/codes/whiteboard',
  component: WhiteboardPage,
  validateSearch: (search: Record<string, unknown>) => ({
    obs: search.obs as string | boolean | undefined,
  }),
})

const calisthenicsMainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calisthenics/main',
  component: CalisthenicsMainPage,
  validateSearch: (search: Record<string, unknown>) => ({
    obs: search.obs as string | boolean | undefined,
  }),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  controlRoute,
  startingSoonRoute,
  mainCodingRoute,
  brbRoute,
  whiteboardRoute,
  calisthenicsMainRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
