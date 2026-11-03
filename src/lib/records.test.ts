import { afterEach, describe, expect, it } from 'vite-plus/test'
import {
  RECORDS_STORAGE_KEY,
  createEmptyRecords,
  formatAccuracy,
  formatResponseMs,
  loadRecords,
  parseRecords,
  saveSession,
} from './records'

function createMemoryStorage(initial: Record<string, string> = {}): Storage {
  const store = { ...initial }
  return {
    get length() {
      return Object.keys(store).length
    },
    clear() {
      for (const key of Object.keys(store)) {
        delete store[key]
      }
    },
    getItem(key: string) {
      return Object.hasOwn(store, key) ? store[key]! : null
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null
    },
    removeItem(key: string) {
      delete store[key]
    },
    setItem(key: string, value: string) {
      store[key] = value
    },
  }
}

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

describe('saveSession', () => {
  it('stores session stats and updates best values', () => {
    const storage = createMemoryStorage()

    const first = saveSession(
      {
        accuracy: 0.7,
        averageResponseMs: 500,
        correctCount: 7,
        playedAt: '2026-01-01T00:00:00.000Z',
      },
      storage,
    )

    expect(first.sessions).toHaveLength(1)
    expect(first.bestAccuracy).toBe(0.7)
    expect(first.bestAverageResponseMs).toBe(500)

    const second = saveSession(
      {
        accuracy: 0.9,
        averageResponseMs: 300,
        correctCount: 9,
        playedAt: '2026-01-02T00:00:00.000Z',
      },
      storage,
    )

    expect(second.sessions).toHaveLength(2)
    expect(second.bestAccuracy).toBe(0.9)
    expect(second.bestAverageResponseMs).toBe(300)
    expect(JSON.parse(storage.getItem(RECORDS_STORAGE_KEY)!).sessions).toHaveLength(2)
  })
})

describe('loadRecords', () => {
  it('reads from localStorage', () => {
    localStorage.setItem(
      RECORDS_STORAGE_KEY,
      JSON.stringify({
        sessions: [],
        bestAccuracy: 0.5,
        bestAverageResponseMs: 410,
      }),
    )

    expect(loadRecords()).toEqual({
      sessions: [],
      bestAccuracy: 0.5,
      bestAverageResponseMs: 410,
    })
  })
})

describe('formatters', () => {
  it('formats accuracy and response speed for display', () => {
    expect(formatAccuracy(0.85)).toBe('85%')
    expect(formatResponseMs(1234)).toBe('1.23秒')
  })
})
