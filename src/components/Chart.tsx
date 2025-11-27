import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ChartDataPoint, Variation } from '../types'
import styles from './Chart.module.css'

const COLORS: Record<string, string> = {
  'Original': '#6366f1',
  'Variation A': '#f59e0b',
  'Variation B': '#10b981',
  'Variation C': '#ef4444',
}

interface ChartProps {
  data: ChartDataPoint[]
  variations: Variation[]
  selectedVariations: string[]
}

function Chart({ data, variations, selectedVariations }: ChartProps) {
  const visibleVariations = variations.filter((v) =>
    selectedVariations.includes(v.name)
  )

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className={styles.grid} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickMargin={10}
            className={styles.axis}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={['auto', 'auto']}
            className={styles.axis}
          />
          <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
          {visibleVariations.map((variation) => (
            <Line
              key={variation.name}
              type="monotone"
              dataKey={variation.name}
              stroke={COLORS[variation.name]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart
