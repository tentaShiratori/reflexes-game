import styled, { keyframes } from 'styled-components'
import {
  TOTAL_ROUNDS,
  acchiInstructionLabel,
  directionLabel,
  directionSymbol,
  type AcchiInstruction,
  type AcchiRoundResult,
  type Direction,
} from '#/lib/acchi'
import { formatResponseMs } from '#/lib/records'
import { DirectionPad } from './DirectionPad'

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

const punchIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const pulse = keyframes`
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
`

const Panel = styled.section`
  display: grid;
  gap: 1rem;
  text-align: center;
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  animation: ${riseIn} 0.55s ease both;
`

const RoundMeter = styled.div`
  display: grid;
  gap: 0.45rem;
  font-weight: 600;
`

const RoundTrack = styled.div`
  height: 0.45rem;
  background: rgba(16, 35, 63, 0.1);
  overflow: hidden;
`

const RoundFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background: linear-gradient(90deg, var(--accent), var(--signal));
  transition: width 0.25s ease;
`

const InstructionLabel = styled.p`
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
`

const InstructionText = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 8vw, 3.6rem);
  animation: ${punchIn} 0.35s ease both;
`

const SystemDirectionArea = styled.div`
  min-height: 7rem;
  display: grid;
  place-items: center;
  border: 1px dashed rgba(16, 35, 63, 0.22);
  background: rgba(255, 255, 255, 0.55);
`

const WaitingPulse = styled.p`
  margin: 0;
  color: var(--ink-soft);
  animation: ${pulse} 1.1s ease-in-out infinite;
`

const SystemDirection = styled.div`
  display: grid;
  gap: 0.25rem;
  place-items: center;
  font-family: var(--font-display);
  animation: ${punchIn} 0.28s cubic-bezier(0.2, 0.9, 0.2, 1) both;
`

const DirectionGlyph = styled.span`
  font-size: clamp(2.8rem, 10vw, 4.2rem);
  line-height: 1;
`

const DirectionCaption = styled.span`
  font-size: 1.1rem;
`

const SrOnly = styled.span`
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

const Feedback = styled.p<{ $correct: boolean }>`
  margin: 0;
  min-height: 4.5rem;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: ${(props) => (props.$correct ? 'var(--ok)' : 'var(--miss)')};
  animation: ${punchIn} 0.25s ease both;
`

export function PlayPanel({
  phase,
  round,
  instruction,
  systemDirection,
  lastResult,
  onAnswer,
}: {
  phase: 'waiting' | 'answering' | 'feedback'
  round: number
  instruction: AcchiInstruction | null
  systemDirection: Direction | null
  lastResult: AcchiRoundResult | null
  onAnswer: (direction: Direction) => void
}) {
  return (
    <Panel aria-live="polite">
      <RoundMeter>
        <span>
          {round} / {TOTAL_ROUNDS}
        </span>
        <RoundTrack>
          <RoundFill $progress={(round / TOTAL_ROUNDS) * 100} />
        </RoundTrack>
      </RoundMeter>

      <InstructionLabel>指示</InstructionLabel>
      <InstructionText data-testid="instruction">
        {instruction ? acchiInstructionLabel(instruction) : ''}
      </InstructionText>

      <SystemDirectionArea>
        {phase === 'waiting' ? (
          <WaitingPulse data-testid="waiting">向きが出るまで待機…</WaitingPulse>
        ) : (
          <SystemDirection data-testid="system-direction">
            {systemDirection ? (
              <>
                <DirectionGlyph aria-hidden="true">
                  {directionSymbol(systemDirection)}
                </DirectionGlyph>
                <SrOnly>{directionLabel(systemDirection)}</SrOnly>
                <DirectionCaption>{directionLabel(systemDirection)}</DirectionCaption>
              </>
            ) : null}
          </SystemDirection>
        )}
      </SystemDirectionArea>

      {phase === 'feedback' && lastResult ? (
        <Feedback $correct={lastResult.correct} data-testid="feedback">
          {lastResult.correct ? '正解' : '不正解'} · {formatResponseMs(lastResult.responseMs)}
        </Feedback>
      ) : (
        <DirectionPad disabled={phase !== 'answering'} onSelect={onAnswer} />
      )}
    </Panel>
  )
}
