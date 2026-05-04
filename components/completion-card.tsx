import { HankoStamp } from './hanko-stamp';

/**
 * Replaces the dashboard when the day is 5/5. The screen empties — only
 * the kanji 完 in a white circle and a short line of paper-on-sumi prose.
 *
 * The "Mark day complete" button is a deliberate departure from
 * CLAUDE.md §6 (the spec wanted day advance gated to local-midnight).
 * In practice, hitting 5/5 in the afternoon and waiting 8 h made the
 * end-of-day feel unrewarding — the button restores the satisfaction
 * loop. The reconcile rule still enforces the 5/5 requirement and the
 * 45-day cap server-side; this is purely a UX accelerant.
 *
 * On day 45 the button label changes — there is no day 46 to advance
 * into, the action sets status='completed' instead.
 */
type Props = {
  dayNumber: number;
  hoursToMidnight: number;
  /** When omitted, the card renders as a terminal state (program completed). */
  completeDay?: () => Promise<void>;
};

export function CompletionCard({ dayNumber, hoursToMidnight, completeDay }: Props) {
  const isFinalDay = dayNumber === 45;
  const isTerminal = !completeDay;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-10 py-16">
      <HankoStamp size={120} />
      <div className="space-y-3 max-w-sm">
        <p className="font-serif text-paper text-2xl">
          {isTerminal
            ? 'The path is complete.'
            : isFinalDay
              ? 'Day 45 is complete.'
              : `Day ${dayNumber} is closed.`}
        </p>
        <p className="text-stone text-sm leading-relaxed">
          {isTerminal
            ? 'Forty-five days walked. The discipline becomes the day.'
            : isFinalDay
              ? 'Forty-five days. Five practices each. The path was walked.'
              : 'Rest now, or step into the next day.'}
        </p>
      </div>

      {completeDay && (
        <form action={completeDay}>
          <button
            type="submit"
            className="inline-block border border-paper py-3 px-8 text-paper text-sm tracking-widest uppercase hover:bg-paper hover:text-sumi transition-colors"
          >
            {isFinalDay ? 'Finish the program' : 'Mark day complete'}
          </button>
        </form>
      )}

      {completeDay && !isFinalDay && hoursToMidnight > 0 && (
        <p className="text-stone text-xs tabular tracking-widest uppercase">
          or wait {hoursToMidnight} hour{hoursToMidnight === 1 ? '' : 's'} for midnight
        </p>
      )}
    </div>
  );
}
