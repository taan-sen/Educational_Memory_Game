import { useLayoutEffect, useRef, useState } from 'react'
import { formatPromptKey } from '../../engine/keyboardPrompt'
import styles from './ThoughtBubble.module.css'

interface ThoughtBubbleProps {
  promptKey: string
}

const VIEWPORT_MARGIN = 12
const ESTIMATED_HEIGHT = 64

export function ThoughtBubble({ promptKey }: ThoughtBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<'above' | 'below'>('above')
  const [shiftX, setShiftX] = useState(0)

  useLayoutEffect(() => {
    const parent = bubbleRef.current?.parentElement
    if (!parent) return

    const parentRect = parent.getBoundingClientRect()
    const spaceAbove = parentRect.top
    const spaceBelow = window.innerHeight - parentRect.bottom

    let place: 'above' | 'below' = 'above'
    if (spaceAbove < ESTIMATED_HEIGHT + VIEWPORT_MARGIN && spaceBelow >= spaceAbove) {
      place = 'below'
    } else if (spaceBelow < ESTIMATED_HEIGHT + VIEWPORT_MARGIN && spaceAbove > spaceBelow) {
      place = 'above'
    }

    setPlacement(place)
    setShiftX(0)
  }, [promptKey])

  useLayoutEffect(() => {
    const el = bubbleRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    let dx = 0
    if (rect.left < VIEWPORT_MARGIN) {
      dx = VIEWPORT_MARGIN - rect.left
    } else if (rect.right > window.innerWidth - VIEWPORT_MARGIN) {
      dx = window.innerWidth - VIEWPORT_MARGIN - rect.right
    }
    setShiftX(dx)
  }, [promptKey, placement])

  const placementClass = placement === 'below' ? styles.below : styles.above

  return (
    <div
      ref={bubbleRef}
      className={`${styles.bubble} ${placementClass}`}
      style={{ transform: `translateX(calc(-50% + ${shiftX}px))` }}
      role="status"
      aria-live="polite"
    >
      <span className={styles.text}>Press</span>
      <kbd className={styles.key}>{formatPromptKey(promptKey)}</kbd>
    </div>
  )
}
