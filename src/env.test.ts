import { describe, expect, it } from 'vite-plus/test'
import { env } from './env'

describe('env', () => {
  it('exposes optional client title without crashing', () => {
    expect(env).toBeDefined()
    expect(env.VITE_APP_TITLE === undefined || typeof env.VITE_APP_TITLE === 'string').toBe(true)
  })
})
