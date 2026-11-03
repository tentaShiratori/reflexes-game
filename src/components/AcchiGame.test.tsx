import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { AcchiGame } from './AcchiGame'
import { ACCHI_RECORDS_STORAGE_KEY } from '#/lib/records'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    className,
  }: {
    children: React.ReactNode
    to: string
    className?: string
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

beforeEach(() => {
  localStorage.clear()
})

describe('AcchiGame', () => {
  it('renders the brand and start controls on idle', () => {
    render(<AcchiGame />)

    expect(screen.getByRole('heading', { name: 'あっち向いてホイ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'スタート' })).toBeInTheDocument()
    expect(screen.getByText('ベスト正答率')).toBeInTheDocument()
  })

  it('shows an instruction, reveals a direction, and accepts an answer', async () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0) // instruction -> match
      .mockReturnValueOnce(0) // system direction -> up
      .mockReturnValueOnce(0) // delay -> 1000ms

    vi.useFakeTimers()
    render(<AcchiGame />)

    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))

    expect(screen.getByTestId('instruction')).toHaveTextContent('同じ方向')
    expect(screen.getByTestId('waiting')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByTestId('system-direction')).toHaveTextContent('上')

    fireEvent.click(screen.getByRole('button', { name: '上' }))

    expect(screen.getByTestId('feedback')).toHaveTextContent('正解')
  })

  it('shows stored history on the idle screen', () => {
    localStorage.setItem(
      ACCHI_RECORDS_STORAGE_KEY,
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

    render(<AcchiGame />)

    expect(screen.getByText('直近の記録')).toBeInTheDocument()
    expect(screen.getAllByText('80%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('0.25秒').length).toBeGreaterThan(0)
  })

  it('saves results to localStorage after ten rounds', async () => {
    vi.spyOn(Math, 'random').mockImplementation(() => 0)
    vi.useFakeTimers()

    render(<AcchiGame />)
    fireEvent.click(screen.getByRole('button', { name: 'スタート' }))

    for (let round = 0; round < 10; round += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
      fireEvent.click(screen.getByRole('button', { name: '上' }))
      await act(async () => {
        await vi.advanceTimersByTimeAsync(700)
      })
    }

    expect(screen.getByRole('heading', { name: '結果' })).toBeInTheDocument()
    expect(screen.getByTestId('result-accuracy')).toHaveTextContent('100%')
    expect(localStorage.getItem(ACCHI_RECORDS_STORAGE_KEY)).toContain('"accuracy":1')
  })
})
