'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignaturePad } from '@/components/signature-pad';
import { signContract } from './actions';

/**
 * Step 2 of /sign-up: the engagement contract + signature pad.
 *
 * The submit button stays disabled until the user has actually drawn
 * something on the canvas (the SignaturePad reports `hasInk` upward).
 * On submit, signContract() server action sets the hibi_signed_at
 * cookie; the page reloads and falls into step 3 (the form).
 */
export function ContractStep() {
  const [hasInk, setHasInk] = useState(false);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-jp text-stone text-xs tracking-[0.3em]">盟約</p>
        <h1 className="font-serif text-paper text-3xl">The contract.</h1>
      </header>

      <article className="space-y-5 font-serif text-paper text-base leading-relaxed border-l border-line pl-6">
        <p>
          I, the undersigned, choose to walk forty-five evenings on this path.
        </p>
        <p>
          I will give what each evening asks for — no more out of pride, no
          less out of fatigue. I will close the five gates by my own hand and
          not look for shortcuts.
        </p>
        <p>
          I understand that the path is not a wall but a thread. If I let it
          fall, I will pick it up again from the first evening, without
          bitterness.
        </p>
        <p className="text-stone italic">
          This contract is not enforced by anyone but me. That is the entire
          point.
        </p>
      </article>

      <form action={signContract} className="space-y-6">
        <SignaturePad onSignedChange={setHasInk} />

        <button
          type="submit"
          disabled={!hasInk}
          className="block w-full border py-3 text-sm tracking-widest uppercase transition-colors disabled:cursor-not-allowed disabled:border-line disabled:text-stone enabled:border-paper enabled:text-paper enabled:hover:bg-paper enabled:hover:text-sumi"
        >
          Sign and step inside
        </button>
      </form>

      <p className="text-stone text-xs leading-relaxed">
        Your mark is not saved. Only the moment you made it is — so the path
        remembers when you stepped onto it.
      </p>

      <p className="text-stone text-xs leading-relaxed">
        Already walking?{' '}
        <Link href="/sign-in" className="text-paper hover:underline underline-offset-4">
          Return to the path
        </Link>
      </p>
    </div>
  );
}
