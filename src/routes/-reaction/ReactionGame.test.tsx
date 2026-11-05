import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { REACTION_RECORDS_STORAGE_KEY } from '#/lib/reactionRecords'
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
    expect(screen.getByText('ベストタイム')).toBeInTheDocument()
    expect(screen.queryByTestId('response-time-chart')).not.toBeInTheDocument()
  })

  it('shows waiting then ready, and records a successful click', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    vi.useFakeTimers()
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    expect(screen.getByTestId('reaction-waiting')).toHaveTextContent('待て')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByTestId('reaction-ready')).toHaveTextContent('今すぐ')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(123)
    })
    fireEvent.click(screen.getByTestId('reaction-ready'))

    expect(screen.getByRole('heading', { name: '結果' })).toBeInTheDocument()
    expect(screen.getByTestId('reaction-result-ms')).toHaveTextContent('123ms')

    const stored = JSON.parse(localStorage.getItem(REACTION_RECORDS_STORAGE_KEY) ?? '{}')
    expect(stored.bestMs).toBe(123)
    expect(stored.measurements).toHaveLength(1)
    expect(stored.measurements[0].ms).toBe(123)
  })

  it('treats an early click as invalid and restarts waiting without saving', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    vi.useFakeTimers()
    renderGame()

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))
    fireEvent.click(screen.getByTestId('reaction-waiting'))

    expect(screen.getByTestId('reaction-waiting')).toHaveTextContent('早すぎ')
    expect(localStorage.getItem(REACTION_RECORDS_STORAGE_KEY)).toBeNull()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByTestId('reaction-ready')).toBeInTheDocument()
  })

  it('shows a chart from stored successful measurements on idle', () => {
    localStorage.setItem(
      REACTION_RECORDS_STORAGE_KEY,
      JSON.stringify({
        measurements: [
          { ms: 210, playedAt: '2026-03-02T12:00:00.000Z' },
          { ms: 260, playedAt: '2026-03-01T12:00:00.000Z' },
        ],
        bestMs: 210,
      }),
    )

    renderGame()

    expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
    expect(screen.getByTestId('reaction-best-ms')).toHaveTextContent('210ms')
  })
})
