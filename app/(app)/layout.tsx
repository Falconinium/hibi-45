import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth-gated layout. Two responsibilities beyond what middleware already
 * does (per CLAUDE.md §10):
 *
 *   1. Hard-fail to /sign-in if there's no user (middleware should have
 *      caught it, but a Server Component re-checking is defense in depth
 *      — the page below this layout assumes there IS a user).
 *
 *   2. If the user is authenticated but has no program row (can happen
 *      when sign-up email confirmation lands them here for the first
 *      time), bootstrap the program row using a sensible tz default.
 *      The "real" tz was captured at sign-up, but if that path was
 *      interrupted we recover here so the user never sees a 500.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');

  // Check if a program row exists. If not, bootstrap with UTC as a fallback;
  // the user can still finish day 1, and reconciliation will handle midnight
  // crossings correctly. The original tz was captured at sign-up — its
  // absence here means something went sideways in that flow.
  const { data: program } = await supabase
    .from('programs')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!program) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD in UTC
    await supabase.from('programs').insert({
      user_id: user.id,
      started_on: today,
      timezone: 'UTC',
    });
  }

  return <>{children}</>;
}
