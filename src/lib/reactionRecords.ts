import { atomWithStorage } from 'jotai/utils'
import * as v from 'valibot'

export const REACTION_RECORDS_STORAGE_KEY = 'reflexes-reaction-records'
const MAX_REACTION_MEASUREMENTS = 20

const MeasurementSchema = v.object({
  ms: v.number(),
  playedAt: v.string(),
})

const ReactionRecordsStoreSchema = v.object({
  measurements: v.pipe(
    v.array(v.unknown()),
    v.transform((items) =>
      items.flatMap((item) => {
        const parsed = v.safeParse(MeasurementSchema, item)
        return parsed.success ? [parsed.output] : []
      }),
    ),
  ),
  bestMs: v.optional(v.nullable(v.number()), null),
})

export type ReactionMeasurement = v.InferOutput<typeof MeasurementSchema>
export type ReactionRecordsStore = {
  measurements: ReactionMeasurement[]
  bestMs: number | null
}

export function createEmptyReactionRecords(): ReactionRecordsStore {
  return {
    measurements: [],
    bestMs: null,
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
      measurements: parsed.output.measurements.slice(0, MAX_REACTION_MEASUREMENTS),
      bestMs: parsed.output.bestMs,
    }
  } catch {
    return createEmptyReactionRecords()
  }
}

export function appendMeasurement(
  current: ReactionRecordsStore,
  input: {
    ms: number
    playedAt?: string
  },
): ReactionRecordsStore {
  const measurement: ReactionMeasurement = {
    ms: input.ms,
    playedAt: input.playedAt ?? new Date().toISOString(),
  }

  const measurements = [measurement, ...current.measurements].slice(0, MAX_REACTION_MEASUREMENTS)
  const bestMs = current.bestMs === null ? measurement.ms : Math.min(current.bestMs, measurement.ms)

  return {
    measurements,
    bestMs,
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
