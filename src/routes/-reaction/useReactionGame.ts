import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { randomDelayMs } from '#/lib/janken'
import {
  TRIALS_PER_GAME,
  appendGame,
  averageTrialMs,
  reactionRecordsAtom,
} from '#/lib/reactionRecords'

export type ReactionPhase = 'idle' | 'waiting' | 'ready' | 'result'

type ReactionState = {
  phase: ReactionPhase
  trialMs: number[]
  averageMs: number | null
  tooEarly: boolean
}

function createIdleState(): ReactionState {
  return {
    phase: 'idle',
    trialMs: [],
    averageMs: null,
    tooEarly: false,
  }
}

export function useReactionGame() {
  const [records, setRecords] = useAtom(reactionRecordsAtom)
  const [state, setState] = useState<ReactionState>(createIdleState)
  const phaseRef = useRef<ReactionPhase>(state.phase)
  const trialMsRef = useRef<number[]>([])
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const readyAtRef = useRef<number>(0)

  const clearTimers = useCallback(() => {
    if (waitTimerRef.current !== null) {
      clearTimeout(waitTimerRef.current)
      waitTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    phaseRef.current = state.phase
  }, [state.phase])

  useEffect(() => clearTimers, [clearTimers])

  const beginWaiting = useCallback(
    (options?: { tooEarly?: boolean; trialMs?: number[] }) => {
      clearTimers()
      const trialMs = options?.trialMs ?? trialMsRef.current
      trialMsRef.current = trialMs
      phaseRef.current = 'waiting'
      setState({
        phase: 'waiting',
        trialMs,
        averageMs: null,
        tooEarly: options?.tooEarly ?? false,
      })

      const delay = randomDelayMs()
      waitTimerRef.current = setTimeout(() => {
        readyAtRef.current = performance.now()
        phaseRef.current = 'ready'
        setState({
          phase: 'ready',
          trialMs,
          averageMs: null,
          tooEarly: false,
        })
      }, delay)
    },
    [clearTimers],
  )

  const startGame = useCallback(() => {
    trialMsRef.current = []
    beginWaiting({ trialMs: [] })
  }, [beginWaiting])

  const handleSurfaceClick = useCallback(() => {
    if (phaseRef.current === 'waiting') {
      beginWaiting({ tooEarly: true, trialMs: trialMsRef.current })
      return
    }

    if (phaseRef.current !== 'ready') {
      return
    }

    clearTimers()
    const ms = Math.max(0, Math.round(performance.now() - readyAtRef.current))
    const nextTrials = [...trialMsRef.current, ms]
    trialMsRef.current = nextTrials

    if (nextTrials.length >= TRIALS_PER_GAME) {
      const averageMs = averageTrialMs(nextTrials)
      setRecords((current) => appendGame(current, { averageMs }))
      phaseRef.current = 'result'
      setState({
        phase: 'result',
        trialMs: nextTrials,
        averageMs,
        tooEarly: false,
      })
      return
    }

    beginWaiting({ trialMs: nextTrials })
  }, [beginWaiting, clearTimers, setRecords])

  const resetToIdle = useCallback(() => {
    clearTimers()
    trialMsRef.current = []
    phaseRef.current = 'idle'
    setState(createIdleState())
  }, [clearTimers])

  return {
    state,
    records,
    startGame,
    handleSurfaceClick,
    retry: startGame,
    resetToIdle,
  }
}
