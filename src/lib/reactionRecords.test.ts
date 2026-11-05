import { afterEach, describe, expect, it } from 'vite-plus/test'
import {
  appendMeasurement,
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

  it('keeps only valid measurements and caps at 20', () => {
    const measurements = Array.from({ length: 25 }, (_, index) => ({
      ms: index + 1,
      playedAt: `2026-01-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
    }))

    const parsed = parseReactionRecords(
      JSON.stringify({
        measurements: [...measurements, { broken: true }],
        bestMs: 1,
      }),
    )

    expect(parsed.measurements).toHaveLength(20)
    expect(parsed.measurements[0]?.ms).toBe(1)
    expect(parsed.bestMs).toBe(1)
  })
})

describe('appendMeasurement', () => {
  it('stores successful measurements and updates best time', () => {
    const first = appendMeasurement(createEmptyReactionRecords(), {
      ms: 280,
      playedAt: '2026-01-01T00:00:00.000Z',
    })

    expect(first.measurements).toHaveLength(1)
    expect(first.bestMs).toBe(280)

    const second = appendMeasurement(first, {
      ms: 190,
      playedAt: '2026-01-02T00:00:00.000Z',
    })

    expect(second.measurements).toHaveLength(2)
    expect(second.measurements[0]?.ms).toBe(190)
    expect(second.bestMs).toBe(190)
  })

  it('keeps only the newest 20 measurements', () => {
    let store = createEmptyReactionRecords()
    for (let index = 0; index < 25; index += 1) {
      store = appendMeasurement(store, {
        ms: 100 + index,
        playedAt: `2026-02-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
      })
    }

    expect(store.measurements).toHaveLength(20)
    expect(store.measurements[0]?.ms).toBe(124)
    expect(store.bestMs).toBe(100)
  })
})

describe('formatReactionMs', () => {
  it('formats milliseconds for display', () => {
    expect(formatReactionMs(234)).toBe('234ms')
  })
})
