import { test } from '@e2e-dev/web'
import { expect } from 'e2e'

test('acchi idle screen shows navigation and hides the chart without data', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/acchi')
  await expect(browser.locator('h1')).toContainText('あっち向いてホイ')
  await expect(screen.getByRole('button', 'スタート')).toBeVisible()
  await expect(screen.getByRole('link', '後だしじゃんけんへ')).toBeVisible()
  await expect(screen.getByRole('link', '反射神経テストへ')).toBeVisible()
  await expect(screen.getByTestId('response-time-chart')).toHaveCount(0)
  await expect(screen.getByText('直近の記録')).toHaveCount(0)
})

test('acchi idle screen shows the chart when session averages exist', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/acchi')
  await browser.evaluate(() => {
    localStorage.setItem(
      'reflexes-acchi-records',
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
    return true
  })

  await app.open('/acchi')
  await expect(screen.getByTestId('response-time-chart')).toBeVisible()
  await expect(screen.getByText('直近の記録')).toHaveCount(0)
  await expect(screen.getByText('ベスト正答率')).toBeVisible()
})

test('acchi reveals a direction after the delay and accepts an answer', async ({
  app,
  screen,
  browser,
}) => {
  await app.open('/acchi')
  await expect(browser.locator('h1')).toContainText('あっち向いてホイ')

  await screen.getByRole('button', 'スタート').click()
  await expect(screen.getByTestId('instruction')).toBeVisible()
  await expect(screen.getByTestId('waiting')).toBeVisible()

  await expect(screen.getByTestId('system-direction')).toBeVisible({ timeout: 5000 })
  await screen.getByRole('button', '上').click()
  await expect(screen.getByTestId('feedback')).toBeVisible()
})
