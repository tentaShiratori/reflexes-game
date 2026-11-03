import { describe, expect, it } from 'vite-plus/test'
import {
  ACCHI_INSTRUCTIONS,
  DIRECTIONS,
  acchiInstructionLabel,
  directionLabel,
  isCorrectDirection,
  summarizeResults,
  type AcchiRoundResult,
} from './acchi'

describe('isCorrectDirection', () => {
  it('requires the same direction for match', () => {
    expect(isCorrectDirection(DIRECTIONS.UP, DIRECTIONS.UP, ACCHI_INSTRUCTIONS.MATCH)).toBe(true)
    expect(isCorrectDirection(DIRECTIONS.UP, DIRECTIONS.DOWN, ACCHI_INSTRUCTIONS.MATCH)).toBe(false)
  })

  it('requires a different direction for avoid', () => {
    expect(isCorrectDirection(DIRECTIONS.LEFT, DIRECTIONS.RIGHT, ACCHI_INSTRUCTIONS.AVOID)).toBe(
      true,
    )
    expect(isCorrectDirection(DIRECTIONS.LEFT, DIRECTIONS.LEFT, ACCHI_INSTRUCTIONS.AVOID)).toBe(
      false,
    )
  })
})

describe('labels', () => {
  it('returns Japanese labels for directions and instructions', () => {
    expect(directionLabel(DIRECTIONS.UP)).toBe('上')
    expect(acchiInstructionLabel(ACCHI_INSTRUCTIONS.AVOID)).toBe('違う方向')
  })
})

describe('summarizeResults for acchi rounds', () => {
  it('aggregates accuracy and average response time', () => {
    const results: AcchiRoundResult[] = [
      {
        instruction: ACCHI_INSTRUCTIONS.MATCH,
        systemDirection: DIRECTIONS.UP,
        userDirection: DIRECTIONS.UP,
        correct: true,
        responseMs: 200,
      },
      {
        instruction: ACCHI_INSTRUCTIONS.AVOID,
        systemDirection: DIRECTIONS.DOWN,
        userDirection: DIRECTIONS.DOWN,
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
