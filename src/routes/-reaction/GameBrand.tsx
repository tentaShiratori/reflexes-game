import { Link } from '@tanstack/react-router'
import styled, { keyframes } from 'styled-components'

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

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

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.25rem;
`

const NavLink = styled(Link)`
  color: var(--accent-deep);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.18em;

  &:hover {
    color: var(--ink);
  }
`

export function GameBrand() {
  return (
    <Brand>
      <Kicker>Reflex Drill</Kicker>
      <Title>反射神経テスト</Title>
      <Lead>赤が緑に変わったら、できるだけ早く画面を押せ。5回の平均が1プレイの記録になる。</Lead>
      <Nav aria-label="他のゲーム">
        <NavLink to="/">後だしじゃんけんへ</NavLink>
        <NavLink to="/acchi">あっち向いてホイへ</NavLink>
      </Nav>
    </Brand>
  )
}
