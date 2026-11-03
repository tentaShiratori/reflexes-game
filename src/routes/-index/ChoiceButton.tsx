import styled from 'styled-components'

export const ChoiceButton = styled.button`
  font: inherit;
  cursor: pointer;
  min-height: 4.5rem;
  border: 2px solid var(--ink);
  background: white;
  font-family: var(--font-display);
  font-size: 1.35rem;
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;

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
