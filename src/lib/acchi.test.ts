import { describe, expect, it } from 'vite-plus/test'
import { isCorrectDirection, summarizeResults, type AcchiRoundResult } from './acchi'

describe('isCorrectDirection', () => {
  it('requires the same direction for match', () => {
    expect(isCorrectDirection('up', 'up', 'match')).toBe(true)
    expect(isCorrectDirection('up', 'down', 'match')).toBe(false)
  })

  it('requires a different direction for avoid', () => {
    expect(isCorrectDirection('left', 'right', 'avoid')).toBe(true)
    expect(isCorrectDirection('left', 'left', 'avoid')).toBe(false)
  })
})

describe('summarizeResults for acchi rounds', () => {
  it('aggregates accuracy and average response time', () => {
    const results: AcchiRoundResult[] = [
      {
        instruction: 'match',
        systemDirection: 'up',
        userDirection: 'up',
        correct: true,
        responseMs: 200,
      },
      {
        instruction: 'avoid',
        systemDirection: 'down',
        userDirection: 'down',
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
