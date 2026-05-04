'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { reconcileForUser } from '@/lib/domain/program';
import { localTodayISO } from '@/lib/domain/timezone';

/**
 * The full write API of /today (CLAUDE.md §7). Three actions, nothing more.
 *
 * Auth is enforced server-side by reading auth.uid() — never trust a userId
 * passed from the client. Every mutation calls reconcileForUser() first, so
 * the user can never check off a challenge for a stale day after the local
 * boundary has rolled over.
 */

const ToggleSchema = z.object({
  dayNumber: z.number().int().min(1).max(45),
  challengeIndex: z.number().int().min(0).max(4),
});

/**
 * Toggle a single challenge on the current day.
 *
 * If the row exists → delete it (uncheck).
 * If it doesn't    → insert it (check).
 *
 * The action validates that dayNumber matches the program's current_day
 * AFTER reconciliation. Editing past or future days is silently rejected
 * (returns void; the UI will revalidate and show the truth).
 */
export async function toggleChallenge(dayNumber: number, challengeIndex: number): Promise<void> {
  const parsed = ToggleSchema.safeParse({ dayNumber, challengeIndex });
  if (!parsed.success) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Reconcile first: if midnight rolled over since the last page load, we
  // either advance, reset, or complete BEFORE accepting the toggle.
  await reconcileForUser(supabase, user.id);

  // Re-read the program to find out what current_day is *now*.
  const { data: program } = await supabase
    .from('programs')
    .select('current_day, status')
    .eq('user_id', user.id)
    .single();
  if (!program || program.status !== 'active') {
    revalidatePath('/today');
    return;
  }
  if (parsed.data.dayNumber !== program.current_day) {
    // Stale UI — revalidate so the user sees the real day.
    revalidatePath('/today');
    return;
  }

  // Check current state of this slot.
  const { data: existing } = await supabase
    .from('completions')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('day_number', parsed.data.dayNumber)
    .eq('challenge_index', parsed.data.challengeIndex)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('completions')
      .delete()
      .eq('user_id', user.id)
      .eq('day_number', parsed.data.dayNumber)
      .eq('challenge_index', parsed.data.challengeIndex);
  } else {
    await supabase.from('completions').insert({
      user_id: user.id,
      day_number: parsed.data.dayNumber,
      challenge_index: parsed.data.challengeIndex,
    });
  }

  revalidatePath('/today');
}

/**
 * Manual reset (the user gives up). Same effect as a missed-day reset:
 * current_day → 1, started_on → today, increment reset_count, log.
 */
export async function resetProgram(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: program } = await supabase
    .from('programs')
    .select('current_day, timezone, reset_count')
    .eq('user_id', user.id)
    .single();
  if (!program) return;

  const newStartedOn = localTodayISO(new Date(), program.timezone);

  await supabase
    .from('programs')
    .update({
      current_day: 1,
      started_on: newStartedOn,
      status: 'active',
      reset_count: program.reset_count + 1,
    })
    .eq('user_id', user.id);

  await supabase.from('resets').insert({
    user_id: user.id,
    failed_day: program.current_day,
  });

  revalidatePath('/today');
}

/**
 * Dismiss the post-reset notice. We track "seen" via a cookie rather than
 * a DB column — the notice is purely UI sugar, not auditable state.
 */
export async function dismissResetNotice(): Promise<void> {
  const c = await cookies();
  c.set('hibi_reset_dismissed', '1', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  revalidatePath('/today');
}

/**
 * Sign out, redirect home. Form-action friendly so the dashboard footer
 * can use a plain <form action={signOut}>.
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
