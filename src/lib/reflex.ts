export const TOTAL_ROUNDS = 10
const MIN_DELAY_MS = 1000
const MAX_DELAY_MS = 3000

export type TimedRoundResult = {
  correct: boolean
  responseMs: number
}

export function pickRandom<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length)
  return items[index]!
}

export function randomDelayMs(minMs: number = MIN_DELAY_MS, maxMs: number = MAX_DELAY_MS): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

export function summarizeResults(results: TimedRoundResult[]) {
  const correctCount = results.filter((result) => result.correct).length
  const totalRounds = results.length
  const accuracy = totalRounds === 0 ? 0 : correctCount / totalRounds
  const averageResponseMs =
    totalRounds === 0
      ? 0
      : Math.round(results.reduce((sum, result) => sum + result.responseMs, 0) / totalRounds)

  return { correctCount, totalRounds, accuracy, averageResponseMs }
}
