import Link from 'next/link';
import { CATEGORIES } from '@/lib/challenges/catalog';
import { Proverb } from '@/components/proverb';
import { EtherealShadowResponsive } from '@/components/ui/etheral-shadow-responsive';

export const metadata = {
  title: 'HIBI 45 — 日々',
  description:
    'Forty-five days. Five practices each day. Miss one, and the path begins again.',
};

const SAMPLE_PROVERB = {
  jp: '千里の道も一歩から',
  romaji: 'Senri no michi mo ippo kara',
  en: 'A journey of a thousand ri begins with a single step.',
};

const CATEGORY_BLURBS: Record<keyof typeof CATEGORIES, string> = {
  kokoro: 'Five quiet minutes.',
  karada: 'A walk, a sweat, a stretch.',
  manabu: 'Pages, every day.',
  kaku: 'A few honest lines.',
  shoku: 'Water before noise.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sumi text-paper">
      <Nav />
      <Hero />
      <FiveDisciplines />
      <TwoUp />
      <SampleDay />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-sumi/60 border-b border-line">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-jp text-paper text-sm tracking-[0.3em]">
          日々
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/sign-in"
            className="text-stone text-xs tracking-widest uppercase hover:text-paper transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="hidden sm:inline-block border border-line py-2 px-5 text-paper text-xs tracking-widest uppercase hover:border-paper transition-colors"
          >
            Begin
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden flex items-center justify-center pt-14">
      <div className="absolute inset-0 -z-10">
        <EtherealShadowResponsive variant="hero" />
      </div>

      <div className="relative z-10 px-6 sm:px-8 max-w-3xl mx-auto text-center space-y-10">
        <p className="font-jp text-stone text-sm tracking-[0.4em]">日々</p>

        <h1 className="font-serif text-paper text-6xl sm:text-7xl lg:text-8xl leading-none tracking-tight">
          HIBI <span className="tabular">45</span>
        </h1>

        <p className="font-serif text-stone text-xl sm:text-2xl italic leading-relaxed max-w-xl mx-auto">
          Forty-five days. Five practices each day.
          <br />
          Miss one, and the path begins again.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-chalk text-sumi py-4 px-10 text-sm tracking-widest uppercase hover:bg-paper transition-colors"
          >
            Begin the path
          </Link>
          <Link
            href="#how"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-line py-4 px-10 text-paper text-sm tracking-widest uppercase hover:border-paper transition-colors"
          >
            How it works
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <span className="text-stone text-xs tracking-[0.3em] uppercase animate-pulse">
          scroll
        </span>
      </div>
    </section>
  );
}

function FiveDisciplines() {
  return (
    <section id="how" className="py-24 sm:py-32 px-6 sm:px-8 max-w-6xl mx-auto">
      <header className="max-w-2xl mb-16 sm:mb-20 space-y-4">
        <p className="font-jp text-stone text-xs tracking-[0.3em]">五つの道</p>
        <h2 className="font-serif text-paper text-4xl sm:text-5xl leading-tight">
          Five small disciplines.
          <br />
          <span className="text-stone">Every day, for forty-five.</span>
        </h2>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-line">
        {(Object.entries(CATEGORIES) as Array<[keyof typeof CATEGORIES, (typeof CATEGORIES)[keyof typeof CATEGORIES]]>).map(
          ([key, cat]) => (
            <li key={key} className="bg-sumi p-6 sm:p-8 space-y-4 hover:bg-charcoal transition-colors">
              <p className="font-jp text-paper text-3xl">{cat.kanji}</p>
              <div className="space-y-1">
                <p className="text-paper text-sm tracking-widest uppercase">{key}</p>
                <p className="text-stone text-xs tracking-wider uppercase">{cat.label}</p>
              </div>
              <p className="font-serif text-paper text-base italic leading-snug pt-2">
                {CATEGORY_BLURBS[key]}
              </p>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}

function TwoUp() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line">
        <article className="bg-sumi p-8 sm:p-12 space-y-6 min-h-[20rem] flex flex-col justify-between">
          <div className="space-y-4">
            <p className="font-jp text-stone text-xs tracking-[0.3em]">なぜ四十五日</p>
            <h3 className="font-serif text-paper text-3xl sm:text-4xl leading-tight">
              Why forty-five.
            </h3>
          </div>
          <p className="text-stone text-base leading-relaxed max-w-md">
            Long enough to leave a mark. Short enough to remember the beginning. The Japanese
            seasons turn six times a year — forty-five days is the breadth of one of them.
          </p>
        </article>

        <article className="bg-sumi p-8 sm:p-12 space-y-6 min-h-[20rem] flex flex-col justify-between">
          <div className="space-y-4">
            <p className="font-jp text-stone text-xs tracking-[0.3em]">規律</p>
            <h3 className="font-serif text-paper text-3xl sm:text-4xl leading-tight">
              The rule.
            </h3>
          </div>
          <p className="text-stone text-base leading-relaxed max-w-md">
            All five practices, every single day. Miss one — the path begins again at day one.
            No streak freezes. No cheat days. The discipline is what makes it real.
          </p>
        </article>
      </div>
    </section>
  );
}

function SampleDay() {
  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-4xl mx-auto">
      <div className="space-y-12">
        <header className="space-y-4 text-center">
          <p className="font-jp text-stone text-xs tracking-[0.3em]">一日</p>
          <h2 className="font-serif text-paper text-4xl sm:text-5xl">A day on the path.</h2>
        </header>

        <div className="border-t border-b border-line py-12 px-6 sm:px-12 bg-charcoal/30">
          <Proverb proverb={SAMPLE_PROVERB} />
          <ul className="mt-12 space-y-4">
            {[
              { kanji: '心', text: '5 minutes of silent breathing' },
              { kanji: '体', text: 'A 15-minute walk outside' },
              { kanji: '学', text: 'Read 5 pages of any book' },
              { kanji: '書', text: 'Write three lines about today' },
              { kanji: '食', text: 'Drink 1.5 liters of water' },
            ].map((c, i) => (
              <li
                key={i}
                className="flex items-center gap-4 py-4 border-b border-line last:border-b-0"
              >
                <div className="w-5 h-5 rounded-full border border-line shrink-0" aria-hidden />
                <p className="font-serif text-paper text-base">{c.text}</p>
                <span className="ml-auto font-jp text-stone text-sm">{c.kanji}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-stone text-xs tabular tracking-widest uppercase">
            Day 1 · 0 / 5
          </p>
        </div>

        <p className="text-stone text-sm leading-relaxed text-center max-w-xl mx-auto italic">
          No badges to flaunt. No streaks to share. No reminders to nag you. Only the day, and
          what you make of it.
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-32 sm:py-40 px-6 sm:px-8">
      <div className="absolute inset-0 -z-10 opacity-60">
        <EtherealShadowResponsive variant="cta" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-10">
        <p className="font-jp text-stone text-sm tracking-[0.4em]">道</p>
        <h2 className="font-serif text-paper text-5xl sm:text-6xl leading-tight">
          The first step is always the same.
        </h2>
        <p className="text-stone text-lg leading-relaxed">
          A journey of a thousand ri begins with a single step. Yours begins today.
        </p>
        <div className="pt-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-chalk text-sumi py-4 px-12 text-sm tracking-widest uppercase hover:bg-paper transition-colors"
          >
            Begin the path
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line py-12 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-jp text-stone text-xs tracking-[0.3em]">日々 · day after day</span>
        <span className="text-stone text-xs tracking-widest uppercase">HIBI 45</span>
      </div>
    </footer>
  );
}
