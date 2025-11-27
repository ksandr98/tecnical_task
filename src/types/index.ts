export interface Variation {
  id?: number
  name: string
}

export interface RawDataPoint {
  date: string
  visits: Record<string, number>
  conversions: Record<string, number>
}

export interface RawData {
  variations: Variation[]
  data: RawDataPoint[]
}

export interface ChartDataPoint {
  date: string
  [key: string]: number | string
}

export type AggregationMode = 'day' | 'week'
