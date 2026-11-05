import { describe, expect, it } from 'vite-plus/test'
import { loadServerResponse } from '../../test/router'

describe('GET /', () => {
  it('後だしじゃんけんのホーム画面を出す', async () => {
    const response = await loadServerResponse(new Request('http://localhost/'))
    expect(response.status).toBe(200)
    const html = await response.text()
    expect(html).toContain('後だしじゃんけん | Reflex Drill')
    expect(html).toContain('後だしじゃんけん')
    expect(html).toContain('スタート')
    expect(html).toContain('Reflex Drill')
    expect(html).toContain('反射神経テストへ')
    expect(html).toContain('あっち向いてホイへ')
  })
})
