import styled, { keyframes } from 'styled-components'
import { summarizeResults } from '#/lib/janken'
import { GameBrand } from './GameBrand'
import { HistoryPanel } from './HistoryPanel'
import { IdlePanel } from './IdlePanel'
import { PlayPanel } from './PlayPanel'
import { ResultPanel } from './ResultPanel'
import { useJankenGame } from './useJankenGame'

const atmosphereShift = keyframes`
  from {
    filter: hue-rotate(0deg) saturate(1);
  }
  to {
    filter: hue-rotate(8deg) saturate(1.08);
  }
`

const Shell = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`

const Atmosphere = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 12% 18%, rgba(15, 143, 123, 0.22), transparent 34%),
    radial-gradient(circle at 88% 12%, rgba(217, 119, 6, 0.18), transparent 30%),
    linear-gradient(160deg, #eef5fa 0%, #f7fafc 42%, #e7f2ef 100%);
  animation: ${atmosphereShift} 12s ease-in-out infinite alternate;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(16, 35, 63, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16, 35, 63, 0.035) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(circle at center, black 35%, transparent 85%);
  }
`

const Stage = styled.main`
  position: relative;
  z-index: 1;
  width: min(720px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 3.5rem 0 4rem;
  display: grid;
  gap: 1.5rem;

  @media (max-width: 640px) {
    padding-top: 2rem;
  }
`

export function JankenGame() {
  const { state, records, startGame, answer, resetToIdle } = useJankenGame()
  const summary = summarizeResults(state.results)

  return (
    <Shell>
      <Atmosphere aria-hidden="true" />

      <Stage>
        <GameBrand />

        {state.phase === 'idle' ? <IdlePanel records={records} onStart={startGame} /> : null}

        {state.phase === 'waiting' || state.phase === 'answering' || state.phase === 'feedback' ? (
          <PlayPanel
            phase={state.phase}
            round={state.round}
            instruction={state.instruction}
            systemHand={state.systemHand}
            lastResult={state.lastResult}
            onAnswer={answer}
          />
        ) : null}

        {state.phase === 'result' ? (
          <ResultPanel
            accuracy={summary.accuracy}
            averageResponseMs={summary.averageResponseMs}
            correctCount={summary.correctCount}
            totalRounds={summary.totalRounds}
            onRetry={startGame}
            onReset={resetToIdle}
          />
        ) : null}

        {records.sessions.length > 0 && state.phase === 'idle' ? (
          <HistoryPanel sessions={records.sessions} />
        ) : null}
      </Stage>
    </Shell>
  )
}
