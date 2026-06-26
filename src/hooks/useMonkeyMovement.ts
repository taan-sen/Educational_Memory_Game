import { useCallback, useEffect, useRef, useState } from 'react'
import { GAME_CONFIG } from '../config/gameConfig'
import type { MonkeyState } from '../types/game'

interface UseMonkeyMovementOptions {
  enabled: boolean
  playfieldRef: React.RefObject<HTMLElement | null>
  houseRef: React.RefObject<HTMLElement | null>
}

const INITIAL: MonkeyState = {
  x: 8,
  y: 85,
  isWalking: false,
  facingRight: true,
}

export function useMonkeyMovement({
  enabled,
  playfieldRef,
  houseRef: _houseRef,
}: UseMonkeyMovementOptions) {
  const [monkey, setMonkey] = useState<MonkeyState>(INITIAL)
  const keysRef = useRef<Set<string>>(new Set())
  const rafRef = useRef<number>(0)
  const monkeyRef = useRef<HTMLDivElement>(null)

  const resetPosition = useCallback(() => {
    setMonkey(INITIAL)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        keysRef.current.add(e.key)
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const tick = () => {
      const keys = keysRef.current
      let dx = 0
      let dy = 0
      if (keys.has('ArrowLeft')) dx -= GAME_CONFIG.monkeySpeedPx
      if (keys.has('ArrowRight')) dx += GAME_CONFIG.monkeySpeedPx
      if (keys.has('ArrowUp')) dy -= GAME_CONFIG.monkeySpeedPx
      if (keys.has('ArrowDown')) dy += GAME_CONFIG.monkeySpeedPx

      const isWalking = dx !== 0 || dy !== 0

      setMonkey((prev) => {
        if (!isWalking) return { ...prev, isWalking: false }

        const playfield = playfieldRef.current
        if (!playfield) return { ...prev, isWalking }

        const pfRect = playfield.getBoundingClientRect()
        const monkeyEl = monkeyRef.current
        const monkeyW = monkeyEl?.offsetWidth ?? 0
        const monkeyH = monkeyEl?.offsetHeight ?? 0

        let newX = prev.x + (dx / pfRect.width) * 100
        let newY = prev.y + (dy / pfRect.height) * 100

        const marginX = (monkeyW / pfRect.width) * 50
        const marginY = (monkeyH / pfRect.height) * 50

        newX = Math.max(marginX, Math.min(100 - marginX, newX))
        newY = Math.max(marginY, Math.min(78, newY))

        return {
          x: newX,
          y: newY,
          isWalking: true,
          facingRight: dx >= 0 ? (dx > 0 ? true : prev.facingRight) : false,
        }
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      cancelAnimationFrame(rafRef.current)
      keysRef.current.clear()
    }
  }, [enabled, playfieldRef])

  return { monkey, monkeyRef, resetPosition }
}
