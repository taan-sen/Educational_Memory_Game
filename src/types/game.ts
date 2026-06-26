export type GamePhase = 'idle' | 'memorize' | 'play' | 'prompt' | 'complete'

export type SymbolKind = 'letter' | 'number' | 'shape'

export interface SymbolItem {
  id: string
  kind: SymbolKind
  label?: string
  shapeId?: string
  color: string
  fontFamily: string
  rotationDeg: number
  position?: { x: number; y: number }
}

export interface RoundState {
  sequence: SymbolItem[]
  fieldSymbols: SymbolItem[]
  completedIds: string[]
  currentTargetIndex: number
  promptKey: string | null
  activeOverlapTargetId: string | null
}

export interface GameSettings {
  sequenceLength: number
  symbolsOnScreen: number
}

export interface MonkeyState {
  x: number
  y: number
  isWalking: boolean
  facingRight: boolean
}
