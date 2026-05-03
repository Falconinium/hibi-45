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
     */
    '/((?!_next/static|_next/image|api/cron|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
