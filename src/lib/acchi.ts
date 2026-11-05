import { TOTAL_ROUNDS, pickRandom, randomDelayMs } from './janken'

export const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
} as const

export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS]

export const ACCHI_INSTRUCTIONS = {
  MATCH: 'match',
  AVOID: 'avoid',
} as const

export type AcchiInstruction = (typeof ACCHI_INSTRUCTIONS)[keyof typeof ACCHI_INSTRUCTIONS]

export const DIRECTION_VALUES = Object.values(DIRECTIONS)
export const ACCHI_INSTRUCTION_VALUES = Object.values(ACCHI_INSTRUCTIONS)

export function directionLabel(direction: Direction): string {
  switch (direction) {
    case DIRECTIONS.UP:
      return '上'
    case DIRECTIONS.DOWN:
      return '下'
    case DIRECTIONS.LEFT:
      return '左'
    case DIRECTIONS.RIGHT:
      return '右'
  }
}

export function directionSymbol(direction: Direction): string {
  switch (direction) {
    case DIRECTIONS.UP:
      return '↑'
    case DIRECTIONS.DOWN:
      return '↓'
    case DIRECTIONS.LEFT:
      return '←'
    case DIRECTIONS.RIGHT:
      return '→'
  }
}

export function acchiInstructionLabel(instruction: AcchiInstruction): string {
  switch (instruction) {
    case ACCHI_INSTRUCTIONS.MATCH:
      return '同じ方向'
    case ACCHI_INSTRUCTIONS.AVOID:
      return '違う方向'
  }
}

export { TOTAL_ROUNDS, pickRandom, randomDelayMs }

export function isCorrectDirection(
  systemDirection: Direction,
  userDirection: Direction,
  instruction: AcchiInstruction,
): boolean {
  if (instruction === ACCHI_INSTRUCTIONS.MATCH) {
    return userDirection === systemDirection
  }
  return userDirection !== systemDirection
}

export type AcchiRoundResult = {
  instruction: AcchiInstruction
  systemDirection: Direction
  userDirection: Direction
  correct: boolean
  responseMs: number
}

export function summarizeAcchiResults(results: AcchiRoundResult[]) {
  const correctCount = results.filter((result) => result.correct).length
  const totalRounds = results.length
  const accuracy = totalRounds === 0 ? 0 : correctCount / totalRounds
  const averageResponseMs =
    totalRounds === 0
      ? 0
      : Math.round(results.reduce((sum, result) => sum + result.responseMs, 0) / totalRounds)

  return { correctCount, totalRounds, accuracy, averageResponseMs }
}
