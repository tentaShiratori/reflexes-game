import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { RECORDS_STORAGE_KEY } from '#/lib/records'
import { renderWithRouter } from '#/test/renderWithRouter'
import { JankenGame } from './JankenGame'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

beforeEach(() => {
  localStorage.clear()
})

describe('JankenGame', () => {
  it('renders the brand and start controls on idle', async () => {
    renderWithRouter(<JankenGame />, { path: '/janken' })

    expect(await screen.findByRole('heading', { name: '後だしじゃんけん' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'スタート' })).toBeInTheDocument()
    expect(screen.getByText('ベスト正答率')).toBeInTheDocument()
  })

  it('shows an instruction, reveals a system hand, and accepts an answer', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    renderWithRouter(<JankenGame />, { path: '/janken' })
    const start = await screen.findByRole('button', { name: 'スタート' })

    vi.useFakeTimers()
    fireEvent.click(start)

    expect(screen.getByTestId('instruction')).toHaveTextContent('負けて')
    expect(screen.getByTestId('waiting')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByTestId('system-hand')).toHaveTextContent('グー')

    fireEvent.click(screen.getByRole('button', { name: 'チョキ' }))

    expect(screen.getByTestId('feedback')).toHaveTextContent('正解')
  })

  it('shows stored history on the idle screen', async () => {
    localStorage.setItem(
      RECORDS_STORAGE_KEY,
      JSON.stringify({
        sessions: [
          {
            accuracy: 0.8,
            averageResponseMs: 250,
            correctCount: 8,
            totalRounds: 10,
            playedAt: '2026-03-01T12:00:00.000Z',
          },
        ],
        bestAccuracy: 0.8,
        bestAverageResponseMs: 250,
      }),
    )

    renderWithRouter(<JankenGame />, { path: '/janken' })

    expect(await screen.findByText('直近の記録')).toBeInTheDocument()
    expect(screen.getAllByText('80%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('0.25秒').length).toBeGreaterThan(0)
  })

  it('saves results to localStorage after ten rounds', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    renderWithRouter(<JankenGame />, { path: '/janken' })
    const start = await screen.findByRole('button', { name: 'スタート' })

    vi.useFakeTimers()
    fireEvent.click(start)

    for (let round = 0; round < 10; round += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
      fireEvent.click(screen.getByRole('button', { name: 'チョキ' }))
      await act(async () => {
        await vi.advanceTimersByTimeAsync(700)
      })
    }

    expect(screen.getByRole('heading', { name: '結果' })).toBeInTheDocument()
    expect(screen.getByTestId('result-accuracy')).toHaveTextContent('100%')
    expect(localStorage.getItem(RECORDS_STORAGE_KEY)).toContain('"accuracy":1')
  })
})
