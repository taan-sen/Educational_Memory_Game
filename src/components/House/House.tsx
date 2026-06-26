import styles from './House.module.css'

export function House() {
  return (
    <div className={styles.house} aria-label="Monkey house">
      <div className={styles.roof} />
      <div className={styles.walls}>
        <div className={styles.door} />
        <div className={styles.window} />
      </div>
    </div>
  )
}
