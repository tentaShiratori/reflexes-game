import styled from 'styled-components'
import { punchIn, pulse } from './keyframes'

const Area = styled.div`
  min-height: 7rem;
  display: grid;
  place-items: center;
  border: 1px dashed rgba(16, 35, 63, 0.22);
  background: rgba(255, 255, 255, 0.55);
`

const Waiting = styled.p`
  margin: 0;
  color: var(--ink-soft);
  animation: ${pulse} 1.1s ease-in-out infinite;
`

const Prompt = styled.div<{ $direction?: boolean }>`
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 10vw, 4.2rem);
  animation: ${punchIn} 0.28s cubic-bezier(0.2, 0.9, 0.2, 1) both;
  ${({ $direction }) =>
    $direction
      ? `
    display: grid;
    gap: 0.35rem;
    justify-items: center;
  `
      : ''}
`

export const DirectionCaption = styled.span`
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
`

type PromptAreaProps = {
  waiting: boolean
  waitingText: string
  children?: React.ReactNode
  testId?: string
  direction?: boolean
}

export function PromptArea({
  waiting,
  waitingText,
  children,
  testId = 'system-hand',
  direction = false,
}: PromptAreaProps) {
  return (
    <Area>
      {waiting ? (
        <Waiting data-testid="waiting">{waitingText}</Waiting>
      ) : (
        <Prompt data-testid={testId} $direction={direction}>
          {children}
        </Prompt>
      )}
    </Area>
  )
}
