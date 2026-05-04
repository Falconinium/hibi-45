'use client';

import { useEffect, useState } from 'react';
import { EtherealShadow } from './etheral-shadow';

type Variant = 'hero' | 'cta';

/**
 * Responsive background.
 *
 * On desktop (>= 768px): full ethereal shadow with framer-motion
 * driving SVG hue rotation.
 *
 * On mobile (< 768px): a static radial gradient. The animated SVG
 * pipeline (feTurbulence + feDisplacementMap + blur) was both heavy
 * and visually broken on phones — the displaced canvas drifted off
 * the viewport, leaving black bands on the sides. A radial gradient
 * gives the same "soft glow" intention with zero JS, perfect
 * centering, and parses identically across browsers.
 */
export function EtherealShadowResponsive({ variant }: { variant: Variant }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return <MobileGradient variant={variant} />;
  }

  // Desktop: original animated shadow.
  const desktop = {
    hero: {
      color: 'rgba(245, 245, 245, 0.18)',
      animation: { scale: 100, speed: 90 },
      noise: { opacity: 0.6, scale: 1.2 },
      blurAmount: 4,
    },
    cta: {
      color: 'rgba(138, 138, 138, 0.3)',
      animation: { scale: 70, speed: 60 },
      noise: { opacity: 0.4, scale: 1.5 },
      blurAmount: 4,
    },
  } as const;

  const cfg = desktop[variant];

  return (
    <EtherealShadow
      color={cfg.color}
      animation={cfg.animation}
      noise={cfg.noise}
      blurAmount={cfg.blurAmount}
      sizing="fill"
    />
  );
}

/**
 * Static mobile background. A soft radial halo on sumi, plus a fine
 * noise overlay at very low opacity to keep the texture wabi-sabi
 * rather than digital-flat.
 */
function MobileGradient({ variant }: { variant: Variant }) {
  const haloColor = variant === 'hero' ? '245, 245, 245' : '138, 138, 138';
  const haloOpacity = variant === 'hero' ? 0.16 : 0.18;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(
            ellipse 80% 60% at 50% 50%,
            rgba(${haloColor}, ${haloOpacity}) 0%,
            rgba(${haloColor}, ${haloOpacity * 0.5}) 35%,
            transparent 75%
          ),
          radial-gradient(
            ellipse 120% 100% at 50% 100%,
            rgba(${haloColor}, ${haloOpacity * 0.4}) 0%,
            transparent 60%
          )
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
          backgroundSize: '240px',
          backgroundRepeat: 'repeat',
          opacity: 0.08,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
