import styled from 'styled-components'

const Meter = styled.div`
  display: grid;
  gap: 0.45rem;
  font-weight: 600;
`

const Track = styled.div`
  height: 0.45rem;
  background: rgba(16, 35, 63, 0.1);
  overflow: hidden;
`

const Fill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background: linear-gradient(90deg, var(--accent), var(--signal));
  transition: width 0.25s ease;
`

type RoundMeterProps = {
  round: number
  total: number
}

export function RoundMeter({ round, total }: RoundMeterProps) {
  return (
    <Meter>
      <span>
        {round} / {total}
      </span>
      <Track>
        <Fill $progress={(round / total) * 100} />
      </Track>
    </Meter>
  )
}
