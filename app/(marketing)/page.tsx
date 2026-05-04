import Link from 'next/link';
import { Proverb } from '@/components/proverb';

export const metadata = {
  title: 'HIBI 45 — 日々',
  description:
    'Forty-five days. Five practices each day. Miss one, and the path begins again.',
};

/**
 * Landing page. Read like a folded letter, not a launch ad. Three quiet
 * blocks: the title, the rule, the threshold (sign in / begin).
 *
 * Strict monochrome per CLAUDE.md §9. The single visual flourish is the
 * vertical line that separates the title from the body — a single hairline,
 * 1px, color-line. Nothing else.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col px-6 py-10 sm:px-10 sm:py-16">
      <header className="flex justify-between items-baseline">
        <span className="font-jp text-stone text-xs tracking-[0.3em]">日々</span>
        <Link
          href="/sign-in"
          className="text-stone text-xs tracking-widest uppercase hover:text-paper transition-colors"
        >
          Sign in
        </Link>
      </header>

      <section className="flex-1 flex items-center">
        <div className="max-w-xl space-y-12">
          <div className="space-y-6">
            <h1 className="font-serif text-5xl sm:text-6xl text-paper leading-tight">
              HIBI <span className="tabular">45</span>
            </h1>
            <p className="font-serif text-stone text-xl italic leading-relaxed">
              Forty-five days. Five practices each day.
              <br />
              Miss one, and the path begins again.
            </p>
          </div>

          <Proverb proverb={SAMPLE_PROVERB} />

          <div className="border-l border-line pl-6 space-y-3">
            <p className="text-paper text-base leading-relaxed">
              Five small disciplines: a body, a quiet, a page, a line, a glass of water.
            </p>
            <p className="text-stone text-sm leading-relaxed">
              No streaks to flaunt. No badges. No reminders to nag you. Only the day, and what
              you make of it.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/sign-up"
              className="inline-block border border-line py-3 px-8 text-paper text-sm tracking-widest uppercase hover:border-paper transition-colors"
            >
              Begin the path
            </Link>
          </div>
        </div>
      </section>

      <footer className="text-stone text-xs tracking-widest pt-12">
        <span className="font-jp">日々 · day after day</span>
      </footer>
    </main>
  );
}

// Day 1 anchor proverb. Hardcoded here (not pulled from PROVERBS[0]) so the
// landing page is fully static and the marketing copy is reviewable in one
// place. If the Day 1 proverb is ever edited in catalog/proverbs.ts, this
// snapshot is intentionally separate — the landing is a poster, not a preview.
const SAMPLE_PROVERB = {
  jp: '千里の道も一歩から',
  romaji: 'Senri no michi mo ippo kara',
  en: 'A journey of a thousand ri begins with a single step.',
};
