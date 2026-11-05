import styled, { keyframes } from 'styled-components'
import { ResponseTimeChart } from '#/components/ResponseTimeChart'
import { toChartSeries } from '#/lib/chartSeries'
import { GameBrand } from './GameBrand'
import { IdlePanel } from './IdlePanel'
import { PlaySurface } from './PlaySurface'
import { ResultPanel } from './ResultPanel'
import { useReactionGame } from './useReactionGame'

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
    radial-gradient(circle at 18% 20%, rgba(185, 28, 28, 0.16), transparent 34%),
    radial-gradient(circle at 86% 14%, rgba(22, 163, 74, 0.16), transparent 30%),
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

export function ReactionGame() {
  const { state, records, startGame, handleSurfaceClick, retry, resetToIdle } = useReactionGame()
  const chartValues = toChartSeries(records.measurements.map((item) => item.ms))

  return (
    <Shell>
      <Atmosphere aria-hidden="true" />

      <Stage>
        <GameBrand />

        {state.phase === 'idle' ? (
          <>
            <ResponseTimeChart values={chartValues} title="直近の反応時間" />
            <IdlePanel records={records} onStart={startGame} />
          </>
        ) : null}

        {state.phase === 'waiting' || state.phase === 'ready' ? (
          <PlaySurface phase={state.phase} tooEarly={state.tooEarly} onClick={handleSurfaceClick} />
        ) : null}

        {state.phase === 'result' && state.lastMs !== null ? (
          <ResultPanel
            ms={state.lastMs}
            bestMs={records.bestMs}
            onRetry={retry}
            onReset={resetToIdle}
          />
        ) : null}
      </Stage>
    </Shell>
  )
}
