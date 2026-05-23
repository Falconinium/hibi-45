import type { Metadata, Viewport } from 'next';
import { EB_Garamond, Inter, Noto_Serif_JP } from 'next/font/google';
import './globals.css';

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSerifJp = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
});

const SHARE_TITLE = 'HIBI 45 — 日々';
const SHARE_DESCRIPTION =
  'Forty-five days. Five practices each day. Miss one, and the path begins again.';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: SHARE_TITLE,
  description: SHARE_DESCRIPTION,
  applicationName: 'HIBI 45',
  appleWebApp: {
    capable: true,
    title: 'HIBI 45',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  // Next auto-discovers app/opengraph-image.tsx and adds the og:image tag,
  // but we set explicit title/description/locale here too so scrapers that
  // ignore the auto-discovery (Slack v1, older Discord) still get a rich
  // unfurl. X requires twitter.card='summary_large_image' to render the
  // full 1200×630 card instead of a tiny thumbnail.
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    siteName: 'HIBI 45',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  // Lets the app paint behind the iOS status bar/notch when launched
  // from the home screen (matches statusBarStyle: 'black-translucent').
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${ebGaramond.variable} ${inter.variable} ${notoSerifJp.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
