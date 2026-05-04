/**
 * The dignified reset notice. Shown once after a missed-day reset, when
 * the user returns to the app (CLAUDE.md §8). Voice: no judgement, no
 * scolding, no "you broke your streak!" — just an acknowledgment and an
 * invitation.
 *
 * The CTA dismisses the notice and shows day 1 of the new attempt.
 */
export function ResetCard({
  failedDay,
  resetCount,
  dismiss,
}: {
  failedDay: number;
  resetCount: number;
  dismiss: () => Promise<void>;
}) {
  return (
    <section className="space-y-8 py-8">
      <div className="space-y-3 max-w-md">
        <p className="font-jp text-stone text-sm tracking-widest">再び始める</p>
        <h2 className="font-serif text-paper text-2xl leading-snug">
          The path begins again.
        </h2>
        <p className="text-stone text-base leading-relaxed">
          A day was missed on day {failedDay}. The discipline asks us to start over,
          not because the past is wasted — but because what is real must be done daily.
        </p>
        {resetCount > 1 && (
          <p className="text-stone text-sm italic">
            You have begun again {resetCount} times. Each beginning is the same
            beginning, only deeper.
          </p>
        )}
      </div>

      <form action={dismiss}>
        <button
          type="submit"
          className="inline-block border border-line py-3 px-8 text-paper text-sm tracking-widest uppercase hover:border-paper transition-colors"
        >
          Begin again
        </button>
      </form>
    </section>
  );
}
