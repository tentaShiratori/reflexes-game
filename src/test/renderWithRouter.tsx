import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import { Provider as JotaiProvider, createStore } from 'jotai'
import type { ReactNode } from 'react'

type RenderWithRouterOptions = {
  path?: string
}

export function renderWithRouter(element: ReactNode, { path = '/' }: RenderWithRouterOptions = {}) {
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <>{path === '/' ? element : null}</>,
  })

  const jankenRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/janken',
    component: () => <>{path === '/janken' ? element : <div>janken</div>}</>,
  })

  const acchiRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/acchi',
    component: () => <>{path === '/acchi' ? element : <div>acchi</div>}</>,
  })

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, jankenRoute, acchiRoute]),
    history: createMemoryHistory({ initialEntries: [path] }),
  })

  return render(
    <JotaiProvider store={createStore()}>
      <RouterProvider router={router} />
    </JotaiProvider>,
  )
}
