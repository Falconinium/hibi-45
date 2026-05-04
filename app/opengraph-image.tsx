import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'HIBI 45 — 日々 — Forty-five days. Five practices each day.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph image for social cards. Static, monochrome, intentional.
 * Generated as a PNG at request time so X/Twitter/Facebook accept it
 * (they reject SVG).
 */
export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          color: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 32, color: '#8a8a8a', letterSpacing: '0.3em' }}>日々</div>
          <div style={{ fontSize: 22, color: '#8a8a8a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            day after day
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 144, lineHeight: 1, letterSpacing: '-0.02em' }}>
            HIBI 45
          </div>
          <div style={{ fontSize: 36, color: '#8a8a8a', fontStyle: 'italic', lineHeight: 1.3 }}>
            Forty-five days. Five practices each day.
            <br />
            Miss one, and the path begins again.
          </div>
        </div>

        <div style={{ fontSize: 22, color: '#8a8a8a', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          hibi-45
        </div>
      </div>
    ),
    size,
  );
}
