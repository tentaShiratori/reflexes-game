import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ACCHI_INSTRUCTION_VALUES,
  DIRECTION_VALUES,
  TOTAL_ROUNDS,
  isCorrectDirection,
  pickRandom,
  randomDelayMs,
  summarizeAcchiResults,
  type AcchiInstruction,
  type AcchiRoundResult,
  type Direction,
} from '#/lib/acchi'
import { acchiRecordsAtom, appendSession } from '#/lib/records'

type GamePhase = 'idle' | 'waiting' | 'answering' | 'feedback' | 'result'

type GameState = {
  phase: GamePhase
  round: number
  instruction: AcchiInstruction | null
  systemDirection: Direction | null
  lastResult: AcchiRoundResult | null
  results: AcchiRoundResult[]
}

const FEEDBACK_MS = 700

function createIdleState(): GameState {
  return {
    phase: 'idle',
    round: 0,
    instruction: null,
    systemDirection: null,
    lastResult: null,
    results: [],
  }
}

export function useAcchiGame() {
  const [records, setRecords] = useAtom(acchiRecordsAtom)
  const [state, setState] = useState<GameState>(createIdleState)
  const phaseRef = useRef<GamePhase>(state.phase)
  const resultsRef = useRef<AcchiRoundResult[]>([])
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const promptShownAtRef = useRef<number>(0)
  const activeRoundRef = useRef<{
    instruction: AcchiInstruction
    systemDirection: Direction
  } | null>(null)

  const clearTimers = useCallback(() => {
    if (revealTimerRef.current !== null) {
      clearTimeout(revealTimerRef.current)
      revealTimerRef.current = null
    }
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current)
      feedbackTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    phaseRef.current = state.phase
  }, [state.phase])

  useEffect(() => clearTimers, [clearTimers])

  const beginRound = useCallback(
    (roundNumber: number, previousResults: AcchiRoundResult[]) => {
      clearTimers()

      const instruction = pickRandom(ACCHI_INSTRUCTION_VALUES)
      const systemDirection = pickRandom(DIRECTION_VALUES)
      activeRoundRef.current = { instruction, systemDirection }
      resultsRef.current = previousResults
      phaseRef.current = 'waiting'

      setState({
        phase: 'waiting',
        round: roundNumber,
        instruction,
        systemDirection: null,
        lastResult: null,
        results: previousResults,
      })

      const delay = randomDelayMs()
      revealTimerRef.current = setTimeout(() => {
        promptShownAtRef.current = performance.now()
        phaseRef.current = 'answering'
        setState((current) => ({
          ...current,
          phase: 'answering',
          systemDirection,
        }))
      }, delay)
    },
    [clearTimers],
  )

  const startGame = useCallback(() => {
    resultsRef.current = []
    beginRound(1, [])
  }, [beginRound])

  const answer = useCallback(
    (userDirection: Direction) => {
      const active = activeRoundRef.current
      if (!active || phaseRef.current !== 'answering') {
        return
      }

      phaseRef.current = 'feedback'
      const responseMs = Math.max(0, Math.round(performance.now() - promptShownAtRef.current))
      const correct = isCorrectDirection(active.systemDirection, userDirection, active.instruction)
      const result: AcchiRoundResult = {
        instruction: active.instruction,
        systemDirection: active.systemDirection,
        userDirection,
        correct,
        responseMs,
      }
      const nextResults = [...resultsRef.current, result]
      resultsRef.current = nextResults

      setState((current) => ({
        ...current,
        phase: 'feedback',
        lastResult: result,
        results: nextResults,
      }))

      feedbackTimerRef.current = setTimeout(() => {
        if (nextResults.length >= TOTAL_ROUNDS) {
          const summary = summarizeAcchiResults(nextResults)
          setRecords((current) =>
            appendSession(current, {
              accuracy: summary.accuracy,
              averageResponseMs: summary.averageResponseMs,
              correctCount: summary.correctCount,
              totalRounds: summary.totalRounds,
            }),
          )

          phaseRef.current = 'result'
          setState((current) => ({
            ...current,
            phase: 'result',
            instruction: null,
            systemDirection: null,
          }))
          return
        }

        beginRound(nextResults.length + 1, nextResults)
      }, FEEDBACK_MS)
    },
    [beginRound, setRecords],
  )

  const resetToIdle = useCallback(() => {
    clearTimers()
    activeRoundRef.current = null
    resultsRef.current = []
    phaseRef.current = 'idle'
    setState(createIdleState())
  }, [clearTimers])

  return {
    state,
    records,
    startGame,
    answer,
    resetToIdle,
  }
}
