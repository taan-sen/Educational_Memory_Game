import type { SymbolItem } from '../../types/game'
import { getShapeById } from '../../config/shapesRegistry'
import { GAME_CONFIG } from '../../config/gameConfig'
import styles from './SymbolRenderer.module.css'

interface SymbolRendererProps {
  item: SymbolItem
  maxHeightVh?: number
  className?: string
}

function isTextKind(kind: SymbolItem['kind']): boolean {
  return kind === 'letter' || kind === 'number'
}

export function SymbolRenderer({
  item,
  maxHeightVh = GAME_CONFIG.entityMaxHeightVh,
  className,
}: SymbolRendererProps) {
  const isText = isTextKind(item.kind)
  const style = {
    '--symbol-max-height': `${maxHeightVh}vh`,
    color: item.color,
    fontFamily: item.fontFamily,
    transform: isText ? undefined : `rotate(${item.rotationDeg}deg)`,
  } as React.CSSProperties

  if (isText) {
    const ariaLabel = item.kind === 'number' ? `Number ${item.label}` : `Letter ${item.label}`
    return (
      <div
        className={`${styles.symbol} ${styles.letter} ${className ?? ''}`}
        style={style}
        aria-label={ariaLabel}
      >
        {item.label}
      </div>
    )
  }

  const shape = getShapeById(item.shapeId ?? '')
  if (!shape) return null

  const ShapeComponent = shape.Component
  return (
    <div
      className={`${styles.symbol} ${styles.shape} ${className ?? ''}`}
      style={style}
      aria-label={shape.label}
    >
      <ShapeComponent className={styles.shapeSvg} fill={item.color} />
    </div>
  )
}
