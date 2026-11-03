import { describe, expect, it, vi } from 'vite-plus/test'
import {
  HANDS,
  INSTRUCTIONS,
  getCorrectHand,
  getHandLabel,
  getInstructionLabel,
  pickRandom,
  randomDelayMs,
  summarizeResults,
  type RoundResult,
} from './janken'

describe('getCorrectHand', () => {
  it('returns the same hand for draw', () => {
    expect(getCorrectHand(HANDS.ROCK, INSTRUCTIONS.DRAW)).toBe(HANDS.ROCK)
    expect(getCorrectHand(HANDS.SCISSORS, INSTRUCTIONS.DRAW)).toBe(HANDS.SCISSORS)
    expect(getCorrectHand(HANDS.PAPER, INSTRUCTIONS.DRAW)).toBe(HANDS.PAPER)
  })

  it('returns the winning hand for win', () => {
    expect(getCorrectHand(HANDS.ROCK, INSTRUCTIONS.WIN)).toBe(HANDS.PAPER)
    expect(getCorrectHand(HANDS.SCISSORS, INSTRUCTIONS.WIN)).toBe(HANDS.ROCK)
    expect(getCorrectHand(HANDS.PAPER, INSTRUCTIONS.WIN)).toBe(HANDS.SCISSORS)
  })

  it('returns the losing hand for lose', () => {
    expect(getCorrectHand(HANDS.ROCK, INSTRUCTIONS.LOSE)).toBe(HANDS.SCISSORS)
    expect(getCorrectHand(HANDS.SCISSORS, INSTRUCTIONS.LOSE)).toBe(HANDS.PAPER)
    expect(getCorrectHand(HANDS.PAPER, INSTRUCTIONS.LOSE)).toBe(HANDS.ROCK)
  })
})

describe('labels', () => {
  it('returns japanese labels for hands and instructions', () => {
    expect(getHandLabel(HANDS.ROCK)).toBe('グー')
    expect(getInstructionLabel(INSTRUCTIONS.LOSE)).toBe('負けて')
  })
})

describe('pickRandom', () => {
  it('returns an item from the list', () => {
    const items = ['a', 'b', 'c'] as const
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(pickRandom(items)).toBe('b')
  })
})

describe('randomDelayMs', () => {
  it('returns a value within the requested range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(randomDelayMs(1000, 3000)).toBe(1000)

    vi.spyOn(Math, 'random').mockReturnValue(0.9995)
    const delay = randomDelayMs(1000, 3000)
    expect(delay).toBeGreaterThanOrEqual(1000)
    expect(delay).toBeLessThanOrEqual(3000)
  })
})

describe('summarizeResults', () => {
  it('returns zeros for an empty list', () => {
    expect(summarizeResults([])).toEqual({
      correctCount: 0,
      totalRounds: 0,
      accuracy: 0,
      averageResponseMs: 0,
    })
  })

  it('aggregates accuracy and average response time', () => {
    const results: RoundResult[] = [
      {
        instruction: INSTRUCTIONS.WIN,
        systemHand: HANDS.ROCK,
        userHand: HANDS.PAPER,
        correct: true,
        responseMs: 200,
      },
      {
        instruction: INSTRUCTIONS.LOSE,
        systemHand: HANDS.ROCK,
        userHand: HANDS.ROCK,
        correct: false,
        responseMs: 400,
      },
    ]

    expect(summarizeResults(results)).toEqual({
      correctCount: 1,
      totalRounds: 2,
      accuracy: 0.5,
      averageResponseMs: 300,
    })
  })
})
