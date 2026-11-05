import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'
import { randomDelayMs } from '#/lib/janken'
import { appendMeasurement, reactionRecordsAtom } from '#/lib/reactionRecords'

export type ReactionPhase = 'idle' | 'waiting' | 'ready' | 'result'

type ReactionState = {
  phase: ReactionPhase
  lastMs: number | null
  tooEarly: boolean
}

function createIdleState(): ReactionState {
  return {
    phase: 'idle',
    lastMs: null,
    tooEarly: false,
  }
}

export function useReactionGame() {
  const [records, setRecords] = useAtom(reactionRecordsAtom)
  const [state, setState] = useState<ReactionState>(createIdleState)
  const phaseRef = useRef<ReactionPhase>(state.phase)
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
    (options?: { tooEarly?: boolean }) => {
      clearTimers()
      phaseRef.current = 'waiting'
      setState({
        phase: 'waiting',
        lastMs: null,
        tooEarly: options?.tooEarly ?? false,
      })

      const delay = randomDelayMs()
      waitTimerRef.current = setTimeout(() => {
        readyAtRef.current = performance.now()
        phaseRef.current = 'ready'
        setState({
          phase: 'ready',
          lastMs: null,
          tooEarly: false,
        })
      }, delay)
    },
    [clearTimers],
  )

  const startGame = useCallback(() => {
    beginWaiting()
  }, [beginWaiting])

  const handleSurfaceClick = useCallback(() => {
    if (phaseRef.current === 'waiting') {
      beginWaiting({ tooEarly: true })
      return
    }

    if (phaseRef.current !== 'ready') {
      return
    }

    clearTimers()
    const ms = Math.max(0, Math.round(performance.now() - readyAtRef.current))
    setRecords((current) => appendMeasurement(current, { ms }))
    phaseRef.current = 'result'
    setState({
      phase: 'result',
      lastMs: ms,
      tooEarly: false,
    })
  }, [beginWaiting, clearTimers, setRecords])

  const resetToIdle = useCallback(() => {
    clearTimers()
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
