/**
 * Hanko stamp — the "ink press" seal shown on a 5/5 day.
 *
 * Per CLAUDE.md §9: white circular outline, kanji 完 in white serif inside,
 * subtle noise texture for hand-pressed feel, intentional ~−3° rotation.
 *
 * Pure inline SVG. No external assets. Renders identically server-side.
 */
export function HankoStamp({ size = 96, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Day complete — kanji 完"
    >
      <defs>
        <filter id="hanko-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.06 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <g transform="rotate(-3 50 50)">
        <circle cx="50" cy="50" r="44" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="42"
          fill="#FFFFFF"
        >
          完
        </text>
        <circle cx="50" cy="50" r="44" fill="#FFFFFF" filter="url(#hanko-noise)" />
      </g>
    </svg>
  );
}
