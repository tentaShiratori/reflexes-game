import { atomWithStorage } from 'jotai/utils'
import * as v from 'valibot'
import { TOTAL_ROUNDS } from './janken'

export const RECORDS_STORAGE_KEY = 'reflexes-janken-records'
export const ACCHI_RECORDS_STORAGE_KEY = 'reflexes-acchi-records'
const MAX_SESSIONS = 50

const SessionRecordSchema = v.object({
  accuracy: v.number(),
  averageResponseMs: v.number(),
  correctCount: v.number(),
  totalRounds: v.number(),
  playedAt: v.string(),
})

const RecordsStoreSchema = v.object({
  sessions: v.pipe(
    v.array(v.unknown()),
    v.transform((items) =>
      items.flatMap((item) => {
        const parsed = v.safeParse(SessionRecordSchema, item)
        return parsed.success ? [parsed.output] : []
      }),
    ),
  ),
  bestAccuracy: v.optional(v.number(), 0),
  bestAverageResponseMs: v.optional(v.nullable(v.number()), null),
})

export type SessionRecord = v.InferOutput<typeof SessionRecordSchema>
export type RecordsStore = {
  sessions: SessionRecord[]
  bestAccuracy: number
  bestAverageResponseMs: number | null
}

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
    const parsed = v.safeParse(RecordsStoreSchema, JSON.parse(raw))
    if (!parsed.success) {
      return createEmptyRecords()
    }

    return {
      sessions: parsed.output.sessions,
      bestAccuracy: parsed.output.bestAccuracy,
      bestAverageResponseMs: parsed.output.bestAverageResponseMs,
    }
  } catch {
    return createEmptyRecords()
  }
}

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

const recordsStorage = {
  getItem(key: string, initialValue: RecordsStore) {
    if (typeof localStorage === 'undefined') {
      return initialValue
    }
    return parseRecords(localStorage.getItem(key))
  },
  setItem(key: string, value: RecordsStore) {
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key: string) {
    if (typeof localStorage === 'undefined') {
      return
    }
    localStorage.removeItem(key)
  },
}

export const recordsAtom = atomWithStorage<RecordsStore>(
  RECORDS_STORAGE_KEY,
  createEmptyRecords(),
  recordsStorage,
  { getOnInit: true },
)

export const acchiRecordsAtom = atomWithStorage<RecordsStore>(
  ACCHI_RECORDS_STORAGE_KEY,
  createEmptyRecords(),
  recordsStorage,
  { getOnInit: true },
)

export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy * 100)}%`
}

export function formatResponseMs(ms: number): string {
  return `${(ms / 1000).toFixed(2)}秒`
}
