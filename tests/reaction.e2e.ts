import { test } from '@e2e-dev/web'
import { expect } from 'e2e'

test('reaction game averages five successful trials and rejects early clicks', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/reaction')
  await expect(browser.locator('h1')).toContainText('反射神経テスト')
  await expect(screen.getByRole('link', '後だしじゃんけんへ')).toBeVisible()
  await expect(screen.getByRole('link', 'あっち向いてホイへ')).toBeVisible()

  await screen.getByRole('button', 'スタート').click()
  await expect(screen.getByTestId('reaction-waiting')).toBeVisible()
  await expect(screen.getByTestId('reaction-trial-progress')).toContainText('1 / 5')
  await expect(screen.getByText('待て')).toBeVisible()

  await screen.getByTestId('reaction-waiting').click()
  await expect(screen.getByTestId('reaction-waiting')).toContainText('早すぎ')
  await expect(screen.getByTestId('reaction-trial-progress')).toContainText('1 / 5')

  for (let trial = 1; trial <= 5; trial += 1) {
    await expect(screen.getByTestId('reaction-trial-progress')).toContainText(`${trial} / 5`)
    await expect(screen.getByTestId('reaction-waiting')).toBeVisible()
    await expect(screen.getByTestId('reaction-ready')).toBeVisible({ timeout: 5000 })
    await expect(screen.getByText('今すぐ')).toBeVisible()
    await screen.getByTestId('reaction-ready').click()
  }

  await expect(screen.getByRole('heading', '結果')).toBeVisible()
  await expect(screen.getByTestId('reaction-result-ms')).toBeVisible()
  await expect(screen.getByTestId('reaction-trial-list')).toBeVisible()
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
      'reflexes-reaction-game-records',
      JSON.stringify({
        games: [
          { averageMs: 210, playedAt: '2026-03-02T12:00:00.000Z' },
          { averageMs: 260, playedAt: '2026-03-01T12:00:00.000Z' },
        ],
        bestAverageMs: 210,
      }),
    )
    localStorage.setItem(
      'reflexes-acchi-records',
      JSON.stringify({
        sessions: [
          {
            accuracy: 0.9,
            averageResponseMs: 240,
            correctCount: 9,
            totalRounds: 10,
            playedAt: '2026-03-03T12:00:00.000Z',
          },
        ],
        bestAccuracy: 0.9,
        bestAverageResponseMs: 240,
      }),
    )
    return true
  })

  await app.open('/')
  await expect(screen.getByTestId('response-time-chart')).toBeVisible()
  await expect(screen.getByText('直近の記録')).toHaveCount(0)
  await expect(screen.getByRole('link', '反射神経テストへ')).toBeVisible()
  await expect(screen.getByRole('link', 'あっち向いてホイへ')).toBeVisible()

  await screen.getByRole('link', '反射神経テストへ').click()
  await expect(browser).toHaveURL('/reaction')
  await expect(screen.getByTestId('response-time-chart')).toBeVisible()
  await expect(screen.getByTestId('reaction-best-ms')).toContainText('210ms')

  await screen.getByRole('link', 'あっち向いてホイへ').click()
  await expect(browser).toHaveURL('/acchi')
  await expect(screen.getByTestId('response-time-chart')).toBeVisible()
  await expect(browser.locator('h1')).toContainText('あっち向いてホイ')
})
