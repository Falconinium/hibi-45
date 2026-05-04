'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { isValidTimezone, localTodayISO } from '@/lib/domain/timezone';

/**
 * Auth + bootstrap server actions.
 *
 * The full write API of the auth surface lives here. Two actions, both
 * progressively-enhanced (the forms post to them via the standard
 * <form action={...}> pattern, no client JS required for submission).
 *
 * Errors are returned as a `{ error: string }` shape rather than thrown,
 * because a thrown error in a Server Action shows the Next default
 * crash UI — too loud for a quiet sign-in form. The client component
 * renders the message in the same wabi-sabi voice as the rest of the UI.
 */

export type ActionResult = { error: string } | undefined;

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'At least eight characters.'),
  timezone: z.string().refine(isValidTimezone, 'Unrecognized timezone.'),
});

/**
 * Sign in an existing user with email + password.
 * Redirects to /today on success (middleware will keep them there).
 */
export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: 'Check the form and try once more.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: 'That didn’t work. Try once more.' };
  }

  redirect('/today');
}

/**
 * Create an account, then create the program row in the user's tz.
 *
 * Supabase has email confirmation enabled (default). When the user clicks
 * the confirmation link they'll come back signed in — but the program row
 * is created HERE on signup so the data exists by the time they land on
 * /today. RLS only lets the same uid read/write that row.
 */
export async function signUp(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = SignUpSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    timezone: formData.get('timezone'),
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? 'Check the form and try once more.';
    return { error: first };
  }
  const { email, password, timezone } = parsed.data;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    // 422 = email already registered, weak password, etc.
    return { error: 'Could not create the account. Check the email and try again.' };
  }
  if (!data.user) {
    // With email confirmation enabled this can happen; the program row
    // creation will be retried on first /today visit.
    redirect('/sign-in?check_email=1');
  }

  // Create the program in the user's local timezone. started_on is the user's
  // local date *now*, so day 1 is the day they signed up — not whatever date
  // the server's clock happens to read.
  const startedOn = localTodayISO(new Date(), timezone);
  const { error: progErr } = await supabase.from('programs').insert({
    user_id: data.user.id,
    started_on: startedOn,
    timezone,
  });
  if (progErr) {
    // Non-fatal: the /today page will retry the bootstrap. Surface a quiet
    // hint in case the user wonders what happened.
    return { error: 'Account created. Sign in to begin the path.' };
  }

  redirect('/today');
}
