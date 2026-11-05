import styled, { keyframes } from 'styled-components'
import type { ReactionPhase } from './useReactionGame'

const pulse = keyframes`
  0%,
  100% {
    opacity: 0.72;
  }
  50% {
    opacity: 1;
  }
`

const punchIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Surface = styled.button<{ $tone: 'waiting' | 'ready' }>`
  appearance: none;
  border: 0;
  width: 100%;
  min-height: min(58vh, 28rem);
  padding: 2rem 1.5rem;
  cursor: pointer;
  display: grid;
  place-items: center;
  gap: 0.75rem;
  color: white;
  background: ${(props) =>
    props.$tone === 'waiting'
      ? 'linear-gradient(160deg, #b91c1c 0%, #991b1b 55%, #7f1d1d 100%)'
      : 'linear-gradient(160deg, #16a34a 0%, #15803d 55%, #166534 100%)'};
  box-shadow: var(--shadow);
  transition: background 0.2s ease;
  animation: ${punchIn} 0.28s ease both;

  &:focus-visible {
    outline: 3px solid var(--ink);
    outline-offset: 4px;
  }
`

const Prompt = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 10vw, 4.4rem);
  letter-spacing: 0.04em;
  animation: ${pulse} 1.15s ease-in-out infinite;
`

const Hint = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.92;
`

export function PlaySurface({
  phase,
  tooEarly,
  onClick,
}: {
  phase: Extract<ReactionPhase, 'waiting' | 'ready'>
  tooEarly: boolean
  onClick: () => void
}) {
  const waiting = phase === 'waiting'

  return (
    <Surface
      type="button"
      $tone={waiting ? 'waiting' : 'ready'}
      onClick={onClick}
      data-testid={waiting ? 'reaction-waiting' : 'reaction-ready'}
      aria-live="polite"
    >
      <Prompt>{waiting ? '待て' : '今すぐ'}</Prompt>
      <Hint>
        {waiting
          ? tooEarly
            ? '早すぎ。緑になるまで待て。'
            : '緑になるまで触るな。'
          : '画面をクリック！'}
      </Hint>
    </Surface>
  )
}
