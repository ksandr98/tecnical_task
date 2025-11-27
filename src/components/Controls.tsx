import { useState, useRef, useEffect } from 'react'
import type { Variation, AggregationMode, LineStyle } from '../types'
import styles from './Controls.module.css'

interface ControlsProps {
  variations: Variation[]
  selectedVariations: string[]
  onVariationToggle: (name: string) => void
  aggregationMode: AggregationMode
  onAggregationChange: (mode: AggregationMode) => void
  lineStyle: LineStyle
  onLineStyleChange: (style: LineStyle) => void
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
}

function Controls({
  variations,
  selectedVariations,
  onVariationToggle,
  aggregationMode,
  onAggregationChange,
  lineStyle,
  onLineStyleChange,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: ControlsProps) {
  const [variationsOpen, setVariationsOpen] = useState(false)
  const [periodOpen, setPeriodOpen] = useState(false)
  const [styleOpen, setStyleOpen] = useState(false)

  const variationsRef = useRef<HTMLDivElement>(null)
  const periodRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (variationsRef.current && !variationsRef.current.contains(e.target as Node)) {
        setVariationsOpen(false)
      }
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
        setPeriodOpen(false)
      }
      if (styleRef.current && !styleRef.current.contains(e.target as Node)) {
        setStyleOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleVariationChange = (name: string) => {
    if (selectedVariations.includes(name) && selectedVariations.length === 1) {
      return
    }
    onVariationToggle(name)
  }

  const getVariationsLabel = () => {
    if (selectedVariations.length === variations.length) {
      return 'All variations selected'
    }
    if (selectedVariations.length === 1) {
      return selectedVariations[0]
    }
    return `${selectedVariations.length} variations`
  }

  const periodLabels: Record<AggregationMode, string> = {
    day: 'Day',
    week: 'Week',
  }

  const styleLabels: Record<LineStyle, string> = {
    line: 'Line',
    smooth: 'Smooth',
    area: 'Area',
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.dropdown} ref={variationsRef}>
          <button
            className={styles.dropdownToggle}
            onClick={() => setVariationsOpen(!variationsOpen)}
          >
            <span>{getVariationsLabel()}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {variationsOpen && (
            <div className={styles.dropdownMenu}>
              {variations.map((variation) => (
                <label key={variation.name} className={styles.dropdownItem}>
                  <input
                    type="checkbox"
                    checked={selectedVariations.includes(variation.name)}
                    onChange={() => handleVariationChange(variation.name)}
                  />
                  <span>{variation.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.dropdown} ref={periodRef}>
          <button
            className={styles.dropdownToggle}
            onClick={() => setPeriodOpen(!periodOpen)}
          >
            <span>{periodLabels[aggregationMode]}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {periodOpen && (
            <div className={styles.dropdownMenu}>
              <button
                className={`${styles.dropdownOption} ${aggregationMode === 'day' ? styles.active : ''}`}
                onClick={() => { onAggregationChange('day'); setPeriodOpen(false) }}
              >
                Day
              </button>
              <button
                className={`${styles.dropdownOption} ${aggregationMode === 'week' ? styles.active : ''}`}
                onClick={() => { onAggregationChange('week'); setPeriodOpen(false) }}
              >
                Week
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.dropdown} ref={styleRef}>
          <button
            className={styles.dropdownToggle}
            onClick={() => setStyleOpen(!styleOpen)}
          >
            <span>Line style: {styleLabels[lineStyle].toLowerCase()}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {styleOpen && (
            <div className={styles.dropdownMenu}>
              <button
                className={`${styles.dropdownOption} ${lineStyle === 'line' ? styles.active : ''}`}
                onClick={() => { onLineStyleChange('line'); setStyleOpen(false) }}
              >
                Line
              </button>
              <button
                className={`${styles.dropdownOption} ${lineStyle === 'smooth' ? styles.active : ''}`}
                onClick={() => { onLineStyleChange('smooth'); setStyleOpen(false) }}
              >
                Smooth
              </button>
              <button
                className={`${styles.dropdownOption} ${lineStyle === 'area' ? styles.active : ''}`}
                onClick={() => { onLineStyleChange('area'); setStyleOpen(false) }}
              >
                Area
              </button>
            </div>
          )}
        </div>

        <div className={styles.zoomControls}>
          <button className={styles.zoomBtn} onClick={onZoomOut} title="Zoom out">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className={styles.zoomBtn} onClick={onZoomIn} title="Zoom in">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button className={styles.zoomBtn} onClick={onZoomReset} title="Reset zoom">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C5.87827 2 4.00765 3.09213 2.87891 4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M3 2V5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls
