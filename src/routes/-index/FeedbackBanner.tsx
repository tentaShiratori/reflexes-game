import styled, { css } from 'styled-components'
import { punchIn } from './keyframes'

const Banner = styled.p<{ $ok: boolean }>`
  margin: 0;
  min-height: 4.5rem;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 1.6rem;
  animation: ${punchIn} 0.25s ease both;
  ${({ $ok }) =>
    $ok
      ? css`
          color: var(--ok);
        `
      : css`
          color: var(--miss);
        `}
`

type FeedbackBannerProps = {
  correct: boolean
  detail: string
}

export function FeedbackBanner({ correct, detail }: FeedbackBannerProps) {
  return (
    <Banner $ok={correct} data-testid="feedback">
      {correct ? '正解' : '不正解'} · {detail}
    </Banner>
  )
}
