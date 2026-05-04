import type { Proverb as ProverbType } from '@/lib/challenges/proverbs';

/**
 * Proverb display block.
 *
 * Per CLAUDE.md §5: English is primary, Japanese (jp) shown small beneath,
 * romaji is hover/tap-to-reveal only — never inline in V1.
 *
 * The romaji is exposed via the native `title` attribute on the Japanese
 * line so a hover on desktop and a long-press on mobile both reveal it.
 * No JS, no portal, no tooltip library.
 */
export function Proverb({ proverb }: { proverb: ProverbType }) {
  return (
    <figure className="space-y-2">
      <blockquote className="font-serif italic text-paper text-lg leading-relaxed">
        “{proverb.en}”
      </blockquote>
      <figcaption className="font-jp text-stone text-sm" title={proverb.romaji}>
        {proverb.jp}
      </figcaption>
    </figure>
  );
}
