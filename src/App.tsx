import { useState, useEffect, useMemo, useRef } from 'react'
import html2canvas from 'html2canvas'
import Chart from './components/Chart'
import Controls from './components/Controls'
import type { RawData, ChartDataPoint, AggregationMode, LineStyle } from './types'
import { transformToChartData, aggregateByWeek } from './utils/data'
import './App.css'

type Theme = 'light' | 'dark' | 'system'

function App() {
  const [rawData, setRawData] = useState<RawData | null>(null)
  const [selectedVariations, setSelectedVariations] = useState<string[]>([])
  const [aggregationMode, setAggregationMode] = useState<AggregationMode>('day')
  const [lineStyle, setLineStyle] = useState<LineStyle>('smooth')
  const [theme, setTheme] = useState<Theme>('system')
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'data.json')
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

  const displayData = useMemo(() => {
    if (!zoomDomain) return chartData
    return chartData.slice(zoomDomain.start, zoomDomain.end + 1)
  }, [chartData, zoomDomain])

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

  const chartRef = useRef<HTMLDivElement>(null)

  const exportToPng = async () => {
    if (!chartRef.current) return
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim(),
    })
    const link = document.createElement('a')
    link.download = 'ab-test-chart.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleZoomIn = () => {
    const len = chartData.length
    if (len <= 2) return
    setZoomDomain((prev) => {
      if (!prev) {
        const center = Math.floor(len / 2)
        const range = Math.floor(len / 4)
        return { start: Math.max(0, center - range), end: Math.min(len - 1, center + range) }
      }
      const currentRange = prev.end - prev.start
      if (currentRange <= 2) return prev
      const center = Math.floor((prev.start + prev.end) / 2)
      const newRange = Math.floor(currentRange / 2)
      return {
        start: Math.max(0, center - Math.floor(newRange / 2)),
        end: Math.min(len - 1, center + Math.ceil(newRange / 2)),
      }
    })
  }

  const handleZoomOut = () => {
    const len = chartData.length
    setZoomDomain((prev) => {
      if (!prev) return null
      const currentRange = prev.end - prev.start
      const newRange = Math.min(len - 1, currentRange * 2)
      const center = Math.floor((prev.start + prev.end) / 2)
      const newStart = Math.max(0, center - Math.floor(newRange / 2))
      const newEnd = Math.min(len - 1, newStart + newRange)
      if (newStart === 0 && newEnd === len - 1) return null
      return { start: newStart, end: newEnd }
    })
  }

  const handleZoomReset = () => {
    setZoomDomain(null)
  }

  if (!rawData) {
    return <div className="app loading">Loading...</div>
  }

  return (
    <div className="app">
      <div className="toolbar">
        <Controls
          variations={rawData.variations}
          selectedVariations={selectedVariations}
          onVariationToggle={handleVariationToggle}
          aggregationMode={aggregationMode}
          onAggregationChange={setAggregationMode}
          lineStyle={lineStyle}
          onLineStyleChange={setLineStyle}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />
        <div className="toolbarActions">
          <button className="iconBtn" onClick={exportToPng} title="Export to PNG">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.25 7.5L9 11.25L12.75 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11.25V2.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="iconBtn" onClick={cycleTheme} title={`Theme: ${theme}`}>
            {themeIcon}
          </button>
        </div>
      </div>
      <div ref={chartRef}>
        <Chart
          data={displayData}
          variations={rawData.variations}
          selectedVariations={selectedVariations}
          lineStyle={lineStyle}
        />
      </div>
    </div>
  )
}

export default App
