import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  HAND_VALUES,
  INSTRUCTION_VALUES,
  TOTAL_ROUNDS,
  getCorrectHand,
  pickRandom,
  randomDelayMs,
  summarizeResults,
  type Hand,
  type Instruction,
  type RoundResult,
} from '#/lib/janken'
import { appendSession, jankenRecordsAtom, type RecordsStore } from '#/lib/records'

type GamePhase = 'idle' | 'waiting' | 'answering' | 'feedback' | 'result'

type GameState = {
  phase: GamePhase
  round: number
  instruction: Instruction | null
  systemHand: Hand | null
  lastResult: RoundResult | null
  results: RoundResult[]
}

const FEEDBACK_MS = 700

function createIdleState(): GameState {
  return {
    phase: 'idle',
    round: 0,
    instruction: null,
    systemHand: null,
    lastResult: null,
    results: [],
  }
}

export function useJankenGame() {
  const [records, setRecords] = useAtom(jankenRecordsAtom)
  const [state, setState] = useState<GameState>(createIdleState)
  const phaseRef = useRef<GamePhase>(state.phase)
  const resultsRef = useRef<RoundResult[]>([])
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const promptShownAtRef = useRef<number>(0)
  const activeRoundRef = useRef<{ instruction: Instruction; systemHand: Hand } | null>(null)

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
    (roundNumber: number, previousResults: RoundResult[]) => {
      clearTimers()

      const instruction = pickRandom(INSTRUCTION_VALUES)
      const systemHand = pickRandom(HAND_VALUES)
      activeRoundRef.current = { instruction, systemHand }
      resultsRef.current = previousResults
      phaseRef.current = 'waiting'

      setState({
        phase: 'waiting',
        round: roundNumber,
        instruction,
        systemHand: null,
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
          systemHand,
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
    (userHand: Hand) => {
      const active = activeRoundRef.current
      if (!active || phaseRef.current !== 'answering') {
        return
      }

      phaseRef.current = 'feedback'
      const responseMs = Math.max(0, Math.round(performance.now() - promptShownAtRef.current))
      const correct = userHand === getCorrectHand(active.systemHand, active.instruction)
      const result: RoundResult = {
        instruction: active.instruction,
        systemHand: active.systemHand,
        userHand,
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
          const summary = summarizeResults(nextResults)
          setRecords((current: RecordsStore) =>
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
            systemHand: null,
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
    state: { ...state, records },
    startGame,
    answer,
    resetToIdle,
  }
}
