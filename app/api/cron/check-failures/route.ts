import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { reconcileForUser } from '@/lib/domain/program';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Daily reconciliation cron — the safety net that CLAUDE.md §6 demands.
 *
 * Vercel Cron triggers this once per day at 00:15 UTC (see vercel.json).
 * Without it, an inactive user who failed day 7 would still see "Day 7"
 * the next time they opened the app a month later — the page-load
 * reconcile would fire then, but the audit log would be empty and the
 * stats off by weeks. Running daily keeps the database honest.
 *
 * For each `active` program we call reconcileForUser(); the function
 * itself is timezone-aware, so a user in Pacific/Honolulu (still mid-day
 * at 00:15 UTC) is correctly left as a no-op while a Pacific/Auckland
 * user (12 h past their local midnight) is advanced or reset.
 *
 * Auth: Vercel sets `Authorization: Bearer ${CRON_SECRET}` on every
 * scheduled call. We verify the bearer matches before doing anything.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 500 },
    );
  }
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date();

  // Fetch every active program. Even at 100k users this fits in one response.
  // If we ever need pagination, switch to a cursored loop.
  const { data: programs, error } = await supabase
    .from('programs')
    .select('user_id')
    .eq('status', 'active');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts = { processed: 0, advance: 0, reset: 0, complete: 0, noop: 0, errors: 0 };

  for (const { user_id } of programs ?? []) {
    try {
      const decision = await reconcileForUser(supabase, user_id, now);
      counts.processed++;
      counts[decision.kind]++;
    } catch {
      counts.errors++;
      // One user's failure doesn't stop the run; the next cron will retry.
    }
  }

  return NextResponse.json({ ok: true, ...counts });
}
