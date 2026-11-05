import styled, { keyframes } from 'styled-components'

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Panel = styled.section`
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  padding: 1.25rem 1.5rem 1.4rem;
  animation: ${riseIn} 0.55s ease both;
`

const Heading = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 1rem;
  letter-spacing: 0.08em;
`

const ChartFrame = styled.div`
  width: 100%;
  overflow: hidden;
`

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
`

const WIDTH = 320
const HEIGHT = 120
const PAD_X = 12
const PAD_Y = 14

function buildPoints(values: readonly number[]): string {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = Math.max(max - min, 1)
  const innerWidth = WIDTH - PAD_X * 2
  const innerHeight = HEIGHT - PAD_Y * 2
  const step = values.length === 1 ? 0 : innerWidth / (values.length - 1)

  return values
    .map((value, index) => {
      const x = PAD_X + step * index
      const y = PAD_Y + innerHeight - ((value - min) / span) * innerHeight
      return `${x},${y}`
    })
    .join(' ')
}

export function ResponseTimeChart({
  values,
  title = '直近の反応時間',
}: {
  values: readonly number[]
  title?: string
}) {
  if (values.length === 0) {
    return null
  }

  const points = buildPoints(values)
  const last = values[values.length - 1]!
  const firstPoint = points.split(' ')[0]!
  const [firstX, firstY] = firstPoint.split(',')

  return (
    <Panel aria-labelledby="response-chart-heading" data-testid="response-time-chart">
      <Heading id="response-chart-heading">{title}</Heading>
      <ChartFrame>
        <Svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${title}の折れ線グラフ`}>
          <polyline
            fill="none"
            stroke="var(--accent-deep)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
          {values.length === 1 ? (
            <circle cx={firstX} cy={firstY} r="4" fill="var(--accent)" />
          ) : null}
          <text
            x={WIDTH - PAD_X}
            y={HEIGHT - 2}
            textAnchor="end"
            fontSize="10"
            fill="var(--ink-soft)"
          >
            最新 {Math.round(last)}ms
          </text>
        </Svg>
      </ChartFrame>
    </Panel>
  )
}
