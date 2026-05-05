import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * iOS home-screen icon — 180×180 PNG.
 *
 * iOS Safari ignores the SVG manifest icon for the home screen and
 * looks for /apple-icon.png (or this generated equivalent). Without
 * this file, "Add to Home Screen" produces a screenshot of the page
 * as the icon.
 *
 * Design: kanji 日 in paper on a sumi background, with a thin paper
 * outline ring inside the safe area to mimic the hanko stamp from
 * §9. iOS rounds the outer corners automatically.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 22,
            border: '1px solid #2a2a2a',
            borderRadius: '50%',
          }}
        />
        <span
          style={{
            color: '#f5f5f5',
            fontFamily: 'serif',
            fontSize: 110,
            lineHeight: 1,
          }}
        >
          日
        </span>
      </div>
    ),
    size,
  );
}
