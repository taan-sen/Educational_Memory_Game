import { GAME_CONFIG } from '../config/gameConfig'
import { SHAPE_IDS } from '../config/shapesRegistry'
import type { SymbolItem } from '../types/game'

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function createId(): string {
  return crypto.randomUUID()
}

function pickTextVisualIdentity(): Pick<SymbolItem, 'color' | 'fontFamily' | 'rotationDeg'> {
  return {
    color: randomFrom(GAME_CONFIG.colorPalette),
    fontFamily: randomFrom(GAME_CONFIG.fontFamilies),
    rotationDeg: 0,
  }
}

function pickShapeVisualIdentity(): Pick<SymbolItem, 'color' | 'fontFamily' | 'rotationDeg'> {
  return {
    color: randomFrom(GAME_CONFIG.colorPalette),
    fontFamily: randomFrom(GAME_CONFIG.fontFamilies),
    rotationDeg: Math.floor(Math.random() * 360),
  }
}

function createLetterSymbol(): SymbolItem {
  return {
    id: createId(),
    kind: 'letter',
    label: randomFrom(GAME_CONFIG.letterPool),
    ...pickTextVisualIdentity(),
  }
}

function createNumberSymbol(): SymbolItem {
  return {
    id: createId(),
    kind: 'number',
    label: randomFrom(GAME_CONFIG.numberPool),
    ...pickTextVisualIdentity(),
  }
}

function createShapeSymbol(): SymbolItem {
  return {
    id: createId(),
    kind: 'shape',
    shapeId: randomFrom(SHAPE_IDS),
    ...pickShapeVisualIdentity(),
  }
}

function createRandomSymbol(): SymbolItem {
  const roll = Math.random()
  if (roll < 0.33) return createLetterSymbol()
  if (roll < 0.66) return createNumberSymbol()
  return createShapeSymbol()
}

function symbolKey(item: SymbolItem): string {
  if (item.kind === 'letter') return `letter:${item.label}`
  if (item.kind === 'number') return `number:${item.label}`
  return `shape:${item.shapeId}`
}

function isSameSymbol(a: SymbolItem, b: SymbolItem): boolean {
  return symbolKey(a) === symbolKey(b)
}

function pickUniqueSymbols(count: number): SymbolItem[] {
  const result: SymbolItem[] = []
  const usedKeys = new Set<string>()
  let attempts = 0
  const maxAttempts = count * 50

  while (result.length < count && attempts < maxAttempts) {
    attempts++
    const candidate = createRandomSymbol()
    const key = symbolKey(candidate)
    if (usedKeys.has(key)) continue
    usedKeys.add(key)
    result.push(candidate)
  }

  return result
}

function pickDecoy(exclude: SymbolItem[]): SymbolItem {
  const excludeKeys = new Set(exclude.map(symbolKey))
  let attempts = 0
  while (attempts < 100) {
    attempts++
    const candidate = createRandomSymbol()
    if (!excludeKeys.has(symbolKey(candidate))) return candidate
  }
  return createRandomSymbol()
}

interface PlacementBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

function boxesOverlap(
  a: { x: number; y: number },
  b: { x: number; y: number },
  minDistance: number,
): boolean {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy) < minDistance
}

function placeSymbols(
  symbols: SymbolItem[],
  bounds: PlacementBounds,
): SymbolItem[] {
  const placed: SymbolItem[] = []
  const minDistance = 12

  for (const symbol of symbols) {
    let position: { x: number; y: number } | null = null
    for (let attempt = 0; attempt < 200; attempt++) {
      const candidate = {
        x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
        y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
      }
      const overlaps = placed.some(
        (p) => p.position && boxesOverlap(candidate, p.position, minDistance),
      )
      if (!overlaps) {
        position = candidate
        break
      }
    }
    placed.push({
      ...symbol,
      position: position ?? {
        x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
        y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
      },
    })
  }

  return placed
}

export function generateRound(sequenceLength: number, symbolsOnScreen: number): {
  sequence: SymbolItem[]
  fieldSymbols: SymbolItem[]
} {
  const x = Math.max(1, sequenceLength)
  const y = Math.max(x, symbolsOnScreen)

  const sequence = pickUniqueSymbols(x)
  const decoyCount = y - x
  const decoys: SymbolItem[] = []
  const allSoFar = [...sequence]

  for (let i = 0; i < decoyCount; i++) {
    const decoy = pickDecoy(allSoFar)
    decoys.push(decoy)
    allSoFar.push(decoy)
  }

  const fieldPool = [...sequence, ...decoys]
  const shuffled = [...fieldPool].sort(() => Math.random() - 0.5)

  const bounds: PlacementBounds = {
    minX: 8,
    maxX: 92,
    minY: 8,
    maxY: 72,
  }

  const fieldSymbols = placeSymbols(shuffled, bounds)

  return { sequence, fieldSymbols }
}

export function findFieldSymbolForTarget(
  fieldSymbols: SymbolItem[],
  target: SymbolItem,
): SymbolItem | undefined {
  return fieldSymbols.find((f) => isSameSymbol(f, target))
}

export function symbolsMatch(a: SymbolItem, b: SymbolItem): boolean {
  return isSameSymbol(a, b)
}

export { isSameSymbol, symbolKey }
