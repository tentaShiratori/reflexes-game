import styled from 'styled-components'
import type { Direction } from '#/lib/acchi'
import { DIRECTION_VALUES, DIRECTIONS, directionLabel, directionSymbol } from '#/lib/acchi'

const Pad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-areas:
    '. up .'
    'left . right'
    '. down .';
  gap: 0.75rem;
`

const DirectionButton = styled.button<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
  font: inherit;
  cursor: pointer;
  display: grid;
  gap: 0.2rem;
  place-items: center;
  min-height: 4.25rem;
  border: 2px solid var(--ink);
  background: white;
  font-family: var(--font-display);
  font-size: 1.1rem;
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;

  span:first-child {
    font-size: 1.6rem;
    line-height: 1;
  }

  &:hover:not(:disabled) {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

const AREA: Record<Direction, string> = {
  [DIRECTIONS.UP]: 'up',
  [DIRECTIONS.DOWN]: 'down',
  [DIRECTIONS.LEFT]: 'left',
  [DIRECTIONS.RIGHT]: 'right',
}

type DirectionPadProps = {
  disabled: boolean
  onSelect: (direction: Direction) => void
}

export function DirectionPad({ disabled, onSelect }: DirectionPadProps) {
  return (
    <Pad role="group" aria-label="方向選択">
      {DIRECTION_VALUES.map((direction) => (
        <DirectionButton
          key={direction}
          type="button"
          $area={AREA[direction]}
          disabled={disabled}
          onClick={() => onSelect(direction)}
          aria-label={directionLabel(direction)}
        >
          <span aria-hidden="true">{directionSymbol(direction)}</span>
          <span>{directionLabel(direction)}</span>
        </DirectionButton>
      ))}
    </Pad>
  )
}
