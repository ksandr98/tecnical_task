import { useState, useEffect, useMemo } from 'react'
import Chart from './components/Chart'
import Controls from './components/Controls'
import type { RawData, ChartDataPoint, AggregationMode } from './types'
import { transformToChartData, aggregateByWeek } from './utils/data'
import './App.css'

type Theme = 'light' | 'dark' | 'system'

function App() {
  const [rawData, setRawData] = useState<RawData | null>(null)
  const [selectedVariations, setSelectedVariations] = useState<string[]>([])
  const [aggregationMode, setAggregationMode] = useState<AggregationMode>('day')
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((data: RawData) => {
        setRawData(data)
        setSelectedVariations(data.variations.map((v) => v.name))
      })
  }, [])

  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }, [theme])

  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!rawData) return []
    const dailyData = transformToChartData(rawData.data, rawData.variations)
    if (aggregationMode === 'week') {
      return aggregateByWeek(dailyData, rawData.variations)
    }
    return dailyData
  }, [rawData, aggregationMode])

  const handleVariationToggle = (name: string) => {
    setSelectedVariations((prev) => {
      if (prev.includes(name)) {
        return prev.filter((v) => v !== name)
      }
      return [...prev, name]
    })
  }

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === 'system') return 'light'
      if (prev === 'light') return 'dark'
      return 'system'
    })
  }

  const themeIcon = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'

  if (!rawData) {
    return <div className="app">Loading...</div>
  }

  return (
    <div className="app">
      <div className="header">
        <h1>A/B Test Results</h1>
        <button className="themeToggle" onClick={cycleTheme} title={`Theme: ${theme}`}>
          {themeIcon}
        </button>
      </div>
      <Controls
        variations={rawData.variations}
        selectedVariations={selectedVariations}
        onVariationToggle={handleVariationToggle}
        aggregationMode={aggregationMode}
        onAggregationChange={setAggregationMode}
      />
      <Chart
        data={chartData}
        variations={rawData.variations}
        selectedVariations={selectedVariations}
      />
    </div>
  )
}

export default App
