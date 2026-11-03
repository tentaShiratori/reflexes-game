import styled from 'styled-components'
import { punchIn } from './keyframes'

const Label = styled.p`
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-soft);
`

const Text = styled.p`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 8vw, 3.6rem);
  animation: ${punchIn} 0.35s ease both;
`

type InstructionDisplayProps = {
  text: string
}

export function InstructionDisplay({ text }: InstructionDisplayProps) {
  return (
    <>
      <Label>指示</Label>
      <Text data-testid="instruction">{text}</Text>
    </>
  )
}
