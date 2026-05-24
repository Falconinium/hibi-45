import { cookies } from 'next/headers';
import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { ContractStep } from './contract-step';
import { signUp } from '../actions';
import { acknowledgeVow } from './actions';

export const metadata = {
  title: 'Enter — HIBI 45',
};

/**
 * Sign-up is a three-step ritual:
 *
 *   Step 1 — The Vow (誓い):
 *     The visitor reads the engagement. No form yet. Button: "I have
 *     read the vow" sets hibi_vow_read cookie (365d).
 *
 *   Step 2 — The Contract (盟約):
 *     A short engagement contract + a signature pad. The visitor draws
 *     a signature with their finger / pointer. We do NOT store the
 *     drawing — only the timestamp of when they signed. Button:
 *     "Sign and step inside" sets hibi_signed_at cookie (7d, ISO).
 *
 *   Step 3 — The Form:
 *     Email + password + tz. On submit, signUp() reads hibi_signed_at
 *     from the cookie and inserts it into programs.signed_at.
 *
 * Returning visitors with both cookies land directly on step 3.
 */
export default async function SignUpPage() {
  const c = await cookies();
  const vowRead = c.get('hibi_vow_read')?.value === '1';
  const hasSigned = !!c.get('hibi_signed_at')?.value;

  if (!vowRead) return <Vow />;
  if (!hasSigned) return <ContractStep />;
  return <Form />;
}

function Vow() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-jp text-stone text-xs tracking-[0.3em]">誓い</p>
        <h1 className="font-serif text-paper text-3xl">The vow.</h1>
      </header>

      <div className="space-y-5 font-serif text-paper text-base leading-relaxed border-l border-line pl-6">
        <p>For these forty-five evenings, I will return.</p>
        <p>
          I will sit in silence. I will move the body. I will turn the pages.
          I will mark the day. I will drink before noise.
        </p>
        <p>
          Five gates, each evening. I will close them by my own hand, not by
          any badge.
        </p>
        <p className="text-stone italic">
          If I miss an evening, I begin again at day one — without complaint,
          without leaving the path.
        </p>
      </div>

      <form action={acknowledgeVow}>
        <button
          type="submit"
          className="block w-full border border-paper py-3 text-paper text-sm tracking-widest uppercase hover:bg-paper hover:text-sumi transition-colors"
        >
          I have read the vow
        </button>
      </form>

      <p className="text-stone text-xs leading-relaxed">
        Already walking?{' '}
        <Link href="/sign-in" className="text-paper hover:underline underline-offset-4">
          Return to the path
        </Link>
      </p>
    </div>
  );
}

function Form() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="font-jp text-stone text-xs tracking-[0.3em]">入門</p>
        <h1 className="font-serif text-3xl text-paper">Step inside.</h1>
        <p className="text-stone text-sm">
          The vow is read, the contract is signed. Tonight we walk the first
          evening together.
        </p>
      </header>

      <AuthForm mode="sign-up" action={signUp} submitLabel="Enter" />

      <p className="text-stone text-sm">
        Already walking?{' '}
        <Link href="/sign-in" className="text-paper hover:underline underline-offset-4">
          Return to the path
        </Link>
      </p>
    </div>
  );
}
