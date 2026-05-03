import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Server-side Supabase client, scoped to the current request's cookies.
 *
 * Use this in Server Components, Server Actions, and route handlers. Each
 * call returns a fresh client because Next 15's `cookies()` is per-request.
 *
 * Auth (auth.uid()) is enforced by the user's JWT in the cookie. Never trust
 * a userId passed from the client — always derive it from auth.getUser().
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies. The middleware refreshes
            // the session — silently ignoring here is the documented pattern.
          }
        },
      },
    },
  );
}

/**
 * Service-role client. Bypasses RLS. Use ONLY in trusted server contexts —
 * specifically the daily cron route. Never import this from a route that
 * touches user input or runs in the browser.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'Service role client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
    );
  }
  // Service role does not use cookies — pass empty handlers so the helper
  // never reads or writes user session cookies with admin privileges.
  return createServerClient<Database>(url, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        /* no-op */
      },
    },
  });
}
