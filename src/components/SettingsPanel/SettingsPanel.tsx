import { useState } from 'react'
import { useGame } from '../../hooks/useGame'
import type { GameSettings } from '../../types/game'
import styles from './SettingsPanel.module.css'

export function SettingsPanel() {
  const { settings, updateSettings, phase } = useGame()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<GameSettings>(settings)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = () => {
    setDraft(settings)
    setError(null)
    setOpen(true)
  }

  const handleSave = () => {
    const x = Math.max(1, draft.sequenceLength)
    const y = draft.symbolsOnScreen
    if (y < x) {
      setError('Symbols on screen (Y) cannot be less than sequence length (X).')
      return
    }
    updateSettings({ sequenceLength: x, symbolsOnScreen: y })
    setOpen(false)
    setError(null)
  }

  const handleYBlur = () => {
    if (draft.symbolsOnScreen < draft.sequenceLength) {
      setDraft((d) => ({ ...d, symbolsOnScreen: d.sequenceLength }))
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.gear}
        onClick={handleOpen}
        aria-label="Open settings"
      >
        ⚙️
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Game settings"
          >
            <h2 className={styles.title}>Settings</h2>
            {phase !== 'idle' && phase !== 'complete' && (
              <p className={styles.note}>Changes apply on the next round.</p>
            )}

            <label className={styles.label}>
              Sequence length (X)
              <input
                type="number"
                min={1}
                max={20}
                value={draft.sequenceLength}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    sequenceLength: parseInt(e.target.value, 10) || 1,
                  }))
                }
              />
            </label>

            <label className={styles.label}>
              Symbols on screen (Y)
              <input
                type="number"
                min={draft.sequenceLength}
                max={30}
                value={draft.symbolsOnScreen}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    symbolsOnScreen: parseInt(e.target.value, 10) || d.sequenceLength,
                  }))
                }
                onBlur={handleYBlur}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="button" className={styles.save} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
