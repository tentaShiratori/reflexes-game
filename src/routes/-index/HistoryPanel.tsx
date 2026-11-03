import styled, { keyframes } from 'styled-components'
import { formatAccuracy, formatResponseMs, type SessionRecord } from '#/lib/records'

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

const Panel = styled.section`
  background: var(--panel);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  animation: ${riseIn} 0.55s ease both;
`

const Heading = styled.h2`
  margin: 0 0 0.85rem;
  font-size: 1rem;
  letter-spacing: 0.08em;
`

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
`

const Item = styled.li`
  display: grid;
  grid-template-columns: 4.5rem 5.5rem 1fr;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.92rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }
`

const PlayedAt = styled.time`
  color: var(--ink-soft);
  text-align: right;

  @media (max-width: 640px) {
    text-align: left;
  }
`

export function HistoryPanel({ sessions }: { sessions: SessionRecord[] }) {
  return (
    <Panel aria-labelledby="history-heading">
      <Heading id="history-heading">直近の記録</Heading>
      <List>
        {sessions.slice(0, 5).map((session) => (
          <Item key={session.playedAt}>
            <span>{formatAccuracy(session.accuracy)}</span>
            <span>{formatResponseMs(session.averageResponseMs)}</span>
            <PlayedAt dateTime={session.playedAt}>
              {new Date(session.playedAt).toLocaleString('ja-JP')}
            </PlayedAt>
          </Item>
        ))}
      </List>
    </Panel>
  )
}
