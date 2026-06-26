export type CharacterId = 'monkey'

export interface CharacterDefinition {
  id: CharacterId
  label: string
  /** Static pose when not moving */
  idleImage: string
  /** Animated walk cycle */
  walkGif: string
}

/** Change ACTIVE_CHARACTER to swap the playable animal. */
export const ACTIVE_CHARACTER: CharacterId = 'monkey'

const MONKEY_BASE = 'monkey'

export const CHARACTERS: Record<CharacterId, CharacterDefinition> = {
  monkey: {
    id: 'monkey',
    label: 'Monkey',
    idleImage: `${MONKEY_BASE}/idle.png`,
    walkGif: `${MONKEY_BASE}/walk.gif`,
  },
}

export function getActiveCharacter(): CharacterDefinition {
  return CHARACTERS[ACTIVE_CHARACTER]
}

export function characterAsset(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path}`
}
