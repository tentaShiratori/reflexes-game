import styled, { keyframes } from 'styled-components'
import { PrimaryButton } from '#/components/PrimaryButton'
import { RecordGrid } from '#/components/RecordGrid'
import { TRIALS_PER_GAME, formatReactionMs, type ReactionRecordsStore } from '#/lib/reactionRecords'

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

const Copy = styled.p`
  margin: 0;
  color: var(--ink-soft);
  line-height: 1.7;
`

const SrOnly = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export function IdlePanel({
  records,
  onStart,
}: {
  records: ReactionRecordsStore
  onStart: () => void
}) {
  return (
    <Panel aria-labelledby="reaction-start-heading">
      <SrOnly id="reaction-start-heading">スタート</SrOnly>
      <Copy>
        スタート後は赤い待ち画面。1〜3秒で緑に変わったらすぐクリック。赤のうちに押すと無効でやり直し。
        成功{TRIALS_PER_GAME}回の平均が1プレイの記録になる。
      </Copy>

      <RecordGrid
        items={[
          {
            label: 'ベスト平均',
            value: records.bestAverageMs === null ? '—' : formatReactionMs(records.bestAverageMs),
            valueTestId: 'reaction-best-ms',
          },
          {
            label: 'プレイ回数',
            value: records.games.length,
          },
        ]}
      />

      <PrimaryButton type="button" onClick={onStart}>
        スタート
      </PrimaryButton>
    </Panel>
  )
}
