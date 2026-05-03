import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';

type CookieToSet = { name: string; value: string; options: CookieOptions };

const PUBLIC_PATHS = new Set<string>(['/', '/sign-in', '/sign-up']);
const AUTH_PATHS = new Set<string>(['/sign-in', '/sign-up']);

/**
 * Per-request session refresh + auth-aware redirects.
 *
 * Called by the root middleware.ts on every request. Refreshes the Supabase
 * session cookie if it's about to expire (must happen on every request per
 * Supabase SSR docs), then enforces:
 *
 *   - unauthenticated user hitting /today        → /sign-in
 *   - authenticated user hitting /sign-in,/sign-up → /today
 *
 * The "no-program-row → trigger startProgram" branch happens at the page
 * level, not here, so the middleware stays purely about auth state.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: don't run any code between createServerClient and getUser().
  // Supabase SSR depends on getUser() to refresh the token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && !PUBLIC_PATHS.has(path)) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PATHS.has(path)) {
    const url = request.nextUrl.clone();
    url.pathname = '/today';
    return NextResponse.redirect(url);
  }

  return response;
}
