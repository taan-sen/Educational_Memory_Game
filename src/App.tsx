import { GameProvider, useGame } from './hooks/useGame'
import { GameCanvas } from './components/GameCanvas'
import { MemorizeModal } from './components/MemorizeModal'
import { SequenceRecallButton } from './components/SequenceRecallButton'
import { SettingsPanel } from './components/SettingsPanel'
import { Celebration } from './components/Celebration'
import { EndScreen } from './components/EndScreen'
import styles from './App.module.css'

function GameShell() {
  const { phase } = useGame()

  return (
    <div className={styles.app}>
      <SequenceRecallButton />
      <GameCanvas />
      <MemorizeModal />
      <Celebration active={phase === 'complete'} />
      <EndScreen />
      <SettingsPanel />
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  )
}
