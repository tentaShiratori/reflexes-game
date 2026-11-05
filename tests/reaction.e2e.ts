import { test } from '@e2e-dev/web'
import { expect } from 'e2e'

test('reaction game measures a green click and rejects early clicks', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/reaction')
  await expect(browser.locator('h1')).toContainText('反射神経テスト')
  await expect(screen.getByRole('link', '後だしじゃんけんへ')).toBeVisible()

  await screen.getByRole('button', 'スタート').click()
  await expect(screen.getByTestId('reaction-waiting')).toBeVisible()
  await expect(screen.getByText('待て')).toBeVisible()

  await screen.getByTestId('reaction-waiting').click()
  await expect(screen.getByTestId('reaction-waiting')).toContainText('早すぎ')

  await expect(screen.getByTestId('reaction-ready')).toBeVisible({ timeout: 5000 })
  await expect(screen.getByText('今すぐ')).toBeVisible()
  await screen.getByTestId('reaction-ready').click()

  await expect(screen.getByRole('heading', '結果')).toBeVisible()
  await expect(screen.getByTestId('reaction-result-ms')).toBeVisible()
  await expect(screen.getByRole('button', 'もう一度')).toBeVisible()
})

test('idle screens show charts from stored history without a janken list', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/')
  await browser.evaluate(() => {
    localStorage.setItem(
      'reflexes-janken-records',
      JSON.stringify({
        sessions: [
          {
            accuracy: 0.8,
            averageResponseMs: 250,
            correctCount: 8,
            totalRounds: 10,
            playedAt: '2026-03-01T12:00:00.000Z',
          },
          {
            accuracy: 0.7,
            averageResponseMs: 310,
            correctCount: 7,
            totalRounds: 10,
            playedAt: '2026-03-02T12:00:00.000Z',
          },
        ],
        bestAccuracy: 0.8,
        bestAverageResponseMs: 250,
      }),
    )
    localStorage.setItem(
      'reflexes-reaction-records',
      JSON.stringify({
        measurements: [
          { ms: 210, playedAt: '2026-03-02T12:00:00.000Z' },
          { ms: 260, playedAt: '2026-03-01T12:00:00.000Z' },
        ],
        bestMs: 210,
      }),
    )
    return true
  })

  await app.open('/')
  await expect(screen.getByTestId('response-time-chart')).toBeVisible()
  await expect(screen.getByText('直近の記録')).toHaveCount(0)
  await expect(screen.getByRole('link', '反射神経テストへ')).toBeVisible()

  await screen.getByRole('link', '反射神経テストへ').click()
  await expect(browser).toHaveURL('/reaction')
  await expect(screen.getByTestId('response-time-chart')).toBeVisible()
  await expect(screen.getByTestId('reaction-best-ms')).toContainText('210ms')
})
