import { HankoStamp } from './hanko-stamp';

/**
 * Replaces the dashboard when the day is 5/5. The screen empties — only
 * the kanji 完 in a white circle and a short line of paper-on-sumi prose.
 * No "next" button: the next day reveals itself when the local clock rolls
 * past midnight (per the day-boundary rule in CLAUDE.md §6).
 */
export function CompletionCard({
  dayNumber,
  hoursToMidnight,
}: {
  dayNumber: number;
  hoursToMidnight: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-10 py-16">
      <HankoStamp size={120} />
      <div className="space-y-3 max-w-sm">
        <p className="font-serif text-paper text-2xl">
          Day {dayNumber} is closed.
        </p>
        <p className="text-stone text-sm leading-relaxed">
          Rest now. The next day will arrive in its own time
          {hoursToMidnight > 0 && (
            <span className="tabular">
              {' '}
              — about {hoursToMidnight} hour{hoursToMidnight === 1 ? '' : 's'}
            </span>
          )}
          .
        </p>
      </div>
    </div>
  );
}
