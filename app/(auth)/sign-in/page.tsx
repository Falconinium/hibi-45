import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import { signIn } from '../actions';

export const metadata = {
  title: 'Sign in — HIBI 45',
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ check_email?: string }>;
}) {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="font-jp text-stone text-xs tracking-[0.3em]">帰参</p>
        <h1 className="font-serif text-3xl text-paper">Return to the path.</h1>
        <p className="text-stone text-sm">
          The temple is open. We have kept your place.
        </p>
      </header>

      <CheckEmailNotice searchParams={searchParams} />

      <AuthForm mode="sign-in" action={signIn} submitLabel="Return" />

      <p className="text-stone text-sm">
        New here?{' '}
        <Link href="/sign-up" className="text-paper hover:underline underline-offset-4">
          Cross the threshold
        </Link>
      </p>
    </div>
  );
}

async function CheckEmailNotice({
  searchParams,
}: {
  searchParams: Promise<{ check_email?: string }>;
}) {
  const params = await searchParams;
  if (!params.check_email) return null;
  return (
    <p className="text-stone text-sm border-l border-line pl-4 italic">
      We sent a confirmation to your email. Open it, then return here.
    </p>
  );
}
