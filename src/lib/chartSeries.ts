/** Newest-first values → oldest-left chart series (max `limit` points). */
export function toChartSeries(valuesNewestFirst: readonly number[], limit = 20): number[] {
  return valuesNewestFirst.slice(0, limit).reverse()
}
