import { useEffect, useRef } from 'react'
import { symbolsMatch } from '../../engine/roundGenerator'
import { useGame } from '../../hooks/useGame'
import { useMonkeyMovement } from '../../hooks/useMonkeyMovement'
import { SymbolRenderer } from '../SymbolRenderer'
import { Monkey } from '../Monkey'
import { House } from '../House'
import { ThoughtBubble } from '../ThoughtBubble'
import { GreenTick } from '../GreenTick'
import styles from './GameCanvas.module.css'

export function GameCanvas() {
  const {
    phase,
    round,
    registerSymbolRef,
    registerMonkeyRef,
    checkOverlap,
  } = useGame()

  const playfieldRef = useRef<HTMLDivElement>(null)
  const houseRef = useRef<HTMLDivElement>(null)

  const movementEnabled = phase === 'play' || phase === 'prompt'
  const { monkey, monkeyRef, resetPosition } = useMonkeyMovement({
    enabled: movementEnabled,
    playfieldRef,
    houseRef,
  })

  useEffect(() => {
    registerMonkeyRef(monkeyRef.current)
  }, [registerMonkeyRef, monkeyRef, monkey])

  useEffect(() => {
    if (phase === 'memorize') {
      resetPosition()
    }
  }, [phase, resetPosition])

  useEffect(() => {
    if (!movementEnabled) return
    let raf: number
    const loop = () => {
      checkOverlap()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [movementEnabled, checkOverlap])

  if (!round) return null

  const showField = phase === 'play' || phase === 'prompt' || phase === 'complete'

  const currentTarget = round.sequence[round.currentTargetIndex]
  const activeFieldId =
    phase === 'prompt' && round.activeOverlapTargetId
      ? round.activeOverlapTargetId
      : null

  return (
    <div ref={playfieldRef} className={styles.playfield}>
      <div ref={houseRef} className={styles.houseAnchor}>
        <House />
      </div>

      {showField &&
        round.fieldSymbols.map((symbol) => {
          const isCompleted = round.completedIds.includes(symbol.id)
          const isActiveTarget =
            currentTarget && symbolsMatch(symbol, currentTarget)
          const showBubble =
            isActiveTarget &&
            activeFieldId === symbol.id &&
            round.promptKey &&
            !isCompleted

          return (
            <div
              key={symbol.id}
              ref={(el) => registerSymbolRef(symbol.id, el)}
              className={`${styles.symbolWrapper} ${isActiveTarget && phase !== 'complete' ? styles.target : ''}`}
              style={{
                left: `${symbol.position?.x ?? 50}%`,
                top: `${symbol.position?.y ?? 50}%`,
              }}
            >
              <SymbolRenderer item={symbol} />
              {showBubble && <ThoughtBubble promptKey={round.promptKey!} />}
              {isCompleted && <GreenTick />}
            </div>
          )
        })}

      {showField && (
        <Monkey
          x={monkey.x}
          y={monkey.y}
          isWalking={monkey.isWalking}
          facingRight={monkey.facingRight}
          monkeyRef={monkeyRef}
        />
      )}
    </div>
  )
}
