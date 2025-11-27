import type { RawDataPoint, ChartDataPoint, Variation } from '../types'

export function transformToChartData(
  rawData: RawDataPoint[],
  variations: Variation[]
): ChartDataPoint[] {
  return rawData.map((point) => {
    const chartPoint: ChartDataPoint = { date: point.date }

    for (const variation of variations) {
      const key = variation.id ? String(variation.id) : '0'
      const visits = point.visits[key]
      const conversions = point.conversions[key]

      if (visits && visits > 0) {
        chartPoint[variation.name] = Number(((conversions / visits) * 100).toFixed(2))
      }
    }

    return chartPoint
  })
}

export function aggregateByWeek(
  data: ChartDataPoint[],
  variations: Variation[]
): ChartDataPoint[] {
  const weeks: ChartDataPoint[][] = []

  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7))
  }

  return weeks.map((weekData) => {
    const firstDate = weekData[0].date
    const lastDate = weekData[weekData.length - 1].date
    const aggregated: ChartDataPoint = { date: `${firstDate.slice(5)} - ${lastDate.slice(5)}` }

    for (const variation of variations) {
      const values = weekData
        .map((d) => d[variation.name])
        .filter((v): v is number => typeof v === 'number')

      if (values.length > 0) {
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length
        aggregated[variation.name] = Number(avg.toFixed(2))
      }
    }

    return aggregated
  })
}
