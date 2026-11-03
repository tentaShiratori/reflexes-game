import styled from 'styled-components'

export const GameStage = styled.main`
  position: relative;
  z-index: 1;
  width: min(720px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 3.5rem 0 4rem;
  display: grid;
  gap: 1.5rem;

  @media (max-width: 640px) {
    padding-top: 2rem;
  }
`
