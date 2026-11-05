import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vite-plus/test'
import { ResponseTimeChart } from './ResponseTimeChart'

afterEach(() => {
  cleanup()
})

describe('ResponseTimeChart', () => {
  it('renders nothing when there are no values', () => {
    const { container } = render(<ResponseTimeChart values={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a chart for one or more values', () => {
    render(<ResponseTimeChart values={[220, 180]} title="直近の反応時間" />)

    expect(screen.getByTestId('response-time-chart')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '直近の反応時間' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '直近の反応時間の折れ線グラフ' })).toBeInTheDocument()
  })
})
