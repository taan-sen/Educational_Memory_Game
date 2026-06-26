import styles from './GreenTick.module.css'

export function GreenTick() {
  return (
    <div className={styles.tick} aria-label="Completed">
      <svg viewBox="0 0 100 100" className={styles.svg}>
        <circle cx="50" cy="50" r="45" fill="#2ecc71" opacity="0.9" />
        <polyline
          points="25,52 42,68 75,32"
          fill="none"
          stroke="white"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
