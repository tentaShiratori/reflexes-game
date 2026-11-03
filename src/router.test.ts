import { describe, expect, it } from 'vite-plus/test'
import { getRouter } from './router'

describe('getRouter', () => {
  it('creates a router registered for the generated route tree', () => {
    const router = getRouter()

    expect(router).toBeDefined()
    expect(router.state).toBeDefined()
    expect(router.routesByPath['/']).toBeDefined()
  })
})
