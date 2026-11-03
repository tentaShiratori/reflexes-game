import { TOTAL_ROUNDS, pickRandom, randomDelayMs, summarizeResults } from './reflex'

export const HANDS = {
  ROCK: 'rock',
  SCISSORS: 'scissors',
  PAPER: 'paper',
} as const

export type Hand = (typeof HANDS)[keyof typeof HANDS]

export const INSTRUCTIONS = {
  LOSE: 'lose',
  WIN: 'win',
  DRAW: 'draw',
} as const

export type Instruction = (typeof INSTRUCTIONS)[keyof typeof INSTRUCTIONS]

export const HAND_VALUES = Object.values(HANDS)
export const INSTRUCTION_VALUES = Object.values(INSTRUCTIONS)

export function handLabel(hand: Hand): string {
  switch (hand) {
    case HANDS.ROCK:
      return 'グー'
    case HANDS.SCISSORS:
      return 'チョキ'
    case HANDS.PAPER:
      return 'パー'
  }
}

export function instructionLabel(instruction: Instruction): string {
  switch (instruction) {
    case INSTRUCTIONS.LOSE:
      return '負けて'
    case INSTRUCTIONS.WIN:
      return '勝って'
    case INSTRUCTIONS.DRAW:
      return 'あいこで'
  }
}

/** その手が勝つ相手 */
const BEATS: Record<Hand, Hand> = {
  [HANDS.ROCK]: HANDS.SCISSORS,
  [HANDS.SCISSORS]: HANDS.PAPER,
  [HANDS.PAPER]: HANDS.ROCK,
}

/** その手に勝つ手 */
const BEATEN_BY: Record<Hand, Hand> = {
  [HANDS.ROCK]: HANDS.PAPER,
  [HANDS.SCISSORS]: HANDS.ROCK,
  [HANDS.PAPER]: HANDS.SCISSORS,
}

export { TOTAL_ROUNDS, pickRandom, randomDelayMs, summarizeResults }

export function getCorrectHand(systemHand: Hand, instruction: Instruction): Hand {
  switch (instruction) {
    case INSTRUCTIONS.DRAW:
      return systemHand
    case INSTRUCTIONS.WIN:
      return BEATEN_BY[systemHand]
    case INSTRUCTIONS.LOSE:
      return BEATS[systemHand]
  }
}

export type RoundResult = {
  instruction: Instruction
  systemHand: Hand
  userHand: Hand
  correct: boolean
  responseMs: number
}
