import { useEffect } from 'react'
import styles from './Celebration.module.css'

const COLORS = ['#e63946', '#2a9d8f', '#e9c46a', '#9b5de5', '#00bbf9', '#ff6b35']

/** Confetti only — win text lives on EndScreen to avoid overlap. */
export function Celebration({ active }: { active: boolean }) {
  useEffect(() => {
    if (!active) return

    const container = document.createElement('div')
    container.className = styles.container
    document.body.appendChild(container)

    for (let i = 0; i < 60; i++) {
      const particle = document.createElement('div')
      particle.className = styles.particle
      particle.style.left = `${Math.random() * 100}%`
      particle.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]
      particle.style.animationDuration = `${1.5 + Math.random() * 2}s`
      particle.style.animationDelay = `${Math.random() * 0.5}s`
      container.appendChild(particle)
    }

    const timer = setTimeout(() => {
      container.remove()
    }, 4000)

    return () => {
      clearTimeout(timer)
      container.remove()
    }
  }, [active])

  return null
}
