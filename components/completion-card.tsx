import { CountdownLive } from './countdown-live';
import { HankoStamp } from './hanko-stamp';

/**
 * Replaces the dashboard when the day is 5/5.
 *
 * Two visual states:
 *   1. Unacknowledged (right after hitting 5/5): hanko + "Day N is closed"
 *      + button "Mark day complete".
 *   2. Acknowledged (after the user clicks the button): hanko + "Day N
 *      terminé" + a live HH:MM:SS countdown to the next local 00:01.
 *
 * The acknowledgment is purely a UI flip via cookie — current_day still
 * advances at local midnight per CLAUDE.md §6. The button does not skip
 * any wait; it only changes how the completion is rendered.
 *
 * On day 45 there's no countdown — acknowledging marks status='completed'
 * and the "terminal" branch of this card renders.
 */

type Props = {
  dayNumber: number;
  timezone: string;
  acknowledged: boolean;
  /** When omitted, the card renders as a terminal state (program completed). */
  acknowledgeDay?: () => Promise<void>;
};

export function CompletionCard({ dayNumber, timezone, acknowledged, acknowledgeDay }: Props) {
  const isFinalDay = dayNumber === 45;
  const isTerminal = !acknowledgeDay;

  // Terminal state — program has been marked completed (post day 45).
  if (isTerminal) {
    return (
      <Shell>
        <div className="space-y-3 max-w-sm">
          <p className="font-serif text-paper text-2xl">The path is complete.</p>
          <p className="text-stone text-sm leading-relaxed">
            Forty-five days walked. The discipline becomes the day.
          </p>
        </div>
      </Shell>
    );
  }

  // Acknowledged: show the closed-day banner + countdown to next 00:01.
  if (acknowledged) {
    return (
      <Shell>
        <div className="space-y-3 max-w-sm">
          <p className="font-jp text-stone text-sm tracking-[0.3em]">完</p>
          <p className="font-serif text-paper text-2xl">Day {dayNumber} terminé.</p>
          <p className="text-stone text-sm leading-relaxed">
            The next day will arrive in
          </p>
        </div>
        <div className="space-y-2">
          <CountdownLive timezone={timezone} />
          <p className="text-stone text-xs tracking-widest uppercase">until 00:01</p>
        </div>
      </Shell>
    );
  }

  // Unacknowledged: hanko + "close the day" button.
  return (
    <Shell>
      <div className="space-y-3 max-w-sm">
        <p className="font-serif text-paper text-2xl">
          {isFinalDay ? 'Day 45 is complete.' : `Day ${dayNumber} is closed.`}
        </p>
        <p className="text-stone text-sm leading-relaxed">
          {isFinalDay
            ? 'Forty-five days. Five practices each. The path was walked.'
            : 'Five disciplines, done. Mark the day to rest.'}
        </p>
      </div>
      <form action={acknowledgeDay}>
        <button
          type="submit"
          className="inline-block border border-paper py-3 px-8 text-paper text-sm tracking-widest uppercase hover:bg-paper hover:text-sumi transition-colors"
        >
          {isFinalDay ? 'Finish the program' : 'Mark day complete'}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-10 py-16">
      <HankoStamp size={120} />
      {children}
    </div>
  );
}
