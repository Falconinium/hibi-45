'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Marks the vow as read. The next render of /sign-up will show the
 * email/password form instead of the vow text.
 *
 * The vow is not legally binding — it's a ritualized threshold. The
 * cookie persists 365 days so a returning visitor who already read it
 * doesn't have to read it again.
 */
export async function acknowledgeVow(): Promise<void> {
  const c = await cookies();
  c.set('hibi_vow_read', '1', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
  revalidatePath('/sign-up');
}
