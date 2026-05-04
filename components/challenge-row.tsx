'use client';

import { useTransition, useOptimistic } from 'react';
import { CATEGORIES, type Category } from '@/lib/challenges/catalog';

/**
 * One row in the daily challenge list.
 *
 * Click anywhere on the row to toggle. The circle fills with `chalk`
 * (white) and the text dims to stone — that's it. No toast, no haptic,
 * no checkmark icon. The fill IS the feedback.
 *
 * Optimistic update via React 19's useOptimistic — feels instant. The
 * Server Action revalidates the path on completion, so any divergence
 * (e.g. midnight rolled over and the toggle was rejected) flips back
 * automatically.
 */
export function ChallengeRow({
  dayNumber,
  challengeIndex,
  category,
  text,
  initialChecked,
  toggle,
}: {
  dayNumber: number;
  challengeIndex: number;
  category: Category;
  text: string;
  initialChecked: boolean;
  toggle: (dayNumber: number, challengeIndex: number) => Promise<void>;
}) {
  const [, startTransition] = useTransition();
  const [optimisticChecked, setOptimistic] = useOptimistic(initialChecked);

  const handleClick = () => {
    startTransition(async () => {
      setOptimistic(!optimisticChecked);
      await toggle(dayNumber, challengeIndex);
    });
  };

  const cat = CATEGORIES[category];

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={optimisticChecked}
      className="w-full flex items-start gap-4 py-5 border-b border-line text-left hover:bg-charcoal transition-colors"
    >
      <div
        className={`mt-1 w-5 h-5 rounded-full border border-line shrink-0 transition-colors ${
          optimisticChecked ? 'bg-chalk border-chalk' : 'bg-transparent'
        }`}
        aria-hidden
      />
      <div className="flex-1 space-y-1">
        <p
          className={`font-serif text-base leading-relaxed transition-colors ${
            optimisticChecked ? 'text-stone' : 'text-paper'
          }`}
        >
          {text}
        </p>
        <p className="text-stone text-xs tracking-widest uppercase">
          <span className="font-jp mr-2">{cat.kanji}</span>
          {cat.label}
        </p>
      </div>
    </button>
  );
}
