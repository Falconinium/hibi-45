import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { reconcileForUser } from '@/lib/domain/program';
import { localDateParts } from '@/lib/domain/timezone';
import { CHALLENGES } from '@/lib/challenges/catalog';
import { PROVERBS } from '@/lib/challenges/proverbs';
import { ChallengeRow } from '@/components/challenge-row';
import { CompletionCard } from '@/components/completion-card';
import { Countdown } from '@/components/countdown';
import { DayHeader } from '@/components/day-header';
import { Proverb } from '@/components/proverb';
import { ResetCard } from '@/components/reset-card';
import { dismissResetNotice, resetProgram, signOut, toggleChallenge } from './actions';

export const metadata = {
  title: 'Today — HIBI 45',
};

const MILESTONE_DAYS = new Set([7, 14, 21, 28, 35, 40, 45]);

/**
 * The single post-auth page. Server-rendered top to bottom.
 *
 * Order of operations (CLAUDE.md §6 / §7):
 *   1. Read auth, check for program row (layout already ensured this).
 *   2. reconcileForUser() — handles midnight crossings, advances or resets.
 *   3. Re-read program. If just reset → render ResetCard (once).
 *   4. If status === 'completed' → 完 forever.
 *   5. Otherwise render the dashboard for the current day.
 *
 * No client state library. The only client islands are <ChallengeRow>
 * (optimistic toggle) and <Countdown> (re-renders every minute).
 */
export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  const decision = await reconcileForUser(supabase, user.id);

  const { data: programRow, error: progErr } = await supabase
    .from('programs')
    .select('current_day, started_on, timezone, status, reset_count')
    .eq('user_id', user.id)
    .single();
  if (progErr || !programRow) redirect('/sign-in');

  const program = {
    current_day: programRow.current_day,
    started_on: programRow.started_on,
    timezone: programRow.timezone,
    status: programRow.status as 'active' | 'completed' | 'reset',
    reset_count: programRow.reset_count,
  };

  // Reset notice: show once after a reset, then a cookie dismisses it.
  const c = await cookies();
  const dismissed = c.get('hibi_reset_dismissed')?.value === '1';
  const justReset = decision.kind === 'reset';

  if (justReset && !dismissed) {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-16 max-w-2xl mx-auto">
        <ResetCard
          failedDay={decision.failedDay}
          resetCount={program.reset_count}
          dismiss={dismissResetNotice}
        />
      </main>
    );
  }

  if (program.status === 'completed') {
    return (
      <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-16 max-w-2xl mx-auto flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <CompletionCard dayNumber={45} hoursToMidnight={0} />
        </div>
        <SignOutFooter />
      </main>
    );
  }

  // Reset just happened but the user already dismissed the notice once before
  // — clear the cookie so a future reset shows the card again.
  if (!justReset && dismissed) {
    c.set('hibi_reset_dismissed', '', { maxAge: 0, path: '/' });
  }

  const dayNumber = program.current_day;
  const challenges = CHALLENGES[dayNumber - 1];
  const proverb = PROVERBS[dayNumber - 1];

  // Today's completions
  const { data: completions } = await supabase
    .from('completions')
    .select('challenge_index')
    .eq('user_id', user.id)
    .eq('day_number', dayNumber);

  const checked = new Set((completions ?? []).map((r) => r.challenge_index));
  const completedCount = checked.size;
  const isFiveOfFive = completedCount === 5;

  // Localized date string for the header.
  const { year, month, day } = localDateParts(new Date(), program.timezone);
  const dateLabel = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-16 max-w-2xl mx-auto flex flex-col">
      <DayHeader
        dayNumber={dayNumber}
        date={dateLabel}
        timezone={program.timezone}
        isMilestone={MILESTONE_DAYS.has(dayNumber)}
      />

      <div className="mt-12">
        <Proverb proverb={proverb} />
      </div>

      {isFiveOfFive ? (
        <div className="flex-1 flex items-center justify-center">
          <CompletionCard
            dayNumber={dayNumber}
            hoursToMidnight={hoursUntilMidnight(program.timezone)}
          />
        </div>
      ) : (
        <section className="mt-12 flex-1">
          <ul>
            {challenges.map((challenge, i) => (
              <li key={i}>
                <ChallengeRow
                  dayNumber={dayNumber}
                  challengeIndex={i}
                  category={challenge.category}
                  text={challenge.text}
                  initialChecked={checked.has(i)}
                  toggle={toggleChallenge}
                />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-stone text-xs tabular tracking-widest uppercase">
            {completedCount} / 5
          </p>
        </section>
      )}

      <footer className="mt-16 pt-6 border-t border-line flex items-center justify-between gap-4">
        <Countdown timezone={program.timezone} />
        <div className="flex items-center gap-6">
          <form action={resetProgram}>
            <button
              type="submit"
              className="text-stone text-xs tracking-widest uppercase hover:text-paper transition-colors"
            >
              Begin again
            </button>
          </form>
          <form action={signOut}>
            <button
              type="submit"
              className="text-stone text-xs tracking-widest uppercase hover:text-paper transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </footer>
    </main>
  );
}

function SignOutFooter() {
  return (
    <footer className="pt-6 border-t border-line flex justify-end">
      <form action={signOut}>
        <button
          type="submit"
          className="text-stone text-xs tracking-widest uppercase hover:text-paper transition-colors"
        >
          Sign out
        </button>
      </form>
    </footer>
  );
}

function hoursUntilMidnight(tz: string): number {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  const h = parseInt(parts.hour ?? '0', 10);
  const m = parseInt(parts.minute ?? '0', 10);
  const minsLeft = 24 * 60 - (h * 60 + m);
  return Math.max(0, Math.round(minsLeft / 60));
}
