import { describe, expect, it, vi } from 'vite-plus/test'
import {
  getCorrectHand,
  pickRandom,
  randomDelayMs,
  summarizeResults,
  type RoundResult,
} from './janken'

describe('getCorrectHand', () => {
  it('returns the same hand for draw', () => {
    expect(getCorrectHand('rock', 'draw')).toBe('rock')
    expect(getCorrectHand('scissors', 'draw')).toBe('scissors')
    expect(getCorrectHand('paper', 'draw')).toBe('paper')
  })

  it('returns the winning hand for win', () => {
    expect(getCorrectHand('rock', 'win')).toBe('paper')
    expect(getCorrectHand('scissors', 'win')).toBe('rock')
    expect(getCorrectHand('paper', 'win')).toBe('scissors')
  })

  it('returns the losing hand for lose', () => {
    expect(getCorrectHand('rock', 'lose')).toBe('scissors')
    expect(getCorrectHand('scissors', 'lose')).toBe('paper')
    expect(getCorrectHand('paper', 'lose')).toBe('rock')
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
        instruction: 'win',
        systemHand: 'rock',
        userHand: 'paper',
        correct: true,
        responseMs: 200,
      },
      {
        instruction: 'lose',
        systemHand: 'rock',
        userHand: 'rock',
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
