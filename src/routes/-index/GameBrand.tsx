import styled from 'styled-components'
import { riseIn } from './keyframes'

const Brand = styled.header`
  display: grid;
  gap: 0.75rem;
  animation: ${riseIn} 0.6s ease both;
`

const Kicker = styled.p`
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-deep);
  font-weight: 700;
`

const Title = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 8vw, 4.4rem);
  line-height: 1.05;
  letter-spacing: 0.02em;
`

const Lead = styled.p`
  margin: 0;
  color: var(--ink-soft);
  line-height: 1.7;
`

type GameBrandProps = {
  title: string
  lead: string
  kicker?: string
}

export function GameBrand({ title, lead, kicker = 'Reflex Drill' }: GameBrandProps) {
  return (
    <Brand>
      <Kicker>{kicker}</Kicker>
      <Title>{title}</Title>
      <Lead>{lead}</Lead>
    </Brand>
  )
}
