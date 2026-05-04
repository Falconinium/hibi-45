'use client';

import { useActionState, useEffect, useState } from 'react';
import type { ActionResult } from '@/app/(auth)/actions';

type Props = {
  mode: 'sign-in' | 'sign-up';
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
};

/**
 * Shared sign-in / sign-up form.
 *
 * On sign-up the user's IANA timezone is captured silently from the browser
 * and submitted as a hidden input. CLAUDE.md §10 calls this out explicitly:
 * the tz is set once at sign-up and never auto-updated, so a user who travels
 * mid-program can't game the day boundary.
 */
export function AuthForm({ mode, action, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(action, undefined);
  const [tz, setTz] = useState('');

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-stone text-xs tracking-widest uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="block w-full bg-transparent border-b border-line focus:border-paper outline-none py-2 text-paper text-base placeholder:text-stone transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-stone text-xs tracking-widest uppercase">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
          required
          minLength={mode === 'sign-up' ? 8 : undefined}
          className="block w-full bg-transparent border-b border-line focus:border-paper outline-none py-2 text-paper text-base placeholder:text-stone transition-colors"
        />
      </div>

      {mode === 'sign-up' && <input type="hidden" name="timezone" value={tz} />}

      {state?.error && (
        <p className="text-stone text-sm" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || (mode === 'sign-up' && !tz)}
        className="block w-full border border-line py-3 text-paper text-sm tracking-widest uppercase hover:border-paper disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? '...' : submitLabel}
      </button>
    </form>
  );
}
