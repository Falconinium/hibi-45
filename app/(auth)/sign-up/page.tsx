import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { signUp } from '../actions';

export const metadata = {
  title: 'Begin — HIBI 45',
};

export default function SignUpPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-paper">Begin the path.</h1>
        <p className="text-stone text-sm">
          Forty-five days. Five practices each day. Miss one, and the path begins again.
        </p>
      </header>

      <AuthForm mode="sign-up" action={signUp} submitLabel="Begin" />

      <p className="text-stone text-sm">
        Already walking?{' '}
        <Link href="/sign-in" className="text-paper hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
