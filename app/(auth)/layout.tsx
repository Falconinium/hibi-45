import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col px-6 py-10">
      <Link
        href="/"
        className="font-jp text-stone text-xs tracking-[0.3em] hover:text-paper transition-colors"
        aria-label="Back to home"
      >
        日々
      </Link>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </main>
  );
}
