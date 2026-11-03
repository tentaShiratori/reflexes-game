import styled, { keyframes } from 'styled-components'
import { TOTAL_ROUNDS } from '#/lib/janken'
import { formatAccuracy, formatResponseMs, type RecordsStore } from '#/lib/records'
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

export function IdlePanel({ records, onStart }: { records: RecordsStore; onStart: () => void }) {
  return (
    <Panel aria-labelledby="start-heading">
      <SrOnly id="start-heading">スタート</SrOnly>
      <Copy>
        「負けて」「勝って」「あいこで」のあと、1〜3秒で相手の手が出る。
        指示どおりの手を、反射で選べ。全{TOTAL_ROUNDS}問。
      </Copy>

      <RecordGrid
        items={[
          {
            label: 'ベスト正答率',
            value: records.sessions.length === 0 ? '—' : formatAccuracy(records.bestAccuracy),
          },
          {
            label: '最速平均回答',
            value:
              records.bestAverageResponseMs === null
                ? '—'
                : formatResponseMs(records.bestAverageResponseMs),
          },
          {
            label: 'プレイ回数',
            value: records.sessions.length,
          },
        ]}
      />

      <PrimaryButton type="button" onClick={onStart}>
        スタート
      </PrimaryButton>
    </Panel>
  )
}
