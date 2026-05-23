import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

// nodejs runtime (not edge) so we can read the source PNG from /public.
// next/og still produces a PNG response either way.
export const runtime = 'nodejs';
export const alt = 'HIBI 45 — 日々 — Forty-five days. Five practices each day.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Open Graph image for social shares (iMessage, X, LinkedIn, Slack, etc.).
 *
 * Same identity as the landing hero: the pagoda photo as a background,
 * a sumi veil at 60% for type contrast, then the title block centered.
 * Generated at request time by next/og's ImageResponse — no PNG to
 * pre-render or commit.
 */
export default async function OG() {
  const bgBytes = await readFile(
    path.join(process.cwd(), 'public', 'images', 'hero-bg.png'),
  );
  const bgDataUrl = `data:image/png;base64,${bgBytes.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#0a0a0a',
          fontFamily: 'serif',
        }}
      >
        <img
          src={bgDataUrl}
          alt=""
          width={1200}
          height={630}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        {/* Sumi veil for legibility. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 10, 10, 0.6)',
          }}
        />

        {/* Top-row marker (mark + kicker). */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 64,
            right: 64,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            color: '#8a8a8a',
            fontSize: 26,
            letterSpacing: '0.3em',
          }}
        >
          <div style={{ display: 'flex' }}>日々</div>
          <div
            style={{
              display: 'flex',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
            }}
          >
            day after day
          </div>
        </div>

        {/* Center title block. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f5f5f5',
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 168,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            HIBI 45
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              fontSize: 36,
              fontStyle: 'italic',
              color: '#d8d8d8',
              lineHeight: 1.35,
            }}
          >
            Forty-five days. Five practices each day.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              fontStyle: 'italic',
              color: '#d8d8d8',
              lineHeight: 1.35,
            }}
          >
            Miss one, and the path begins again.
          </div>
        </div>

        {/* Footer mark. */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            color: '#8a8a8a',
            fontSize: 22,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          <span>hibi-45.vercel.app</span>
        </div>
      </div>
    ),
    size,
  );
}
