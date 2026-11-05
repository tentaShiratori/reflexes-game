import styled, { keyframes } from 'styled-components'
import { ResponseTimeChart } from '#/components/ResponseTimeChart'
import { summarizeAcchiResults } from '#/lib/acchi'
import { toChartSeries } from '#/lib/chartSeries'
import { GameBrand } from './GameBrand'
import { IdlePanel } from './IdlePanel'
import { PlayPanel } from './PlayPanel'
import { ResultPanel } from './ResultPanel'
import { useAcchiGame } from './useAcchiGame'

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
    radial-gradient(circle at 14% 16%, rgba(217, 119, 6, 0.24), transparent 34%),
    radial-gradient(circle at 86% 14%, rgba(15, 143, 123, 0.2), transparent 30%),
    linear-gradient(155deg, #f7f3ea 0%, #f8fafc 48%, #eaf4f1 100%);
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

export function AcchiGame() {
  const { state, records, startGame, answer, resetToIdle } = useAcchiGame()
  const summary = summarizeAcchiResults(state.results)
  const chartValues = toChartSeries(records.sessions.map((session) => session.averageResponseMs))

  return (
    <Shell>
      <Atmosphere aria-hidden="true" />

      <Stage>
        <GameBrand />

        {state.phase === 'idle' ? (
          <>
            <ResponseTimeChart values={chartValues} title="直近の平均反応時間" />
            <IdlePanel records={records} onStart={startGame} />
          </>
        ) : null}

        {state.phase === 'waiting' || state.phase === 'answering' || state.phase === 'feedback' ? (
          <PlayPanel
            phase={state.phase}
            round={state.round}
            instruction={state.instruction}
            systemDirection={state.systemDirection}
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
      </Stage>
    </Shell>
  )
}
