'use client';

import { useOptimistic, useTransition } from 'react';
import { CATEGORIES, type Category } from '@/lib/challenges/catalog';

type ListItem = { category: Category; text: string };

/**
 * Client island that owns the optimistic state for both the rows AND the
 * counter / acknowledge button. The counter and button update on the same
 * frame as the click, removing the perceived "lag" between hitting the
 * fifth check and the button enabling.
 *
 * The server action still runs in the background; if it ever rejects the
 * write (rare — only if the toggle hits a stale day), Next's router cache
 * will revalidate and React will reconcile the optimistic state away.
 */
export function ChallengeList({
  dayNumber,
  challenges,
  initialChecked,
  isFinalDay,
  toggle,
  acknowledge,
}: {
  dayNumber: number;
  challenges: ListItem[];
  initialChecked: number[];
  isFinalDay: boolean;
  toggle: (dayNumber: number, challengeIndex: number) => Promise<void>;
  acknowledge: () => Promise<void>;
}) {
  const [, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic(
    new Set(initialChecked),
    (state: Set<number>, idx: number): Set<number> => {
      const next = new Set(state);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    },
  );

  const onToggle = (idx: number) => {
    startTransition(async () => {
      setOptimistic(idx);
      await toggle(dayNumber, idx);
    });
  };

  const completed = optimistic.size;
  const isFiveOfFive = completed === 5;

  return (
    <>
      <ul>
        {challenges.map((c, i) => (
          <li key={i}>
            <Row
              category={c.category}
              text={c.text}
              checked={optimistic.has(i)}
              onToggle={() => onToggle(i)}
            />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-stone text-xs tabular tracking-widest uppercase">
          {completed} / 5
        </p>
        <form action={acknowledge}>
          <button
            type="submit"
            disabled={!isFiveOfFive}
            className="border py-3 px-8 text-sm tracking-widest uppercase transition-colors disabled:cursor-not-allowed disabled:border-line disabled:text-stone enabled:border-paper enabled:text-paper enabled:hover:bg-paper enabled:hover:text-sumi"
          >
            {isFinalDay ? 'Finish the program' : 'Mark day complete'}
          </button>
        </form>
      </div>
    </>
  );
}

function Row({
  category,
  text,
  checked,
  onToggle,
}: {
  category: Category;
  text: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const cat = CATEGORIES[category];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="w-full flex items-start gap-4 py-5 border-b border-line text-left hover:bg-charcoal transition-colors"
    >
      <div
        className={`mt-1 w-5 h-5 rounded-full border border-line shrink-0 transition-colors ${
          checked ? 'bg-chalk border-chalk' : 'bg-transparent'
        }`}
        aria-hidden
      />
      <div className="flex-1 space-y-1">
        <p
          className={`font-serif text-base leading-relaxed transition-colors ${
            checked ? 'text-stone' : 'text-paper'
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
