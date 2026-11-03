export type Hand = 'rock' | 'scissors' | 'paper'
export type Instruction = 'lose' | 'win' | 'draw'

export const HANDS = ['rock', 'scissors', 'paper'] as const
export const INSTRUCTIONS = ['lose', 'win', 'draw'] as const

export const HAND_LABELS: Record<Hand, string> = {
  rock: 'グー',
  scissors: 'チョキ',
  paper: 'パー',
}

export const INSTRUCTION_LABELS: Record<Instruction, string> = {
  lose: '負けて',
  win: '勝って',
  draw: 'あいこで',
}

/** その手が勝つ相手 */
const BEATS: Record<Hand, Hand> = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock',
}

/** その手に勝つ手 */
const BEATEN_BY: Record<Hand, Hand> = {
  rock: 'paper',
  scissors: 'rock',
  paper: 'scissors',
}

export const TOTAL_ROUNDS = 10
const MIN_DELAY_MS = 1000
const MAX_DELAY_MS = 3000

export function getCorrectHand(systemHand: Hand, instruction: Instruction): Hand {
  switch (instruction) {
    case 'draw':
      return systemHand
    case 'win':
      return BEATEN_BY[systemHand]
    case 'lose':
      return BEATS[systemHand]
  }
}

export function pickRandom<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length)
  return items[index]!
}

export function randomDelayMs(minMs: number = MIN_DELAY_MS, maxMs: number = MAX_DELAY_MS): number {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
}

export type RoundResult = {
  instruction: Instruction
  systemHand: Hand
  userHand: Hand
  correct: boolean
  responseMs: number
}

export function summarizeResults(results: RoundResult[]) {
  const correctCount = results.filter((result) => result.correct).length
  const totalRounds = results.length
  const accuracy = totalRounds === 0 ? 0 : correctCount / totalRounds
  const averageResponseMs =
    totalRounds === 0
      ? 0
      : Math.round(results.reduce((sum, result) => sum + result.responseMs, 0) / totalRounds)

  return { correctCount, totalRounds, accuracy, averageResponseMs }
}
