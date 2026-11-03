import { Link } from '@tanstack/react-router'
import styled from 'styled-components'
import { riseIn } from './keyframes'

const Menu = styled.nav`
  display: grid;
  gap: 1rem;
  animation: ${riseIn} 0.65s ease both;
`

const MenuLink = styled(Link)`
  display: grid;
  gap: 0.45rem;
  padding: 1.35rem 1.4rem;
  border: 2px solid var(--ink);
  background: rgba(255, 255, 255, 0.72);
  color: inherit;
  text-decoration: none;
  box-shadow: var(--shadow);
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    background: white;
    border-color: var(--accent-deep);
  }
`

const Name = styled.span`
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
`

const Desc = styled.span`
  color: var(--ink-soft);
  line-height: 1.6;
`

const GAMES = [
  {
    to: '/janken',
    name: '後だしじゃんけん',
    desc: '指示どおりの手を、遅れて出る相手に合わせる',
  },
  {
    to: '/acchi',
    name: 'あっち向いてホイ',
    desc: '同じ方向か違う方向か、遅れて向く顔に反応する',
  },
] as const

export function HubMenu() {
  return (
    <Menu aria-label="トレーニング一覧">
      {GAMES.map((game) => (
        <MenuLink key={game.to} to={game.to}>
          <Name>{game.name}</Name>
          <Desc>{game.desc}</Desc>
        </MenuLink>
      ))}
    </Menu>
  )
}
