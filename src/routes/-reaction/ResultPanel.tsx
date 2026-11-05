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

const TrialList = styled.ol`
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.45rem;
`

const TrialItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0;
  border-top: 1px solid var(--line);
  color: var(--ink-soft);

  &:last-child {
    border-bottom: 1px solid var(--line);
  }
`

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`

export function ResultPanel({
  trialMs,
  averageMs,
  bestAverageMs,
  onRetry,
  onReset,
}: {
  trialMs: readonly number[]
  averageMs: number
  bestAverageMs: number | null
  onRetry: () => void
  onReset: () => void
}) {
  return (
    <Panel aria-labelledby="reaction-result-heading">
      <Heading id="reaction-result-heading">結果</Heading>
      <RecordGrid
        items={[
          {
            label: '平均反応時間',
            value: formatReactionMs(averageMs),
            valueTestId: 'reaction-result-ms',
          },
          {
            label: 'ベスト平均',
            value: bestAverageMs === null ? '—' : formatReactionMs(bestAverageMs),
          },
        ]}
      />
      <TrialList data-testid="reaction-trial-list" aria-label="各回の反応時間">
        {trialMs.map((ms, index) => (
          <TrialItem key={`${index}-${ms}`}>
            <span>{index + 1}回目</span>
            <span>{formatReactionMs(ms)}</span>
          </TrialItem>
        ))}
      </TrialList>
      <Copy>5回の平均をブラウザの localStorage に保存しました。</Copy>
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
