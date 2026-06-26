import { GAME_CONFIG } from '../../config/gameConfig'
import { useCountdown } from '../../hooks/useCountdown'
import { useGame } from '../../hooks/useGame'
import { SymbolRenderer } from '../SymbolRenderer'
import styles from './MemorizeModal.module.css'

export function MemorizeModal() {
  const { phase, round, onCountdownComplete } = useGame()
  const active = phase === 'memorize' && round !== null

  const remaining = useCountdown(
    GAME_CONFIG.countdownSeconds,
    active,
    onCountdownComplete,
  )

  if (!active || !round) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Memorize sequence">
      <div className={styles.modal}>
        <h2 className={styles.title}>Remember this order!</h2>
        <div className={styles.sequence}>
          {round.sequence.map((item, index) => (
            <div key={item.id} className={styles.sequenceItem}>
              <span className={styles.index}>{index + 1}</span>
              <SymbolRenderer item={item} />
            </div>
          ))}
        </div>
        <div className={styles.countdown} aria-live="polite">
          {remaining > 0 ? remaining : 'Go!'}
        </div>
      </div>
    </div>
  )
}
