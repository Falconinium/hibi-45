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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: 'HIBI 45 — 日々',
  description:
    'A 45-day daily-discipline challenge. Five practices, every day, for forty-five days.',
  applicationName: 'HIBI 45',
  appleWebApp: {
    capable: true,
    title: 'HIBI 45',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
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
