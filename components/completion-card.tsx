import { CountdownLive } from './countdown-live';
import { HankoStamp } from './hanko-stamp';

/**
 * After-state for a closed day or a completed program.
 *
 * Two distinct shapes:
 *   - Day acknowledged on an active program: hanko + "Day N terminé" +
 *     live HH:MM:SS countdown to next local 00:01. The reconcile that
 *     actually advances the day still fires at midnight (CLAUDE.md §6).
 *   - Program completed (status === 'completed'): hanko + "The path is
 *     complete." — terminal, no countdown.
 *
 * The "Mark day complete" button lives on the today page itself, beneath
 * the 5 challenges, so it visually anchors to the act of checking the
 * last box. This component is purely the after-state.
 */

type Props =
  | { kind: 'day-acknowledged'; dayNumber: number; timezone: string }
  | { kind: 'program-completed' };

export function CompletionCard(props: Props) {
  if (props.kind === 'program-completed') {
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

  return (
    <Shell>
      <div className="space-y-3 max-w-sm">
        <p className="font-jp text-stone text-sm tracking-[0.3em]">完</p>
        <p className="font-serif text-paper text-2xl">
          Day {props.dayNumber} terminé.
        </p>
        <p className="text-stone text-sm leading-relaxed">
          The next day will arrive in
        </p>
      </div>
      <div className="space-y-2">
        <CountdownLive timezone={props.timezone} />
        <p className="text-stone text-xs tracking-widest uppercase">until 00:01</p>
      </div>
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
