import styled from 'styled-components'

export const PrimaryButton = styled.button`
  font: inherit;
  cursor: pointer;
  min-height: 3rem;
  padding: 0.75rem 1.4rem;
  border: 2px solid var(--ink);
  background: var(--ink);
  color: white;
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    background: var(--accent-deep);
    border-color: var(--accent-deep);
    transform: translateY(-1px);
  }
`
