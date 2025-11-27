import type { Variation, AggregationMode } from '../types'
import styles from './Controls.module.css'

interface ControlsProps {
  variations: Variation[]
  selectedVariations: string[]
  onVariationToggle: (name: string) => void
  aggregationMode: AggregationMode
  onAggregationChange: (mode: AggregationMode) => void
}

function Controls({
  variations,
  selectedVariations,
  onVariationToggle,
  aggregationMode,
  onAggregationChange,
}: ControlsProps) {
  const handleVariationChange = (name: string) => {
    if (selectedVariations.includes(name) && selectedVariations.length === 1) {
      return
    }
    onVariationToggle(name)
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles.label}>Variations:</span>
        <div className={styles.checkboxes}>
          {variations.map((variation) => (
            <label key={variation.name} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={selectedVariations.includes(variation.name)}
                onChange={() => handleVariationChange(variation.name)}
              />
              <span>{variation.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.label}>Period:</span>
        <div className={styles.toggle}>
          <button
            className={aggregationMode === 'day' ? styles.active : ''}
            onClick={() => onAggregationChange('day')}
          >
            Day
          </button>
          <button
            className={aggregationMode === 'week' ? styles.active : ''}
            onClick={() => onAggregationChange('week')}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  )
}

export default Controls
