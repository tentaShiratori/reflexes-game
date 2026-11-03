import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { ACCHI_RECORDS_STORAGE_KEY } from '#/lib/records'
import { renderWithRouter } from '#/test/renderWithRouter'
import { AcchiGame } from './AcchiGame'

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
  it('renders the brand and start controls on idle', async () => {
    renderWithRouter(<AcchiGame />, { path: '/acchi' })

    expect(await screen.findByRole('heading', { name: 'あっち向いてホイ' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'スタート' })).toBeInTheDocument()
    expect(screen.getByText('ベスト正答率')).toBeInTheDocument()
  })

  it('shows an instruction, reveals a direction, and accepts an answer', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    renderWithRouter(<AcchiGame />, { path: '/acchi' })
    const start = await screen.findByRole('button', { name: 'スタート' })

    vi.useFakeTimers()
    fireEvent.click(start)

    expect(screen.getByTestId('instruction')).toHaveTextContent('同じ方向')
    expect(screen.getByTestId('waiting')).toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByTestId('system-direction')).toHaveTextContent('上')

    fireEvent.click(screen.getByRole('button', { name: '上' }))

    expect(screen.getByTestId('feedback')).toHaveTextContent('正解')
  })

  it('shows stored history on the idle screen', async () => {
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

    renderWithRouter(<AcchiGame />, { path: '/acchi' })

    expect(await screen.findByText('直近の記録')).toBeInTheDocument()
    expect(screen.getAllByText('80%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('0.25秒').length).toBeGreaterThan(0)
  })

  it('saves results to localStorage after ten rounds', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    renderWithRouter(<AcchiGame />, { path: '/acchi' })
    const start = await screen.findByRole('button', { name: 'スタート' })

    vi.useFakeTimers()
    fireEvent.click(start)

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
