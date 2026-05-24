import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES, CHALLENGES, type Category } from '@/lib/challenges/catalog';
import { Proverb } from '@/components/proverb';
import heroBg from '@/public/images/hero-bg.png';

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
  kokoro: 'We sit in silence.',
  karada: 'We move the body.',
  manabu: 'We turn the pages.',
  kaku: 'We mark the day.',
  shoku: 'We drink before noise.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sumi text-paper">
      <Nav />
      <Hero />
      <FiveDisciplines />
      <Arc />
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
            Return
          </Link>
          <Link
            href="/sign-up"
            className="hidden sm:inline-block border border-line py-2 px-5 text-paper text-xs tracking-widest uppercase hover:border-paper transition-colors"
          >
            Enter
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
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Sumi veil — keeps the foreground text legible on any patch
            of the image and binds the photo to the design palette. */}
        <div className="absolute inset-0 bg-sumi/55" />
      </div>

      <div className="relative z-10 px-6 sm:px-8 max-w-3xl mx-auto text-center space-y-10">
        <p className="font-jp text-stone text-sm tracking-[0.4em]">日々</p>

        <h1 className="font-serif text-paper text-6xl sm:text-7xl lg:text-8xl leading-none tracking-tight">
          HIBI <span className="tabular">45</span>
        </h1>

        <p className="font-serif text-stone text-xl sm:text-2xl italic leading-relaxed max-w-xl mx-auto">
          We walk in silence. We start again together.
          <br />
          Forty-five days, five practices each evening.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-chalk text-sumi py-4 px-10 text-sm tracking-widest uppercase hover:bg-paper transition-colors"
          >
            Cross the threshold
          </Link>
          <Link
            href="#how"
            className="w-full sm:w-auto inline-flex items-center justify-center border border-line py-4 px-10 text-paper text-sm tracking-widest uppercase hover:border-paper transition-colors"
          >
            What awaits you
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <span className="text-stone text-xs tracking-[0.3em] uppercase">
          step in
        </span>
      </div>
    </section>
  );
}

function FiveDisciplines() {
  return (
    <section
      id="how"
      className="py-24 sm:py-32 px-6 sm:px-8 max-w-6xl mx-auto scroll-mt-14"
    >
      <header className="max-w-2xl mb-16 sm:mb-20 space-y-4">
        <p className="font-jp text-stone text-xs tracking-[0.3em]">五つの門</p>
        <h2 className="font-serif text-paper text-4xl sm:text-5xl leading-tight">
          Five gates.
          <br />
          <span className="text-stone">Walked each evening, together.</span>
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

/**
 * Progression arc — shows Day 1 → Day 45 side by side for each discipline.
 * Content pulled directly from CHALLENGES[0] and CHALLENGES[44]; the
 * landing has no duplicated copy and any future edit to the catalog
 * shows here automatically.
 */
function Arc() {
  const day1 = CHALLENGES[0];
  const day45 = CHALLENGES[44];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-6xl mx-auto border-t border-line">
      <header className="max-w-2xl mb-16 sm:mb-20 space-y-4">
        <p className="font-jp text-stone text-xs tracking-[0.3em]">道のり</p>
        <h2 className="font-serif text-paper text-4xl sm:text-5xl leading-tight">
          The path lengthens.
        </h2>
        <p className="text-stone text-base leading-relaxed max-w-lg">
          The same five gates. Walked forty-five times. The first evening is
          gentle; the last is not. We do not rush. The road carries those who
          stay on it.
        </p>
      </header>

      <ol className="space-y-px bg-line">
        {day1.map((d1, i) => {
          const d45 = day45[i];
          const cat = CATEGORIES[d1.category as Category];
          return (
            <li
              key={i}
              className="bg-sumi grid grid-cols-1 md:grid-cols-[auto_1fr_1fr] gap-4 md:gap-10 p-6 sm:p-8"
            >
              <div className="flex md:flex-col md:items-start items-baseline gap-3 md:gap-2 md:w-28">
                <span className="font-jp text-paper text-3xl leading-none">
                  {cat.kanji}
                </span>
                <span className="text-stone text-xs tracking-widest uppercase">
                  {cat.label}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-stone text-xs tabular tracking-widest uppercase">
                  Day 01
                </p>
                <p className="font-serif text-paper text-base sm:text-lg leading-snug">
                  {d1.text}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-stone text-xs tabular tracking-widest uppercase">
                  Day 45
                </p>
                <p className="font-serif text-paper text-base sm:text-lg leading-snug">
                  {d45.text}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-12 text-stone text-sm italic leading-relaxed max-w-xl">
        Between these two columns lie forty-three quiet evenings. Those who
        stay walk them one at a time.
      </p>
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
            Long enough to leave a mark. Short enough to remember the
            beginning. The Japanese seasons turn six times a year — forty-five
            evenings is the breadth of one of them.
          </p>
        </article>

        <article className="bg-sumi p-8 sm:p-12 space-y-6 min-h-[20rem] flex flex-col justify-between">
          <div className="space-y-4">
            <p className="font-jp text-stone text-xs tracking-[0.3em]">誓い</p>
            <h3 className="font-serif text-paper text-3xl sm:text-4xl leading-tight">
              The vow.
            </h3>
          </div>
          <p className="text-stone text-base leading-relaxed max-w-md">
            All five gates, every evening. Miss one — the path begins again at
            day one. We do not buy streak freezes. We do not keep score. The
            vow is what makes the days real.
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
          <p className="font-jp text-stone text-xs tracking-[0.3em]">境内の一日</p>
          <h2 className="font-serif text-paper text-4xl sm:text-5xl">
            A day in the temple.
          </h2>
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
          We do not hand out badges. We do not flaunt streaks. No notification
          will hunt you down. Only the evening, the five gates, and the quiet
          mark you leave.
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-32 sm:py-40 px-6 sm:px-8">
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroBg}
          alt=""
          fill
          quality={95}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Heavier veil for the final CTA — the type sits closer to the
            center of the image and needs more contrast than the hero. */}
        <div className="absolute inset-0 bg-sumi/75" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-10">
        <p className="font-jp text-stone text-sm tracking-[0.4em]">門</p>
        <h2 className="font-serif text-paper text-5xl sm:text-6xl leading-tight">
          The gate is open.
        </h2>
        <p className="text-stone text-lg leading-relaxed italic">
          The path waits the same way for everyone. Step in tonight, and we
          will walk the first evening together.
        </p>
        <div className="pt-4">
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center bg-chalk text-sumi py-4 px-12 text-sm tracking-widest uppercase hover:bg-paper transition-colors"
          >
            Enter the temple
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
