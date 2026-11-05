import { atomWithStorage } from 'jotai/utils'
import * as v from 'valibot'

/** Per-game averages (5 successful trials). Distinct from the old single-click key. */
export const REACTION_RECORDS_STORAGE_KEY = 'reflexes-reaction-game-records'
export const TRIALS_PER_GAME = 5
const MAX_REACTION_GAMES = 20

const GameRecordSchema = v.object({
  averageMs: v.number(),
  playedAt: v.string(),
})

const ReactionRecordsStoreSchema = v.object({
  games: v.pipe(
    v.array(v.unknown()),
    v.transform((items) =>
      items.flatMap((item) => {
        const parsed = v.safeParse(GameRecordSchema, item)
        return parsed.success ? [parsed.output] : []
      }),
    ),
  ),
  bestAverageMs: v.optional(v.nullable(v.number()), null),
})

export type ReactionGameRecord = v.InferOutput<typeof GameRecordSchema>
export type ReactionRecordsStore = {
  games: ReactionGameRecord[]
  bestAverageMs: number | null
}

export function createEmptyReactionRecords(): ReactionRecordsStore {
  return {
    games: [],
    bestAverageMs: null,
  }
}

export function parseReactionRecords(raw: string | null): ReactionRecordsStore {
  if (!raw) {
    return createEmptyReactionRecords()
  }

  try {
    const parsed = v.safeParse(ReactionRecordsStoreSchema, JSON.parse(raw))
    if (!parsed.success) {
      return createEmptyReactionRecords()
    }

    return {
      games: parsed.output.games.slice(0, MAX_REACTION_GAMES),
      bestAverageMs: parsed.output.bestAverageMs,
    }
  } catch {
    return createEmptyReactionRecords()
  }
}

export function averageTrialMs(trialMs: readonly number[]): number {
  if (trialMs.length === 0) {
    return 0
  }
  return Math.round(trialMs.reduce((sum, ms) => sum + ms, 0) / trialMs.length)
}

export function appendGame(
  current: ReactionRecordsStore,
  input: {
    averageMs: number
    playedAt?: string
  },
): ReactionRecordsStore {
  const game: ReactionGameRecord = {
    averageMs: input.averageMs,
    playedAt: input.playedAt ?? new Date().toISOString(),
  }

  const games = [game, ...current.games].slice(0, MAX_REACTION_GAMES)
  const bestAverageMs =
    current.bestAverageMs === null
      ? game.averageMs
      : Math.min(current.bestAverageMs, game.averageMs)

  return {
    games,
    bestAverageMs,
  }
}

export const reactionRecordsAtom = atomWithStorage<ReactionRecordsStore>(
  REACTION_RECORDS_STORAGE_KEY,
  createEmptyReactionRecords(),
  {
    getItem(key, initialValue) {
      if (typeof localStorage === 'undefined') {
        return initialValue
      }
      return parseReactionRecords(localStorage.getItem(key))
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
  },
  { getOnInit: true },
)

export function formatReactionMs(ms: number): string {
  return `${ms}ms`
}
