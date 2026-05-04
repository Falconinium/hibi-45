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
 * Rule (CLAUDE.md §6):
 *   expectedDay = daysSinceStart(started_on, now, tz) + 1
 *
 *   - expectedDay <  current_day                     → no-op (clock skew)
 *   - expectedDay === current_day                    → no-op
 *   - expectedDay === current_day + 1, yesterday 5/5 → advance
 *     (or, if current_day was 45, → complete)
 *   - expectedDay === current_day + 1, yesterday <5  → reset
 *   - expectedDay >  current_day + 1                 → reset (skipped a day)
 */

export type ProgramState = {
  current_day: number;
  started_on: string; // YYYY-MM-DD in user's tz
  timezone: string;
  status: 'active' | 'completed' | 'reset';
};

export type ReconciliationDecision =
  | { kind: 'noop' }
  | { kind: 'advance'; toDay: number }
  | { kind: 'reset'; failedDay: number; newStartedOn: string }
  | { kind: 'complete' };

/** Pure decision function. */
export function reconcileProgram(
  program: ProgramState,
  yesterdayCount: number,
  now: Date,
): ReconciliationDecision {
  if (program.status !== 'active') return { kind: 'noop' };

  const expectedDay = daysSinceStart(program.started_on, now, program.timezone) + 1;

  if (expectedDay <= program.current_day) {
    return { kind: 'noop' };
  }

  if (expectedDay === program.current_day + 1 && yesterdayCount >= 5) {
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

async function countCompletions(supabase: DB, userId: string, dayNumber: number): Promise<number> {
  const { count, error } = await supabase
    .from('completions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('day_number', dayNumber);
  if (error) throw error;
  return count ?? 0;
}

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

  // reset: bump reset_count, restart at day 1, log the failure.
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
    .select('current_day, started_on, timezone, status')
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
  };

  const yesterdayCount = await countCompletions(supabase, userId, state.current_day);
  const decision = reconcileProgram(state, yesterdayCount, now);
  await applyReconciliation(supabase, userId, decision);
  return decision;
}
