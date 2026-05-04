/**
 * The header at the top of /today.
 *
 *   Day [N] / 45
 *   May 4, 2026 · Asia/Tokyo
 *
 * The current day's number rendered in chalk (the only place chalk-on-sumi
 * is used outside the hanko, per CLAUDE.md §9). All other text is paper or
 * stone. Tabular numerals on the day counter so it doesn't shift width.
 */
export function DayHeader({
  dayNumber,
  date,
  timezone,
  isMilestone,
}: {
  dayNumber: number;
  date: string; // localized "May 4, 2026"
  timezone: string;
  isMilestone: boolean;
}) {
  return (
    <header className="space-y-2">
      <h1 className="font-serif text-paper text-base tracking-widest uppercase">
        Day{' '}
        <span className="tabular text-chalk text-xl">{dayNumber}</span>
        <span className="text-stone"> / 45</span>
        {isMilestone && (
          <span className="ml-3 font-jp text-stone text-sm" title="Milestone day">
            節目
          </span>
        )}
      </h1>
      <p className="text-stone text-xs tabular">
        {date}
        <span className="mx-2 text-line">·</span>
        <span className="font-jp">{timezone}</span>
      </p>
    </header>
  );
}
