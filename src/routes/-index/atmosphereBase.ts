import { css } from 'styled-components'
import { atmosphereShift } from './keyframes'

export const atmosphereBase = css`
  position: absolute;
  inset: 0;
  animation: ${atmosphereShift} 12s ease-in-out infinite alternate;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(16, 35, 63, 0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(16, 35, 63, 0.035) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(circle at center, black 35%, transparent 85%);
  }
`
