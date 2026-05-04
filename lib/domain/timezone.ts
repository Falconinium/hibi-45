import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { differenceInCalendarDays } from 'date-fns';

/**
 * Timezone primitives for HIBI 45.
 *
 * Why a dedicated module? CLAUDE.md §6: a user's "today" is determined by
 * their stored IANA timezone, not by the server's clock. All day math must
 * route through here so reconciliation logic stays unit-testable and the
 * cron route (UTC-scheduled) reasons about user-local boundaries.
 *
 * Functions are pure — they accept `now` as a parameter for testability.
 * Production callers pass `new Date()`; tests pass frozen instants.
 */

/**
 * Validate an IANA timezone string by attempting a format with it.
 * Returns true for "Europe/Paris", "Asia/Tokyo", "UTC", etc.
 * Returns false for "" or anything Intl rejects.
 */
export function isValidTimezone(tz: string): boolean {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * The user's local calendar date as an ISO `YYYY-MM-DD` string.
 *
 * Example: now = 2026-05-03T22:55:00Z, tz = "Asia/Tokyo"
 *   → JST = 2026-05-04T07:55, returns "2026-05-04".
 *
 * The string form is what we store in `programs.started_on` (Postgres date).
 */
export function localTodayISO(now: Date, tz: string): string {
  return formatInTimeZone(now, tz, 'yyyy-MM-dd');
}

/**
 * The user's local calendar date as a Date object anchored at local midnight,
 * expressed as a UTC instant. Useful as a stable key for arithmetic.
 *
 * Implementation detail: we use formatInTimeZone to get the YYYY-MM-DD in the
 * user's tz, then construct a UTC date at midnight of that day. This
 * guarantees `differenceInCalendarDays(localToday, localStarted)` gives the
 * correct number of *user-local* days regardless of server tz.
 */
export function localTodayAsUtcDate(now: Date, tz: string): Date {
  const iso = localTodayISO(now, tz);
  return new Date(`${iso}T00:00:00Z`);
}

/**
 * Number of full local-calendar days between `startedOn` (a YYYY-MM-DD string)
 * and `now`, in the given tz. Always non-negative for valid inputs.
 *
 *   startedOn = "2026-05-01", tz = "Europe/Paris"
 *   now corresponding to 2026-05-04 14:00 in Paris → returns 3.
 *
 * This is the core of `reconcileProgram`: `expectedDay = daysSinceStart + 1`.
 */
export function daysSinceStart(startedOn: string, now: Date, tz: string): number {
  const startUtc = new Date(`${startedOn}T00:00:00Z`);
  const todayUtc = localTodayAsUtcDate(now, tz);
  return differenceInCalendarDays(todayUtc, startUtc);
}

/**
 * Convert an instant to the wall-clock date (year/month/day) in the given tz.
 * Exposed for components that need to render a localized date.
 */
export function localDateParts(now: Date, tz: string): { year: number; month: number; day: number } {
  const z = toZonedTime(now, tz);
  return {
    year: z.getFullYear(),
    month: z.getMonth() + 1,
    day: z.getDate(),
  };
}
