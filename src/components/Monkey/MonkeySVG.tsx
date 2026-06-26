import styles from './MonkeySVG.module.css'

interface MonkeySVGProps {
  isWalking: boolean
  facingRight: boolean
}

export function MonkeySVG({ isWalking, facingRight }: MonkeySVGProps) {
  return (
    <svg
      viewBox="0 0 80 90"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.monkey}
      style={{ transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)' }}
      aria-hidden="true"
    >
      {/* ── Tail ── */}
      <path
        d="M 58 55 Q 75 45 72 30 Q 70 18 62 22"
        fill="none"
        stroke="#7B4A1E"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* ── Back leg ── */}
      <g className={isWalking ? styles.legBackWalk : undefined} style={{ transformOrigin: '30px 60px' }}>
        <rect x="24" y="59" width="12" height="22" rx="6" fill="#8B5E2A" />
        {/* foot */}
        <ellipse cx="30" cy="82" rx="8" ry="5" fill="#6B3F0E" />
      </g>

      {/* ── Front leg ── */}
      <g className={isWalking ? styles.legFrontWalk : undefined} style={{ transformOrigin: '50px 60px' }}>
        <rect x="44" y="59" width="12" height="22" rx="6" fill="#A0712A" />
        {/* foot */}
        <ellipse cx="50" cy="82" rx="8" ry="5" fill="#6B3F0E" />
      </g>

      {/* ── Body ── */}
      <ellipse cx="40" cy="55" rx="22" ry="18" fill="#A0712A" />

      {/* ── Belly patch ── */}
      <ellipse cx="40" cy="57" rx="13" ry="11" fill="#D4A96A" />

      {/* ── Back arm ── */}
      <g className={isWalking ? styles.armBackWalk : undefined} style={{ transformOrigin: '22px 48px' }}>
        <rect x="16" y="43" width="10" height="20" rx="5" fill="#8B5E2A" />
        <ellipse cx="21" cy="64" rx="6" ry="4" fill="#6B3F0E" />
      </g>

      {/* ── Front arm ── */}
      <g className={isWalking ? styles.armFrontWalk : undefined} style={{ transformOrigin: '58px 48px' }}>
        <rect x="53" y="43" width="10" height="20" rx="5" fill="#A0712A" />
        <ellipse cx="58" cy="64" rx="6" ry="4" fill="#6B3F0E" />
      </g>

      {/* ── Head ── */}
      <ellipse cx="40" cy="28" rx="18" ry="17" fill="#A0712A" />

      {/* ── Ear left ── */}
      <ellipse cx="22" cy="27" rx="7" ry="6" fill="#8B5E2A" />
      <ellipse cx="22" cy="27" rx="4" ry="3.5" fill="#D4A96A" />

      {/* ── Ear right ── */}
      <ellipse cx="58" cy="27" rx="7" ry="6" fill="#8B5E2A" />
      <ellipse cx="58" cy="27" rx="4" ry="3.5" fill="#D4A96A" />

      {/* ── Face ── */}
      <ellipse cx="40" cy="32" rx="12" ry="10" fill="#D4A96A" />

      {/* ── Eyes ── */}
      <circle cx="34" cy="24" r="4" fill="white" />
      <circle cx="46" cy="24" r="4" fill="white" />
      <circle cx="35" cy="25" r="2.2" fill="#1a1a1a" />
      <circle cx="47" cy="25" r="2.2" fill="#1a1a1a" />
      {/* eye shine */}
      <circle cx="35.8" cy="24.2" r="0.8" fill="white" />
      <circle cx="47.8" cy="24.2" r="0.8" fill="white" />

      {/* ── Nose ── */}
      <ellipse cx="40" cy="30" rx="4" ry="2.5" fill="#8B5E2A" />
      <circle cx="38.5" cy="30" r="1" fill="#5a2d00" />
      <circle cx="41.5" cy="30" r="1" fill="#5a2d00" />

      {/* ── Mouth ── */}
      <path d="M 36 34 Q 40 38 44 34" fill="none" stroke="#6B3F0E" strokeWidth="1.5" strokeLinecap="round" />

      {/* ── Brow (friendly) ── */}
      <path d="M 31 21 Q 34 19 37 21" fill="none" stroke="#6B3F0E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 43 21 Q 46 19 49 21" fill="none" stroke="#6B3F0E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
