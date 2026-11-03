import styled, { keyframes } from 'styled-components'
import { formatAccuracy, formatResponseMs } from '#/lib/records'
import { GhostButton } from './GhostButton'
import { PrimaryButton } from './PrimaryButton'
import { RecordGrid } from './RecordGrid'

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
  padding: 1.5rem;
  animation: ${riseIn} 0.55s ease both;
`

const Heading = styled.h2`
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 2rem;
`

const Copy = styled.p`
  margin: 0;
  color: var(--ink-soft);
  line-height: 1.7;
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`

export function ResultPanel({
  accuracy,
  averageResponseMs,
  correctCount,
  totalRounds,
  onRetry,
  onReset,
}: {
  accuracy: number
  averageResponseMs: number
  correctCount: number
  totalRounds: number
  onRetry: () => void
  onReset: () => void
}) {
  return (
    <Panel aria-labelledby="result-heading">
      <Heading id="result-heading">結果</Heading>
      <RecordGrid
        items={[
          {
            label: '正答率',
            value: formatAccuracy(accuracy),
            valueTestId: 'result-accuracy',
          },
          {
            label: '平均回答速度',
            value: formatResponseMs(averageResponseMs),
            valueTestId: 'result-speed',
          },
          {
            label: '正解数',
            value: `${correctCount} / ${totalRounds}`,
          },
        ]}
      />
      <Copy>記録はブラウザの localStorage に保存しました。</Copy>
      <ButtonRow>
        <PrimaryButton type="button" onClick={onRetry}>
          もう一度
        </PrimaryButton>
        <GhostButton type="button" onClick={onReset}>
          トップへ
        </GhostButton>
      </ButtonRow>
    </Panel>
  )
}
