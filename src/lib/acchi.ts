import { TOTAL_ROUNDS, pickRandom, randomDelayMs, summarizeResults } from './reflex'

export type Direction = 'up' | 'down' | 'left' | 'right'
export type AcchiInstruction = 'match' | 'avoid'

export const DIRECTIONS = ['up', 'down', 'left', 'right'] as const
export const ACCHI_INSTRUCTIONS = ['match', 'avoid'] as const

export const DIRECTION_LABELS: Record<Direction, string> = {
  up: '上',
  down: '下',
  left: '左',
  right: '右',
}

export const DIRECTION_SYMBOLS: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
}

export const ACCHI_INSTRUCTION_LABELS: Record<AcchiInstruction, string> = {
  match: '同じ方向',
  avoid: '違う方向',
}

export { TOTAL_ROUNDS, pickRandom, randomDelayMs, summarizeResults }

export function isCorrectDirection(
  systemDirection: Direction,
  userDirection: Direction,
  instruction: AcchiInstruction,
): boolean {
  if (instruction === 'match') {
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
