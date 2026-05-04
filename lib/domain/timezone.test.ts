import { describe, it, expect } from 'vitest';
import {
  daysSinceStart,
  isValidTimezone,
  localDateParts,
  localTodayAsUtcDate,
  localTodayISO,
} from './timezone';

describe('isValidTimezone', () => {
  it.each([
    ['Europe/Paris', true],
    ['Asia/Tokyo', true],
    ['Pacific/Auckland', true],
    ['Pacific/Honolulu', true],
    ['UTC', true],
    ['', false],
    ['Not/AZone', false],
    ['Etc/GMT+25', false],
  ])('%s → %s', (tz, expected) => {
    expect(isValidTimezone(tz)).toBe(expected);
  });
});

describe('localTodayISO', () => {
  it('returns the user-local YYYY-MM-DD, not the UTC one', () => {
    // May → Paris is on CEST (UTC+2): 22:55 UTC = 00:55 next day in Paris.
    const lateUtc = new Date('2026-05-03T22:55:00Z');
    expect(localTodayISO(lateUtc, 'Europe/Paris')).toBe('2026-05-04');
    expect(localTodayISO(lateUtc, 'UTC')).toBe('2026-05-03');

    // Earlier in the same UTC day, Paris and UTC agree.
    const noonUtc = new Date('2026-05-03T12:00:00Z'); // 14:00 Paris
    expect(localTodayISO(noonUtc, 'Europe/Paris')).toBe('2026-05-03');
    expect(localTodayISO(noonUtc, 'UTC')).toBe('2026-05-03');
  });

  it('crosses local midnight in Tokyo before UTC', () => {
    // 15:30 UTC = 00:30 next day in Tokyo (JST = UTC+9)
    const t = new Date('2026-05-03T15:30:00Z');
    expect(localTodayISO(t, 'Asia/Tokyo')).toBe('2026-05-04');
    expect(localTodayISO(t, 'UTC')).toBe('2026-05-03');
  });

  it('handles dates west of UTC', () => {
    // 01:30 UTC = 17:30 previous day in Honolulu (HST = UTC-10)
    const t = new Date('2026-05-04T01:30:00Z');
    expect(localTodayISO(t, 'Pacific/Honolulu')).toBe('2026-05-03');
    expect(localTodayISO(t, 'UTC')).toBe('2026-05-04');
  });
});

describe('daysSinceStart', () => {
  it('returns 0 on the same local day', () => {
    const now = new Date('2026-05-03T12:00:00Z'); // Paris noon-ish
    expect(daysSinceStart('2026-05-03', now, 'Europe/Paris')).toBe(0);
  });

  it('returns 1 the next local day', () => {
    const now = new Date('2026-05-04T12:00:00Z');
    expect(daysSinceStart('2026-05-03', now, 'Europe/Paris')).toBe(1);
  });

  it('returns 7 a week later', () => {
    const now = new Date('2026-05-10T08:00:00Z');
    expect(daysSinceStart('2026-05-03', now, 'Europe/Paris')).toBe(7);
  });

  it('respects local midnight in Tokyo (JST=+9)', () => {
    // started at 2026-05-03 (JST). At 14:55 UTC on the 3rd it's 23:55 JST → still day 0.
    const beforeMidnightJst = new Date('2026-05-03T14:55:00Z');
    expect(daysSinceStart('2026-05-03', beforeMidnightJst, 'Asia/Tokyo')).toBe(0);

    // 15:01 UTC is 00:01 JST on the 4th → day 1.
    const afterMidnightJst = new Date('2026-05-03T15:01:00Z');
    expect(daysSinceStart('2026-05-03', afterMidnightJst, 'Asia/Tokyo')).toBe(1);
  });

  it('respects local midnight in Auckland (NZST=+12, NZDT=+13)', () => {
    // 2026-05 is winter, NZST=+12. 11:55 UTC on the 3rd = 23:55 NZST → day 0.
    const beforeMidnightNz = new Date('2026-05-03T11:55:00Z');
    expect(daysSinceStart('2026-05-03', beforeMidnightNz, 'Pacific/Auckland')).toBe(0);

    // 12:01 UTC = 00:01 NZST on the 4th → day 1.
    const afterMidnightNz = new Date('2026-05-03T12:01:00Z');
    expect(daysSinceStart('2026-05-03', afterMidnightNz, 'Pacific/Auckland')).toBe(1);
  });
});

describe('localTodayAsUtcDate', () => {
  it('anchors at UTC midnight of the user-local date', () => {
    // May, Paris CEST = UTC+2 → 22:55 UTC = 00:55 next day in Paris.
    const now = new Date('2026-05-03T22:55:00Z');
    const d = localTodayAsUtcDate(now, 'Europe/Paris');
    expect(d.toISOString()).toBe('2026-05-04T00:00:00.000Z');
  });
});

describe('localDateParts', () => {
  it('returns user-local Y/M/D as numbers', () => {
    // 12:00 UTC = 14:00 Paris (CEST) → same calendar day.
    const t = new Date('2026-05-03T12:00:00Z');
    expect(localDateParts(t, 'Europe/Paris')).toEqual({ year: 2026, month: 5, day: 3 });
    // Same instant: 21:00 in Tokyo (JST=+9) → same calendar day.
    expect(localDateParts(t, 'Asia/Tokyo')).toEqual({ year: 2026, month: 5, day: 3 });
  });
});
