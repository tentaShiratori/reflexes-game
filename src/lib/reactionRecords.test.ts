import { afterEach, describe, expect, it } from 'vite-plus/test'
import {
  appendGame,
  averageTrialMs,
  createEmptyReactionRecords,
  formatReactionMs,
  parseReactionRecords,
} from './reactionRecords'

afterEach(() => {
  localStorage.clear()
})

describe('parseReactionRecords', () => {
  it('returns empty records for null or invalid payloads', () => {
    expect(parseReactionRecords(null)).toEqual(createEmptyReactionRecords())
    expect(parseReactionRecords('{')).toEqual(createEmptyReactionRecords())
    expect(parseReactionRecords('"nope"')).toEqual(createEmptyReactionRecords())
  })

  it('ignores legacy single-click measurements and keeps only game averages', () => {
    expect(
      parseReactionRecords(
        JSON.stringify({
          measurements: [{ ms: 210, playedAt: '2026-03-02T12:00:00.000Z' }],
          bestMs: 210,
        }),
      ),
    ).toEqual(createEmptyReactionRecords())
  })

  it('keeps only valid games and caps at 20', () => {
    const games = Array.from({ length: 25 }, (_, index) => ({
      averageMs: index + 1,
      playedAt: `2026-01-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
    }))

    const parsed = parseReactionRecords(
      JSON.stringify({
        games: [...games, { broken: true }],
        bestAverageMs: 1,
      }),
    )

    expect(parsed.games).toHaveLength(20)
    expect(parsed.games[0]?.averageMs).toBe(1)
    expect(parsed.bestAverageMs).toBe(1)
  })
})

describe('appendGame', () => {
  it('stores game averages and updates best average', () => {
    const first = appendGame(createEmptyReactionRecords(), {
      averageMs: 280,
      playedAt: '2026-01-01T00:00:00.000Z',
    })

    expect(first.games).toHaveLength(1)
    expect(first.bestAverageMs).toBe(280)

    const second = appendGame(first, {
      averageMs: 190,
      playedAt: '2026-01-02T00:00:00.000Z',
    })

    expect(second.games).toHaveLength(2)
    expect(second.games[0]?.averageMs).toBe(190)
    expect(second.bestAverageMs).toBe(190)
  })

  it('keeps only the newest 20 games', () => {
    let store = createEmptyReactionRecords()
    for (let index = 0; index < 25; index += 1) {
      store = appendGame(store, {
        averageMs: 100 + index,
        playedAt: `2026-02-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
      })
    }

    expect(store.games).toHaveLength(20)
    expect(store.games[0]?.averageMs).toBe(124)
    expect(store.bestAverageMs).toBe(100)
  })
})

describe('averageTrialMs', () => {
  it('rounds the mean of successful trial times', () => {
    expect(averageTrialMs([100, 200, 300, 400, 500])).toBe(300)
    expect(averageTrialMs([])).toBe(0)
  })
})

describe('formatReactionMs', () => {
  it('formats milliseconds for display', () => {
    expect(formatReactionMs(234)).toBe('234ms')
  })
})
