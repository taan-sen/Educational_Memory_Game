import { useEffect, useRef, useState } from 'react'

export function useCountdown(
  seconds: number,
  active: boolean,
  onComplete: () => void,
): number {
  const [remaining, setRemaining] = useState(seconds)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!active) {
      setRemaining(seconds)
      return
    }

    setRemaining(seconds)
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onCompleteRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [active, seconds])

  return remaining
}
