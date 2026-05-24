'use client';

import { useState } from 'react';
import { SignaturePad } from './signature-pad';

/**
 * First-visit gate on /today: an engagement contract + signature pad.
 * The user cannot reach the daily dashboard until they sign — server
 * checks programs.signed_at on every /today render.
 *
 * The canvas drawing is NOT transmitted. The submit button stays
 * disabled until the SignaturePad reports hasInk=true. On submit, the
 * server action records new Date() into programs.signed_at and
 * revalidates /today, dropping the user into Day 1.
 */
export function ContractGate({ sign }: { sign: () => Promise<void> }) {
  const [hasInk, setHasInk] = useState(false);

  return (
    <main className="min-h-screen px-6 py-10 sm:px-10 sm:py-16 max-w-2xl mx-auto">
      <div className="space-y-10">
        <header className="space-y-3">
          <p className="font-jp text-stone text-xs tracking-[0.3em]">盟約</p>
          <h1 className="font-serif text-paper text-3xl">The contract.</h1>
          <p className="text-stone text-sm leading-relaxed">
            You have entered. Before Day 1 begins, leave your mark.
          </p>
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

        <form action={sign} className="space-y-6">
          <SignaturePad onSignedChange={setHasInk} />

          <button
            type="submit"
            disabled={!hasInk}
            className="block w-full border py-3 text-sm tracking-widest uppercase transition-colors disabled:cursor-not-allowed disabled:border-line disabled:text-stone enabled:border-paper enabled:text-paper enabled:hover:bg-paper enabled:hover:text-sumi"
          >
            Sign and walk the first evening
          </button>
        </form>

        <p className="text-stone text-xs leading-relaxed">
          Your mark is not saved. Only the moment you made it is — so the path
          remembers when you stepped onto it.
        </p>
      </div>
    </main>
  );
}
