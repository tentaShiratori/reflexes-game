import styled from 'styled-components'
import { riseIn } from './keyframes'

export const GamePanel = styled.section`
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  animation: ${riseIn} 0.55s ease both;
`
