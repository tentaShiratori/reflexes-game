import { describe, expect, it } from 'vite-plus/test'
import { toChartSeries } from './chartSeries'

describe('toChartSeries', () => {
  it('returns an empty array for empty input', () => {
    expect(toChartSeries([])).toEqual([])
  })

  it('reverses newest-first values so older points are on the left', () => {
    expect(toChartSeries([300, 250, 200])).toEqual([200, 250, 300])
  })

  it('keeps at most 20 points', () => {
    const values = Array.from({ length: 25 }, (_, index) => index + 1)
    const series = toChartSeries(values)

    expect(series).toHaveLength(20)
    expect(series[0]).toBe(20)
    expect(series[19]).toBe(1)
  })
})
