import styled, { keyframes } from 'styled-components'
import { GhostButton } from '#/components/GhostButton'
import { PrimaryButton } from '#/components/PrimaryButton'
import { RecordGrid } from '#/components/RecordGrid'
import { formatReactionMs } from '#/lib/reactionRecords'

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
  ms,
  bestMs,
  onRetry,
  onReset,
}: {
  ms: number
  bestMs: number | null
  onRetry: () => void
  onReset: () => void
}) {
  return (
    <Panel aria-labelledby="reaction-result-heading">
      <Heading id="reaction-result-heading">結果</Heading>
      <RecordGrid
        items={[
          {
            label: '反応時間',
            value: formatReactionMs(ms),
            valueTestId: 'reaction-result-ms',
          },
          {
            label: 'ベストタイム',
            value: bestMs === null ? '—' : formatReactionMs(bestMs),
          },
        ]}
      />
      <Copy>成功した計測だけをブラウザの localStorage に保存しました。</Copy>
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
