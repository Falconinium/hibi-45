import type { SupabaseClient } from '@supabase/supabase-js';
import { daysSinceStart, localTodayISO } from './timezone';
import type { Database } from '@/lib/supabase/types';

/**
 * Program reconciliation — the heart of HIBI 45's discipline rule.
 *
 * Every page load of /today and every run of the daily cron call
 * reconcileForUser() to compute what should happen next given the user's
 * current state and the wall clock in their tz.
 *
 * Logic is split in two:
 *   - reconcileProgram(): pure decision function. No IO, no Date.now().
 *     All inputs are parameters. Trivially unit-testable.
 *   - applyReconciliation() / reconcileForUser(): IO layer that reads the
 *     program row + completion count and applies the decision.
 *
 * Rule (revised — supersedes CLAUDE.md §6 "yesterday 5/5"):
 *   A day is considered "completed" ONLY when the user has explicitly
 *   clicked "Mark day complete", which sets programs.last_completed_day
 *   to the current_day. Silently checking the 5 boxes without acknowledging
 *   does NOT count: at midnight, such a user resets just like one who
 *   checked four. The click is the act of closing the day.
 *
 *   expectedDay = daysSinceStart(started_on, now, tz) + 1
 *
 *   - expectedDay <  current_day                              → noop (clock skew)
 *   - expectedDay === current_day                             → noop
 *   - expectedDay === current_day + 1, last_completed=current → advance
 *     (or, if current_day was 45, → complete)
 *   - expectedDay === current_day + 1, last_completed<current → reset
 *   - expectedDay >  current_day + 1                          → reset (skipped)
 */

export type ProgramState = {
  current_day: number;
  started_on: string; // YYYY-MM-DD in user's tz
  timezone: string;
  status: 'active' | 'completed' | 'reset';
  last_completed_day: number; // 0 if no day has been explicitly acknowledged yet
};

export type ReconciliationDecision =
  | { kind: 'noop' }
  | { kind: 'advance'; toDay: number }
  | { kind: 'reset'; failedDay: number; newStartedOn: string }
  | { kind: 'complete' };

/** Pure decision function. */
export function reconcileProgram(program: ProgramState, now: Date): ReconciliationDecision {
  if (program.status !== 'active') return { kind: 'noop' };

  const expectedDay = daysSinceStart(program.started_on, now, program.timezone) + 1;

  if (expectedDay <= program.current_day) {
    return { kind: 'noop' };
  }

  // The user must have explicitly acknowledged current_day to advance.
  const acknowledged = program.last_completed_day === program.current_day;

  if (expectedDay === program.current_day + 1 && acknowledged) {
    if (program.current_day === 45) return { kind: 'complete' };
    return { kind: 'advance', toDay: program.current_day + 1 };
  }

  return {
    kind: 'reset',
    failedDay: program.current_day,
    newStartedOn: localTodayISO(now, program.timezone),
  };
}

/** Type alias used by all IO helpers below. */
type DB = SupabaseClient<Database>;

/** Apply a reconciliation decision. Pure IO; no business logic. */
export async function applyReconciliation(
  supabase: DB,
  userId: string,
  decision: ReconciliationDecision,
): Promise<void> {
  if (decision.kind === 'noop') return;

  if (decision.kind === 'advance') {
    const { error } = await supabase
      .from('programs')
      .update({ current_day: decision.toDay })
      .eq('user_id', userId);
    if (error) throw error;
    return;
  }

  if (decision.kind === 'complete') {
    const { error } = await supabase
      .from('programs')
      .update({ status: 'completed' })
      .eq('user_id', userId);
    if (error) throw error;
    return;
  }

  // reset: wipe all completions, bump reset_count, restart at day 1, log.
  // Deleting completions matches the 75-hard-style strict mode (CLAUDE.md
  // intro): a reset rends the slate blank. Otherwise, completions from
  // before the reset would shadow the new attempt's day numbers and the
  // user would see ghost checks on a brand-new Day 1.
  const { error: delErr } = await supabase
    .from('completions')
    .delete()
    .eq('user_id', userId);
  if (delErr) throw delErr;

  const { data: current } = await supabase
    .from('programs')
    .select('reset_count')
    .eq('user_id', userId)
    .single();
  const nextResetCount = (current?.reset_count ?? 0) + 1;

  const { error: resetErr } = await supabase
    .from('programs')
    .update({
      current_day: 1,
      started_on: decision.newStartedOn,
      status: 'active',
      reset_count: nextResetCount,
      last_completed_day: 0,
    })
    .eq('user_id', userId);
  if (resetErr) throw resetErr;

  // Audit log. Best-effort: a failure here doesn't undo the reset above.
  await supabase.from('resets').insert({
    user_id: userId,
    failed_day: decision.failedDay,
  });
}

/** Read state, decide, apply, return decision. */
export async function reconcileForUser(
  supabase: DB,
  userId: string,
  now: Date = new Date(),
): Promise<ReconciliationDecision> {
  const { data: program, error } = await supabase
    .from('programs')
    .select('current_day, started_on, timezone, status, last_completed_day')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  if (!program) return { kind: 'noop' };

  // status is `text` in Postgres with a CHECK constraint (see 0001_init.sql),
  // so the runtime values are guaranteed to be one of the three. TS can't see
  // the CHECK constraint, hence the narrowing here.
  const state: ProgramState = {
    current_day: program.current_day,
    started_on: program.started_on,
    timezone: program.timezone,
    status: program.status as ProgramState['status'],
    last_completed_day: program.last_completed_day,
  };

  const decision = reconcileProgram(state, now);
  await applyReconciliation(supabase, userId, decision);
  return decision;
}
