import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     *  - _next/static, _next/image (Next internals)
     *  - favicon.ico, robots.txt, sitemap.xml, *.svg|png|jpg|jpeg|gif|webp|ico
     *  - /api/cron/* (cron route uses its own CRON_SECRET, no user session)
     *  - /opengraph-image, /icon, /apple-icon, /manifest.webmanifest
     *    (Next 15 metadata file routes — scrapers like X / iMessage / Slack
     *    must reach these without an auth redirect; previously they hit
     *    middleware → 307 → /sign-in and unfurls came back blank)
     */
    '/((?!_next/static|_next/image|api/cron|opengraph-image|icon|apple-icon|manifest\\.webmanifest|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
