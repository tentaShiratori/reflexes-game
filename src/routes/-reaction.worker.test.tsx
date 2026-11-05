import { describe, expect, it } from 'vite-plus/test'
import { loadServerResponse } from '../../test/router'

describe('GET /reaction', () => {
  it('反射神経テストの画面を出す', async () => {
    const response = await loadServerResponse(new Request('http://localhost/reaction'))
    expect(response.status).toBe(200)
    const html = await response.text()
    expect(html).toContain('反射神経テスト')
    expect(html).toContain('スタート')
    expect(html).toContain('後だしじゃんけんへ')
    expect(html).toContain('あっち向いてホイへ')
  })
})
