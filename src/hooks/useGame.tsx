import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { GAME_CONFIG } from '../config/gameConfig'
import { pickRandomPromptKey, keysMatch } from '../engine/keyboardPrompt'
import { generateRound, symbolsMatch } from '../engine/roundGenerator'
import type { GamePhase, GameSettings, RoundState } from '../types/game'

const DEFAULT_SETTINGS: GameSettings = {
  sequenceLength: GAME_CONFIG.defaultSequenceLength,
  symbolsOnScreen: GAME_CONFIG.defaultSymbolsOnScreen,
}

function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(GAME_CONFIG.settingsStorageKey)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as GameSettings
    const x = Math.max(1, parsed.sequenceLength ?? DEFAULT_SETTINGS.sequenceLength)
    const y = Math.max(x, parsed.symbolsOnScreen ?? DEFAULT_SETTINGS.symbolsOnScreen)
    return { sequenceLength: x, symbolsOnScreen: y }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function saveSettings(settings: GameSettings) {
  localStorage.setItem(GAME_CONFIG.settingsStorageKey, JSON.stringify(settings))
}

interface GameContextValue {
  phase: GamePhase
  settings: GameSettings
  round: RoundState | null
  showSequenceRecall: boolean
  startRound: () => void
  onCountdownComplete: () => void
  nextGame: () => void
  stepUp: () => void
  updateSettings: (settings: GameSettings) => void
  toggleSequenceRecall: () => void
  registerSymbolRef: (id: string, el: HTMLElement | null) => void
  registerMonkeyRef: (el: HTMLElement | null) => void
  checkOverlap: () => void
}

const GameContext = createContext<GameContextValue | null>(null)

function createInitialRound(x: number, y: number): RoundState {
  const { sequence, fieldSymbols } = generateRound(x, y)
  return {
    sequence,
    fieldSymbols,
    completedIds: [],
    currentTargetIndex: 0,
    promptKey: null,
    activeOverlapTargetId: null,
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GamePhase>('idle')
  const [settings, setSettings] = useState<GameSettings>(loadSettings)
  const [round, setRound] = useState<RoundState | null>(null)
  const [showSequenceRecall, setShowSequenceRecall] = useState(false)
  const symbolRefs = useMemo(() => new Map<string, HTMLElement>(), [])
  const monkeyRefHolder = useMemo(() => ({ current: null as HTMLElement | null }), [])
  const hasStartedRef = useRef(false)

  const startRound = useCallback(() => {
    const newRound = createInitialRound(settings.sequenceLength, settings.symbolsOnScreen)
    setRound(newRound)
    setShowSequenceRecall(false)
    setPhase('memorize')
  }, [settings])

  const onCountdownComplete = useCallback(() => {
    setPhase('play')
  }, [])

  const nextGame = useCallback(() => {
    startRound()
  }, [startRound])

  const stepUp = useCallback(() => {
    const newX = settings.sequenceLength + 1
    const newY = Math.max(settings.symbolsOnScreen, newX)
    const updated = { sequenceLength: newX, symbolsOnScreen: newY }
    setSettings(updated)
    saveSettings(updated)
    const newRound = createInitialRound(newX, newY)
    setRound(newRound)
    setShowSequenceRecall(false)
    setPhase('memorize')
  }, [settings])

  const updateSettings = useCallback((newSettings: GameSettings) => {
    const x = Math.max(1, newSettings.sequenceLength)
    const y = Math.max(x, newSettings.symbolsOnScreen)
    const validated = { sequenceLength: x, symbolsOnScreen: y }
    setSettings(validated)
    saveSettings(validated)
  }, [])

  const toggleSequenceRecall = useCallback(() => {
    setShowSequenceRecall((v) => !v)
  }, [])

  const registerSymbolRef = useCallback(
    (id: string, el: HTMLElement | null) => {
      if (el) symbolRefs.set(id, el)
      else symbolRefs.delete(id)
    },
    [symbolRefs],
  )

  const registerMonkeyRef = useCallback(
    (el: HTMLElement | null) => {
      monkeyRefHolder.current = el
    },
    [monkeyRefHolder],
  )

  const checkOverlap = useCallback(() => {
    if (phase !== 'play' && phase !== 'prompt') return
    const currentRound = round
    if (!currentRound) return

    const target = currentRound.sequence[currentRound.currentTargetIndex]
    if (!target) return

    const fieldSymbol = currentRound.fieldSymbols.find((f) => symbolsMatch(f, target))
    if (!fieldSymbol) return

    const monkeyEl = monkeyRefHolder.current
    const symbolEl = symbolRefs.get(fieldSymbol.id)
    if (!monkeyEl || !symbolEl) return

    const monkeyRect = monkeyEl.getBoundingClientRect()
    const symbolRect = symbolEl.getBoundingClientRect()

    const interLeft = Math.max(monkeyRect.left, symbolRect.left)
    const interTop = Math.max(monkeyRect.top, symbolRect.top)
    const interRight = Math.min(monkeyRect.right, symbolRect.right)
    const interBottom = Math.min(monkeyRect.bottom, symbolRect.bottom)

    const interArea =
      Math.max(0, interRight - interLeft) * Math.max(0, interBottom - interTop)
    const monkeyArea = monkeyRect.width * monkeyRect.height
    const symbolArea = symbolRect.width * symbolRect.height
    const minArea = Math.min(monkeyArea, symbolArea)
    const ratio = minArea > 0 ? interArea / minArea : 0

    if (ratio >= GAME_CONFIG.overlapThreshold) {
      setRound((prev) => {
        if (!prev) return prev
        if (prev.promptKey && prev.activeOverlapTargetId === fieldSymbol.id) return prev
        return {
          ...prev,
          promptKey: pickRandomPromptKey(),
          activeOverlapTargetId: fieldSymbol.id,
        }
      })
      setPhase('prompt')
    } else {
      setRound((prev) => {
        if (!prev || !prev.promptKey) return prev
        return { ...prev, promptKey: null, activeOverlapTargetId: null }
      })
      if (phase === 'prompt') setPhase('play')
    }
  }, [phase, round, symbolRefs, monkeyRefHolder])

  useEffect(() => {
    if (phase !== 'play' && phase !== 'prompt') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'prompt' || !round?.promptKey) return

      if (keysMatch(e.key, round.promptKey)) {
        e.preventDefault()
        const target = round.sequence[round.currentTargetIndex]
        const fieldSymbol = round.fieldSymbols.find((f) => symbolsMatch(f, target))
        if (!fieldSymbol) return

        const newCompleted = [...round.completedIds, fieldSymbol.id]
        const nextIndex = round.currentTargetIndex + 1
        const isComplete = nextIndex >= round.sequence.length

        setRound({
          ...round,
          completedIds: newCompleted,
          currentTargetIndex: nextIndex,
          promptKey: null,
          activeOverlapTargetId: null,
        })

        if (isComplete) {
          setPhase('complete')
        } else {
          setPhase('play')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, round])

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    startRound()
  }, [startRound])

  const value: GameContextValue = {
    phase,
    settings,
    round,
    showSequenceRecall,
    startRound,
    onCountdownComplete,
    nextGame,
    stepUp,
    updateSettings,
    toggleSequenceRecall,
    registerSymbolRef,
    registerMonkeyRef,
    checkOverlap,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
