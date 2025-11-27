import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { ChartDataPoint, Variation, LineStyle } from '../types'
import styles from './Chart.module.css'

const COLORS: Record<string, string> = {
  'Original': '#374151',
  'Variation A': '#6366f1',
  'Variation B': '#f97316',
  'Variation C': '#10b981',
}

interface ChartProps {
  data: ChartDataPoint[]
  variations: Variation[]
  selectedVariations: string[]
  lineStyle: LineStyle
}

interface TooltipEntry {
  name: string
  value: number
  color: string
}

interface TooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const filtered = payload.filter((entry) => entry.value !== null && entry.value !== undefined)
  if (filtered.length === 0) return null

  const sorted = [...filtered].sort((a, b) => b.value - a.value)
  const maxValue = sorted[0].value

  const formatDate = (dateStr: string) => {
    if (dateStr.includes(' - ')) return dateStr
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const formatValue = (value: number) => {
    return value.toFixed(2).replace('.', ',') + '%'
  }

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDate}>📅 {formatDate(label || '')}</div>
      {sorted.map((entry) => (
        <div key={entry.name} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          <span className={styles.tooltipName}>
            {entry.name}
            {entry.value === maxValue && <span className={styles.trophy}>🏆</span>}
          </span>
          <span className={styles.tooltipValue}>{formatValue(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

function Chart({ data, variations, selectedVariations, lineStyle }: ChartProps) {
  const visibleVariations = variations.filter((v) =>
    selectedVariations.includes(v.name)
  )

  const curveType = lineStyle === 'line' ? 'linear' : 'monotone'

  const formatXAxis = (value: string) => {
    if (value.includes(' - ')) return value
    const date = new Date(value)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  const chartContent = (
    <>
      <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} className={styles.grid} />
      <XAxis
        dataKey="date"
        tick={{ fontSize: 12 }}
        tickMargin={10}
        tickFormatter={formatXAxis}
        className={styles.axis}
      />
      <YAxis
        tick={{ fontSize: 12 }}
        tickFormatter={(value) => `${value}%`}
        domain={[0, 40]}
        ticks={[0, 10, 20, 30, 40]}
        className={styles.axis}
      />
      <Tooltip
        content={<CustomTooltip />}
        cursor={{ stroke: 'var(--text-muted)', strokeWidth: 1, strokeDasharray: '4 4' }}
      />
    </>
  )

  if (lineStyle === 'area') {
    return (
      <div className={styles.container}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            {chartContent}
            {visibleVariations.map((variation) => (
              <Area
                key={variation.name}
                type="monotone"
                dataKey={variation.name}
                stroke={COLORS[variation.name]}
                fill={COLORS[variation.name]}
                fillOpacity={0.3}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          {chartContent}
          {visibleVariations.map((variation) => (
            <Line
              key={variation.name}
              type={curveType}
              dataKey={variation.name}
              stroke={COLORS[variation.name]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart
