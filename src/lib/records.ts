import { TOTAL_ROUNDS } from './janken'

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

export const RECORDS_STORAGE_KEY = 'reflexes-janken-records'
const MAX_SESSIONS = 50

export function createEmptyRecords(): RecordsStore {
  return {
    sessions: [],
    bestAccuracy: 0,
    bestAverageResponseMs: null,
  }
}

function isSessionRecord(value: unknown): value is SessionRecord {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  return (
    typeof record.accuracy === 'number' &&
    typeof record.averageResponseMs === 'number' &&
    typeof record.correctCount === 'number' &&
    typeof record.totalRounds === 'number' &&
    typeof record.playedAt === 'string'
  )
}

export function parseRecords(raw: string | null): RecordsStore {
  if (!raw) {
    return createEmptyRecords()
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) {
      return createEmptyRecords()
    }

    const data = parsed as Record<string, unknown>
    const sessions = Array.isArray(data.sessions) ? data.sessions.filter(isSessionRecord) : []

    return {
      sessions,
      bestAccuracy: typeof data.bestAccuracy === 'number' ? data.bestAccuracy : 0,
      bestAverageResponseMs:
        typeof data.bestAverageResponseMs === 'number' ? data.bestAverageResponseMs : null,
    }
  } catch {
    return createEmptyRecords()
  }
}

export function loadRecords(storage: Storage = localStorage): RecordsStore {
  return parseRecords(storage.getItem(RECORDS_STORAGE_KEY))
}

export function saveSession(
  input: {
    accuracy: number
    averageResponseMs: number
    correctCount: number
    totalRounds?: number
    playedAt?: string
  },
  storage: Storage = localStorage,
): RecordsStore {
  const current = loadRecords(storage)
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

  const next: RecordsStore = {
    sessions,
    bestAccuracy,
    bestAverageResponseMs,
  }

  storage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy * 100)}%`
}

export function formatResponseMs(ms: number): string {
  return `${(ms / 1000).toFixed(2)}秒`
}
