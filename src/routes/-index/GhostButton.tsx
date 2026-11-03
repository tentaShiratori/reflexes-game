import styled from 'styled-components'

export const GhostButton = styled.button`
  font: inherit;
  cursor: pointer;
  min-height: 3rem;
  padding: 0.75rem 1.4rem;
  border: 2px solid var(--ink);
  background: transparent;
  color: var(--ink);
  transition:
    transform 0.18s ease,
    background-color 0.18s ease;

  &:hover {
    background: rgba(15, 143, 123, 0.08);
    transform: translateY(-1px);
  }
`
