import { useGame } from '../../hooks/useGame'
import { SymbolRenderer } from '../SymbolRenderer'
import styles from './SequenceRecallButton.module.css'

export function SequenceRecallButton() {
  const { round, showSequenceRecall, toggleSequenceRecall, phase } = useGame()

  if (!round || phase === 'idle') return null

  return (
    <>
      <button
        type="button"
        className={styles.button}
        onClick={toggleSequenceRecall}
        aria-expanded={showSequenceRecall}
        aria-label="Show sequence for this round"
      >
        <span className={styles.sparkle}>✨</span>
        Sequence
        <span className={styles.sparkle}>✨</span>
      </button>

      {showSequenceRecall && (
        <div className={styles.panel} role="region" aria-label="Round sequence">
          <h3 className={styles.panelTitle}>This round&apos;s order</h3>
          <div className={styles.sequence}>
            {round.sequence.map((item, index) => (
              <div key={item.id} className={styles.item}>
                <span className={styles.num}>{index + 1}</span>
                <SymbolRenderer item={item} />
              </div>
            ))}
          </div>
          <button type="button" className={styles.close} onClick={toggleSequenceRecall}>
            Close
          </button>
        </div>
      )}
    </>
  )
}
