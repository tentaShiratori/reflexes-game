import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { REACTION_RECORDS_STORAGE_KEY, TRIALS_PER_GAME } from '#/lib/reactionRecords'
import { ReactionGame } from './ReactionGame'

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
      <ReactionGame />
    </Provider>,
  )
}

async function completeSuccessfulTrial(ms: number) {
  expect(screen.getByTestId('reaction-waiting')).toHaveTextContent('待て')

  await act(async () => {
    await vi.advanceTimersByTimeAsync(1000)
  })

  expect(screen.getByTestId('reaction-ready')).toHaveTextContent('今すぐ')

  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms)
  })
  fireEvent.click(screen.getByTestId('reaction-ready'))
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

describe('ReactionGame', () => {
  it('renders the brand and start controls on idle', () => {
    renderGame()

    expect(screen.getByRole('heading', { name: '反射神経テスト' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'スタート' })).toBeInTheDocument()
    expect(screen.getByText('ベスト平均')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '後だしじゃんけんへ' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'あっち向いてホイへ' })).toBeInTheDocument()
    expect(screen.queryByTestId('response-time-chart')).not.toBeInTheDocument()
  })

  it('requires five successful trials, then records the average', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    vi.useFakeTimers()
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    expect(screen.getByTestId('reaction-trial-progress')).toHaveTextContent('1 / 5')

    for (let trial = 0; trial < TRIALS_PER_GAME; trial += 1) {
      expect(screen.getByTestId('reaction-trial-progress')).toHaveTextContent(
        `${trial + 1} / ${TRIALS_PER_GAME}`,
      )
      await completeSuccessfulTrial(100 + trial * 10)
    }

    expect(screen.getByRole('heading', { name: '結果' })).toBeInTheDocument()
    expect(screen.getByTestId('reaction-result-ms')).toHaveTextContent('120ms')
    expect(screen.getByTestId('reaction-trial-list')).toHaveTextContent('100ms')
    expect(screen.getByTestId('reaction-trial-list')).toHaveTextContent('140ms')

    const stored = JSON.parse(localStorage.getItem(REACTION_RECORDS_STORAGE_KEY) ?? '{}')
    expect(stored.bestAverageMs).toBe(120)
    expect(stored.games).toHaveLength(1)
    expect(stored.games[0].averageMs).toBe(120)
  })

  it('treats an early click as invalid and retries the same trial without saving', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    vi.useFakeTimers()
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    fireEvent.click(screen.getByTestId('reaction-waiting'))

    expect(screen.getByTestId('reaction-waiting')).toHaveTextContent('早すぎ')
    expect(screen.getByTestId('reaction-trial-progress')).toHaveTextContent('1 / 5')
    expect(localStorage.getItem(REACTION_RECORDS_STORAGE_KEY)).toBeNull()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByTestId('reaction-ready')).toBeInTheDocument()
  })

  it('shows a chart from stored game averages on idle', () => {
    localStorage.setItem(
      REACTION_RECORDS_STORAGE_KEY,
      JSON.stringify({
        games: [
          { averageMs: 210, playedAt: '2026-03-02T12:00:00.000Z' },
          { averageMs: 260, playedAt: '2026-03-01T12:00:00.000Z' },
        ],
        bestAverageMs: 210,
      }),
    )

    renderGame()

    expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
    expect(screen.getByTestId('reaction-best-ms')).toHaveTextContent('210ms')
  })
})
