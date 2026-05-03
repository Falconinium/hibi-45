import type { Metadata } from 'next';
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
  title: 'HIBI 45 — 日々',
  description:
    'A 45-day daily-discipline challenge. Five practices, every day, for forty-five days.',
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
