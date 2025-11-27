import { RawData, RawDataPoint, ChartDataPoint, Variation } from '../types'

export function getVariationKey(variation: Variation): string {
  return variation.id ? String(variation.id) : '0'
}

export function calculateConversionRate(visits: number, conversions: number): number {
  if (visits === 0) return 0
  return Number(((conversions / visits) * 100).toFixed(2))
}

export function transformToChartData(
  rawData: RawDataPoint[],
  variations: Variation[]
): ChartDataPoint[] {
  return rawData.map((point) => {
    const chartPoint: ChartDataPoint = { date: point.date }

    variations.forEach((variation) => {
      const key = getVariationKey(variation)
      const visits = point.visits[key]
      const conversions = point.conversions[key]

      if (visits !== undefined && visits > 0) {
        chartPoint[variation.name] = calculateConversionRate(visits, conversions)
      }
    })

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
    const weekLabel = `${firstDate.slice(5)} - ${lastDate.slice(5)}`

    const aggregated: ChartDataPoint = { date: weekLabel }

    variations.forEach((variation) => {
      const values = weekData
        .map((d) => d[variation.name])
        .filter((v): v is number => typeof v === 'number')

      if (values.length > 0) {
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length
        aggregated[variation.name] = Number(avg.toFixed(2))
      }
    })

    return aggregated
  })
}
