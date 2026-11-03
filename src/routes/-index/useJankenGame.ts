import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  TOTAL_ROUNDS,
  getCorrectHand,
  listHands,
  listInstructions,
  pickRandom,
  randomDelayMs,
  summarizeResults,
  type HANDS,
  type INSTRUCTIONS,
  type RoundResult,
} from '#/lib/janken'
import { appendSession, recordsAtom } from '#/lib/records'

type GamePhase = 'idle' | 'waiting' | 'answering' | 'feedback' | 'result'

type GameState = {
  phase: GamePhase
  round: number
  instruction: INSTRUCTIONS | null
  systemHand: HANDS | null
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
  const [records, setRecords] = useAtom(recordsAtom)
  const [state, setState] = useState<GameState>(createIdleState)
  const phaseRef = useRef<GamePhase>(state.phase)
  const resultsRef = useRef<RoundResult[]>([])
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const promptShownAtRef = useRef<number>(0)
  const activeRoundRef = useRef<{ instruction: INSTRUCTIONS; systemHand: HANDS } | null>(null)

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

      const instruction = pickRandom(listInstructions())
      const systemHand = pickRandom(listHands())
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
    (userHand: HANDS) => {
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
    state,
    records,
    startGame,
    answer,
    resetToIdle,
  }
}
