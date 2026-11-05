import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { RECORDS_STORAGE_KEY } from '#/lib/records'
import { JankenGame } from './JankenGame'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

function renderGame() {
  const store = createStore()
  return render(
    <Provider store={store}>
      <JankenGame />
    </Provider>,
  )
}

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
  it('renders the brand and start controls on idle', () => {
    renderGame()

    expect(screen.getByRole('heading', { name: '後だしじゃんけん' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'スタート' })).toBeInTheDocument()
    expect(screen.getByText('ベスト正答率')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '反射神経テストへ' })).toBeInTheDocument()
    expect(screen.queryByTestId('response-time-chart')).not.toBeInTheDocument()
  })

  it('shows an instruction, reveals a system hand, and accepts an answer', async () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // instruction -> lose
      .mockReturnValueOnce(0) // system hand -> rock
      .mockReturnValueOnce(0) // delay -> 1000ms

    vi.useFakeTimers()
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))

    expect(screen.getByTestId('instruction')).toHaveTextContent('負けて')
    expect(screen.getByTestId('waiting')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByTestId('system-hand')).toHaveTextContent('グー')

    fireEvent.click(screen.getByRole('button', { name: 'チョキ' }))

    expect(screen.getByTestId('feedback')).toHaveTextContent('正解')
  })

  it('shows a response-time chart instead of a history list on idle', () => {
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

    renderGame()

    expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
    expect(screen.queryByText('直近の記録')).not.toBeInTheDocument()
  })

  it('saves results to localStorage after ten rounds', async () => {
    vi.spyOn(Math, 'random').mockImplementation(() => 0)
    vi.useFakeTimers()

    renderGame()
    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))

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
