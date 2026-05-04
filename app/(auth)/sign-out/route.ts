import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /sign-out — clears the Supabase session and bounces home.
 * Reachable via a <form action="/sign-out" method="post"> button
 * (no client JS needed). Used from the dashboard.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', request.url), { status: 302 });
}
