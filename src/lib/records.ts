import { atomWithStorage } from 'jotai/utils'
import * as v from 'valibot'
import { TOTAL_ROUNDS } from './reflex'

export type SessionRecord = {
  accuracy: number
  averageResponseMs: number
  correctCount: number
  totalRounds: number
  playedAt: string
}

export type RecordsStore = {
  sessions: SessionRecord[]
  bestAccuracy: number
  bestAverageResponseMs: number | null
}

export const JANKEN_RECORDS_STORAGE_KEY = 'reflexes-janken-records'
export const ACCHI_RECORDS_STORAGE_KEY = 'reflexes-acchi-records'
const MAX_SESSIONS = 50

const SessionRecordSchema = v.object({
  accuracy: v.number(),
  averageResponseMs: v.number(),
  correctCount: v.number(),
  totalRounds: v.number(),
  playedAt: v.string(),
})

const LooseRecordsSchema = v.object({
  sessions: v.optional(v.array(v.unknown())),
  bestAccuracy: v.optional(v.number()),
  bestAverageResponseMs: v.optional(v.nullable(v.number())),
})

export function createEmptyRecords(): RecordsStore {
  return {
    sessions: [],
    bestAccuracy: 0,
    bestAverageResponseMs: null,
  }
}

export function parseRecords(raw: string | null): RecordsStore {
  if (!raw) {
    return createEmptyRecords()
  }

  try {
    const json: unknown = JSON.parse(raw)
    const loose = v.safeParse(LooseRecordsSchema, json)
    if (!loose.success) {
      return createEmptyRecords()
    }

    const sessions = (loose.output.sessions ?? []).flatMap((session) => {
      const parsed = v.safeParse(SessionRecordSchema, session)
      return parsed.success ? [parsed.output] : []
    })

    return {
      sessions,
      bestAccuracy: loose.output.bestAccuracy ?? 0,
      bestAverageResponseMs: loose.output.bestAverageResponseMs ?? null,
    }
  } catch {
    return createEmptyRecords()
  }
}

type RecordsStorage = {
  getItem: (key: string, initialValue: RecordsStore) => RecordsStore
  setItem: (key: string, value: RecordsStore) => void
  removeItem: (key: string) => void
}

function createRecordsStorage(): RecordsStorage {
  return {
    getItem(key, initialValue) {
      if (typeof localStorage === 'undefined') {
        return initialValue
      }
      return parseRecords(localStorage.getItem(key))
    },
    setItem(key, value) {
      if (typeof localStorage === 'undefined') {
        return
      }
      localStorage.setItem(key, JSON.stringify(value))
    },
    removeItem(key) {
      if (typeof localStorage === 'undefined') {
        return
      }
      localStorage.removeItem(key)
    },
  }
}

const recordsStorage = createRecordsStorage()

export const jankenRecordsAtom = atomWithStorage(
  JANKEN_RECORDS_STORAGE_KEY,
  createEmptyRecords(),
  recordsStorage,
  { getOnInit: true },
)

export const acchiRecordsAtom = atomWithStorage(
  ACCHI_RECORDS_STORAGE_KEY,
  createEmptyRecords(),
  recordsStorage,
  { getOnInit: true },
)

export function appendSession(
  current: RecordsStore,
  input: {
    accuracy: number
    averageResponseMs: number
    correctCount: number
    totalRounds?: number
    playedAt?: string
  },
): RecordsStore {
  const session: SessionRecord = {
    accuracy: input.accuracy,
    averageResponseMs: input.averageResponseMs,
    correctCount: input.correctCount,
    totalRounds: input.totalRounds ?? TOTAL_ROUNDS,
    playedAt: input.playedAt ?? new Date().toISOString(),
  }

  const sessions = [session, ...current.sessions].slice(0, MAX_SESSIONS)
  const bestAccuracy = Math.max(current.bestAccuracy, session.accuracy)
  const bestAverageResponseMs =
    current.bestAverageResponseMs === null
      ? session.averageResponseMs
      : Math.min(current.bestAverageResponseMs, session.averageResponseMs)

  return {
    sessions,
    bestAccuracy,
    bestAverageResponseMs,
  }
}

export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy * 100)}%`
}

export function formatResponseMs(ms: number): string {
  return `${(ms / 1000).toFixed(2)}秒`
}
