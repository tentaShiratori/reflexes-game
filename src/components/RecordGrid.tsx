import type { ReactNode } from 'react'
import styled from 'styled-components'

const Grid = styled.dl<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns}, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 1.25rem 0 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Item = styled.div`
  padding: 0.9rem 0.75rem;
  border-top: 2px solid var(--ink);
`

const Label = styled.dt`
  margin: 0 0 0.35rem;
  font-size: 0.75rem;
  color: var(--ink-soft);
`

const Value = styled.dd`
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3vw, 1.8rem);
`

type RecordGridItem = {
  label: string
  value: ReactNode
  valueTestId?: string
}

export function RecordGrid({ items }: { items: RecordGridItem[] }) {
  const columns = Math.min(Math.max(items.length, 1), 3)

  return (
    <Grid $columns={columns}>
      {items.map((item) => (
        <Item key={item.label}>
          <Label>{item.label}</Label>
          <Value data-testid={item.valueTestId}>{item.value}</Value>
        </Item>
      ))}
    </Grid>
  )
}
