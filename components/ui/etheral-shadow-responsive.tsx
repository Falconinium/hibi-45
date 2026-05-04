'use client';

import { useEffect, useState } from 'react';
import { EtherealShadow } from './etheral-shadow';

type Variant = 'hero' | 'cta';

/**
 * Responsive wrapper around EtherealShadow.
 *
 * The underlying SVG filter (feTurbulence + feDisplacementMap) at high
 * displacementScale is GPU-heavy. On mobile devices it both stutters and
 * goes off-center because the negative `inset` amplifies into a too-large
 * mask. We detect mobile once on mount and feed quieter settings.
 *
 * The threshold (768px = sm in Tailwind) matches the breakpoint where the
 * landing's hero already shifts to a smaller font. Same line in the sand.
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

  // Until matchMedia resolves, render nothing — avoids an SSR/CSR mismatch
  // and a brief flash of the heavy desktop animation on phones.
  if (isMobile === null) return null;

  const presets = {
    hero: {
      desktop: {
        color: 'rgba(245, 245, 245, 0.18)',
        animation: { scale: 100, speed: 90 },
        noise: { opacity: 0.6, scale: 1.2 },
        blurAmount: 4,
      },
      mobile: {
        color: 'rgba(245, 245, 245, 0.22)',
        animation: { scale: 40, speed: 40 },
        noise: { opacity: 0.5, scale: 1.0 },
        blurAmount: 1,
      },
    },
    cta: {
      desktop: {
        color: 'rgba(138, 138, 138, 0.3)',
        animation: { scale: 70, speed: 60 },
        noise: { opacity: 0.4, scale: 1.5 },
        blurAmount: 4,
      },
      mobile: {
        color: 'rgba(138, 138, 138, 0.32)',
        animation: { scale: 30, speed: 30 },
        noise: { opacity: 0.4, scale: 1.2 },
        blurAmount: 1,
      },
    },
  } as const;

  const cfg = presets[variant][isMobile ? 'mobile' : 'desktop'];

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
