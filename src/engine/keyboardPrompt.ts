import { GAME_CONFIG } from '../config/gameConfig'

export function pickRandomPromptKey(): string {
  return GAME_CONFIG.promptKeys[
    Math.floor(Math.random() * GAME_CONFIG.promptKeys.length)
  ]
}

export function formatPromptKey(key: string): string {
  if (key === ' ') return 'Space'
  if (key === 'Enter') return 'Enter'
  return key.toUpperCase()
}

export function keysMatch(pressed: string, expected: string): boolean {
  if (expected === ' ') return pressed === ' ' || pressed === 'Spacebar'
  if (expected === 'Enter') return pressed === 'Enter'
  return pressed.toLowerCase() === expected.toLowerCase()
}
