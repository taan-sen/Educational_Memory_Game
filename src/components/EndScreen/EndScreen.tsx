import { useGame } from '../../hooks/useGame'
import styles from './EndScreen.module.css'

export function EndScreen() {
  const { phase, nextGame, stepUp } = useGame()

  if (phase !== 'complete') return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Round complete">
      <div className={styles.card}>
        <h2 className={styles.title}>🎉 You did it! 🎉</h2>
        <p className={styles.subtitle}>You visited every symbol in the right order.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.next} onClick={nextGame}>
            Next game
          </button>
          <button type="button" className={styles.stepUp} onClick={stepUp}>
            Step up (+1 sequence)
          </button>
        </div>
      </div>
    </div>
  )
}
