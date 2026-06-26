import { MonkeySVG } from './MonkeySVG'
import styles from './Monkey.module.css'

interface MonkeyProps {
  x: number
  y: number
  isWalking: boolean
  facingRight: boolean
  monkeyRef: React.RefObject<HTMLDivElement | null>
}

export function Monkey({ x, y, isWalking, facingRight, monkeyRef }: MonkeyProps) {
  return (
    <div
      ref={monkeyRef}
      className={styles.monkey}
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label="Monkey"
    >
      <MonkeySVG isWalking={isWalking} facingRight={facingRight} />
    </div>
  )
}
