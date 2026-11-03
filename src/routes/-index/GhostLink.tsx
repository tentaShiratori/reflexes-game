import { Link } from '@tanstack/react-router'
import styled from 'styled-components'

export const GhostLink = styled(Link)`
  font: inherit;
  cursor: pointer;
  min-height: 3rem;
  padding: 0.75rem 1.4rem;
  border: 2px solid var(--ink);
  background: transparent;
  color: var(--ink);
  display: inline-grid;
  place-items: center;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    background: rgba(15, 143, 123, 0.08);
    transform: translateY(-1px);
  }
`
