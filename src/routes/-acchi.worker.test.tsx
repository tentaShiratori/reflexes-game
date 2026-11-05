import { describe, expect, it } from 'vite-plus/test'
import { loadServerResponse } from '../../test/router'

describe('GET /acchi', () => {
  it('あっち向いてホイの画面を出す', async () => {
    const response = await loadServerResponse(new Request('http://localhost/acchi'))
    expect(response.status).toBe(200)
    const html = await response.text()
    expect(html).toContain('あっち向いてホイ')
    expect(html).toContain('スタート')
    expect(html).toContain('後だしじゃんけんへ')
    expect(html).toContain('反射神経テストへ')
  })
})
