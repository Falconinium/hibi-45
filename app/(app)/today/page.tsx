import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { reconcileForUser } from '@/lib/domain/program';
import { localDateParts } from '@/lib/domain/timezone';
import { CHALLENGES } from '@/lib/challenges/catalog';
import { PROVERBS } from '@/lib/challenges/proverbs';
import { ChallengeList } from '@/components/challenge-list';
import { CompletionCard } from '@/components/completion-card';
import { Countdown } from '@/components/countdown';
import { DayHeader } from '@/components/day-header';
import { ContractGate } from '@/components/contract-gate';
import { Proverb } from '@/components/proverb';
import { ResetCard } from '@/components/reset-card';
import {
  acknowledgeDay,
  dismissResetNotice,
  resetProgram,
  signContract,
  signOut,
  toggleChallenge,
} from './actions';

export const metadata = {
  title: 'Today — HIBI 45',
};

const MILESTONE_DAYS = new Set([7, 14, 21, 28, 35, 40, 45]);

/**
 * The single post-auth page. Server-rendered top to bottom.
 *
 * Order of operations (CLAUDE.md §6 / §7):
 *   1. Read auth.
 *   2. Read programs. If signed_at IS NULL → ContractGate (the user
 *      hasn't signed the engagement contract yet). NO reconcile runs
 *      in this branch — an unsigned program is in suspended state and
 *      must not be advanced or reset by the time the user takes to
 *      sign.
 *   3. reconcileForUser() — handles midnight crossings, advances or resets.
 *   4. Re-read program. If just reset → render ResetCard (once).
 *   5. If status === 'completed' → 完 forever.
 *   6. Otherwise render the dashboard for the current day.
 *
 * No client state library. The only client islands are <ChallengeList>
 * (optimistic toggle) and <Countdown> (re-renders every minute).
 */
export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Read the program *before* reconciling. If the user hasn't signed yet,
  // we don't want a passage past midnight to reset their not-yet-started
  // program — the contract must come first.
  const { data: preRow, error: preErr } = await supabase
    .from('programs')
    .select('signed_at')
    .eq('user_id', user.id)
    .single();
  if (preErr || !preRow) redirect('/sign-in');

  if (preRow.signed_at === null) {
    return <ContractGate sign={signContract} />;
  }

  const decision = await reconcileForUser(supabase, user.id);

  const { data: programRow, error: progErr } = await supabase
    .from('programs')
    .select('current_day, started_on, timezone, status, reset_count, last_completed_day')
    .eq('user_id', user.id)
    .single();
  if (progErr || !programRow) redirect('/sign-in');

  const program = {
    current_day: programRow.current_day,
    started_on: programRow.started_on,
    timezone: programRow.timezone,
    status: programRow.status as 'active' | 'completed' | 'reset',
    reset_count: programRow.reset_count,
    last_completed_day: programRow.last_completed_day,
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
          <CompletionCard kind="program-completed" />
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

  // The user has tapped "Mark day complete" — DB is the source of truth
  // (programs.last_completed_day). When this matches current_day, render
  // the post-ack view (Day N closed + countdown).
  const acknowledged = program.last_completed_day === program.current_day;

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

      {acknowledged ? (
        <div className="flex-1 flex items-center justify-center">
          <CompletionCard
            kind="day-acknowledged"
            dayNumber={dayNumber}
            timezone={program.timezone}
          />
        </div>
      ) : (
        <section className="mt-12 flex-1">
          <ChallengeList
            dayNumber={dayNumber}
            challenges={challenges}
            initialChecked={[...checked]}
            isFinalDay={dayNumber === 45}
            toggle={toggleChallenge}
            acknowledge={acknowledgeDay}
          />
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

