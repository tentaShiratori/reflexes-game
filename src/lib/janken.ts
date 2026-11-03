export const HANDS = {
  ROCK: 'rock',
  SCISSORS: 'scissors',
  PAPER: 'paper',
} as const

export type HANDS = (typeof HANDS)[keyof typeof HANDS]

export const INSTRUCTIONS = {
  LOSE: 'lose',
  WIN: 'win',
  DRAW: 'draw',
} as const

export type INSTRUCTIONS = (typeof INSTRUCTIONS)[keyof typeof INSTRUCTIONS]

export const TOTAL_ROUNDS = 10
const MIN_DELAY_MS = 1000
const MAX_DELAY_MS = 3000

const HAND_LIST = Object.values(HANDS)
const INSTRUCTION_LIST = Object.values(INSTRUCTIONS)

/** その手が勝つ相手 */
const BEATS: Record<HANDS, HANDS> = {
  [HANDS.ROCK]: HANDS.SCISSORS,
  [HANDS.SCISSORS]: HANDS.PAPER,
  [HANDS.PAPER]: HANDS.ROCK,
}

/** その手に勝つ手 */
const BEATEN_BY: Record<HANDS, HANDS> = {
  [HANDS.ROCK]: HANDS.PAPER,
  [HANDS.SCISSORS]: HANDS.ROCK,
  [HANDS.PAPER]: HANDS.SCISSORS,
}

export function getHandLabel(hand: HANDS): string {
  switch (hand) {
    case HANDS.ROCK:
      return 'グー'
    case HANDS.SCISSORS:
      return 'チョキ'
    case HANDS.PAPER:
      return 'パー'
  }
}

export function getInstructionLabel(instruction: INSTRUCTIONS): string {
  switch (instruction) {
    case INSTRUCTIONS.LOSE:
      return '負けて'
    case INSTRUCTIONS.WIN:
      return '勝って'
    case INSTRUCTIONS.DRAW:
      return 'あいこで'
  }
}

export function listHands(): HANDS[] {
  return HAND_LIST
}

export function listInstructions(): INSTRUCTIONS[] {
  return INSTRUCTION_LIST
}

export function getCorrectHand(systemHand: HANDS, instruction: INSTRUCTIONS): HANDS {
  switch (instruction) {
    case INSTRUCTIONS.DRAW:
      return systemHand
    case INSTRUCTIONS.WIN:
      return BEATEN_BY[systemHand]
    case INSTRUCTIONS.LOSE:
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
  instruction: INSTRUCTIONS
  systemHand: HANDS
  userHand: HANDS
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
