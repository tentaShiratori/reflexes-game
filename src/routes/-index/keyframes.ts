import { keyframes } from 'styled-components'

export const atmosphereShift = keyframes`
  from {
    filter: hue-rotate(0deg) saturate(1);
  }
  to {
    filter: hue-rotate(8deg) saturate(1.08);
  }
`

export const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const punchIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

export const pulse = keyframes`
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
`
