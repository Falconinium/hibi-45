import { ImageResponse } from 'next/og';

export const runtime = 'edge';
// 512×512 covers the manifest's any-size icon AND scales down cleanly
// for the browser tab favicon (Chrome/Firefox/Safari downsize crisply).
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

/**
 * App icon — 512×512 PNG generated at request time. Used by:
 *   - Browser tabs (downsized to ~32 px by the browser)
 *   - Android home screen via the manifest
 *
 * iOS does NOT use this — it reads /apple-icon (app/apple-icon.tsx).
 *
 * Kanji 日 in paper on a sumi background, serif. The thin line ring
 * mirrors the hanko stamp circle from §9 so the icon is visually
 * continuous with the in-app completion seal.
 */
export default function Icon() {
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
            inset: 64,
            border: '3px solid #2a2a2a',
            borderRadius: '50%',
          }}
        />
        <span
          style={{
            color: '#f5f5f5',
            fontFamily: 'serif',
            fontSize: 320,
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
