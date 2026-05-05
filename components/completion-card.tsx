import { CountdownLive } from './countdown-live';
import { HankoStamp } from './hanko-stamp';

/**
 * After-state for a closed day or a completed program.
 *
 * Two distinct shapes:
 *   - Day acknowledged on an active program: hanko + "Day N is closed" +
 *     live HH:MM:SS countdown to next local 00:01. The reconcile that
 *     actually advances the day still fires at midnight (CLAUDE.md §6).
 *   - Program completed (status === 'completed'): hanko + "The path is
 *     complete." — terminal, no countdown.
 *
 * Animations: a quiet ink-press for the hanko, then the text and the
 * countdown fade in sequentially (200ms / 400ms delays). CSS-only,
 * declared in app/globals.css. Respects prefers-reduced-motion.
 */

type Props =
  | { kind: 'day-acknowledged'; dayNumber: number; timezone: string }
  | { kind: 'program-completed' };

export function CompletionCard(props: Props) {
  if (props.kind === 'program-completed') {
    return (
      <Shell>
        <div className="space-y-3 max-w-sm hibi-anim-fade-delay-1">
          <p className="font-serif text-paper text-2xl">The path is complete.</p>
          <p className="text-stone text-sm leading-relaxed">
            Forty-five days walked. The discipline becomes the day.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-3 max-w-sm hibi-anim-fade-delay-1">
        <p className="font-jp text-stone text-sm tracking-[0.3em]">完</p>
        <p className="font-serif text-paper text-2xl">
          Day {props.dayNumber} is closed.
        </p>
        <p className="text-stone text-sm leading-relaxed">
          The next day will arrive in
        </p>
      </div>
      <div className="space-y-2 hibi-anim-fade-delay-2">
        <CountdownLive timezone={props.timezone} />
        <p className="text-stone text-xs tracking-widest uppercase">until 00:01</p>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-10 py-16">
      <div className="hibi-anim-stamp">
        <HankoStamp size={120} />
      </div>
      {children}
    </div>
  );
}
