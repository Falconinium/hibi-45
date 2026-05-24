'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

/**
 * Marks the vow as read. The next render of /sign-up will show the
 * contract to be signed instead of the vow text.
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

/**
 * Records the contract signature timestamp into a cookie. The user
 * doesn't have an auth.users row yet at this point (no account), so
 * we can't write to programs.signed_at directly — the cookie carries
 * the ISO timestamp through to the final signUp() action, which
 * inserts it into the programs row at account creation.
 *
 * The actual canvas ink is NOT transmitted to the server — only the
 * intent and the moment matter. Per product spec: 'on n'enregistre
 * pas la signature, juste un boolean signed'.
 */
export async function signContract(): Promise<void> {
  const c = await cookies();
  c.set('hibi_signed_at', new Date().toISOString(), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days — wide enough if the user
    // pauses before completing the form
    path: '/',
  });
  revalidatePath('/sign-up');
}
