import { afterEach, describe, expect, it } from 'vite-plus/test'
import {
  appendSession,
  createEmptyRecords,
  formatAccuracy,
  formatResponseMs,
  parseRecords,
} from './records'

afterEach(() => {
  localStorage.clear()
})

describe('parseRecords', () => {
  it('returns empty records for null or invalid payloads', () => {
    expect(parseRecords(null)).toEqual(createEmptyRecords())
    expect(parseRecords('{')).toEqual(createEmptyRecords())
    expect(parseRecords('"nope"')).toEqual(createEmptyRecords())
  })

  it('keeps only valid sessions', () => {
    const parsed = parseRecords(
      JSON.stringify({
        sessions: [
          {
            accuracy: 0.8,
            averageResponseMs: 320,
            correctCount: 8,
            totalRounds: 10,
            playedAt: '2026-01-01T00:00:00.000Z',
          },
          { broken: true },
        ],
        bestAccuracy: 0.8,
        bestAverageResponseMs: 320,
      }),
    )

    expect(parsed.sessions).toHaveLength(1)
    expect(parsed.bestAccuracy).toBe(0.8)
    expect(parsed.bestAverageResponseMs).toBe(320)
  })
})

describe('appendSession', () => {
  it('stores session stats and updates best values', () => {
    const first = appendSession(createEmptyRecords(), {
      accuracy: 0.7,
      averageResponseMs: 500,
      correctCount: 7,
      playedAt: '2026-01-01T00:00:00.000Z',
    })

    expect(first.sessions).toHaveLength(1)
    expect(first.bestAccuracy).toBe(0.7)
    expect(first.bestAverageResponseMs).toBe(500)

    const second = appendSession(first, {
      accuracy: 0.9,
      averageResponseMs: 300,
      correctCount: 9,
      playedAt: '2026-01-02T00:00:00.000Z',
    })

    expect(second.sessions).toHaveLength(2)
    expect(second.bestAccuracy).toBe(0.9)
    expect(second.bestAverageResponseMs).toBe(300)
  })
})

describe('formatters', () => {
  it('formats accuracy and response speed for display', () => {
    expect(formatAccuracy(0.85)).toBe('85%')
    expect(formatResponseMs(1234)).toBe('1.23秒')
  })
})
