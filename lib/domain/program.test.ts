import { describe, it, expect } from 'vitest';
import { reconcileProgram, type ProgramState } from './program';

const baseProgram = (overrides: Partial<ProgramState> = {}): ProgramState => ({
  current_day: 5,
  started_on: '2026-05-01',
  timezone: 'Europe/Paris',
  status: 'active',
  ...overrides,
});

describe('reconcileProgram — happy path', () => {
  it('no-op when same local day, regardless of completion count', () => {
    // started 2026-05-01, current_day=5 → user is on local day 5 (2026-05-05).
    const now = new Date('2026-05-05T08:00:00Z'); // 10:00 Paris
    expect(reconcileProgram(baseProgram(), 0, now)).toEqual({ kind: 'noop' });
    expect(reconcileProgram(baseProgram(), 4, now)).toEqual({ kind: 'noop' });
    expect(reconcileProgram(baseProgram(), 5, now)).toEqual({ kind: 'noop' });
  });

  it('advances when next local day begins and yesterday was 5/5', () => {
    // started 2026-05-01, current_day=5, now is 2026-05-06 in Paris
    const now = new Date('2026-05-06T08:00:00Z');
    expect(reconcileProgram(baseProgram(), 5, now)).toEqual({
      kind: 'advance',
      toDay: 6,
    });
  });
});

describe('reconcileProgram — reset paths', () => {
  it('resets when next local day begins and yesterday was incomplete', () => {
    const now = new Date('2026-05-06T08:00:00Z');
    expect(reconcileProgram(baseProgram(), 4, now)).toEqual({
      kind: 'reset',
      failedDay: 5,
      newStartedOn: '2026-05-06',
    });
  });

  it('resets when more than one day has passed (skipped a day)', () => {
    // current_day=5, started_on=2026-05-01, now=2026-05-08 → expectedDay=8, gap=2
    const now = new Date('2026-05-08T10:00:00Z');
    expect(reconcileProgram(baseProgram(), 5, now)).toEqual({
      kind: 'reset',
      failedDay: 5,
      newStartedOn: '2026-05-08',
    });
  });

  it('records reset newStartedOn in the user tz, not server tz', () => {
    // user in Tokyo: 14:55 UTC on the 5th = 23:55 JST same day
    // user in Tokyo: 15:01 UTC on the 5th = 00:01 JST next day
    const tokyoUser = baseProgram({ timezone: 'Asia/Tokyo', started_on: '2026-05-01' });
    const t = new Date('2026-05-06T15:01:00Z'); // 00:01 JST 2026-05-07
    const decision = reconcileProgram(tokyoUser, 4, t);
    expect(decision).toEqual({
      kind: 'reset',
      failedDay: 5,
      newStartedOn: '2026-05-07', // ← Tokyo's date, not UTC's 2026-05-06
    });
  });
});

describe('reconcileProgram — completion', () => {
  it('marks program complete when day 45 was 5/5 and a new local day begins', () => {
    const day45 = baseProgram({ current_day: 45, started_on: '2026-03-19' });
    const now = new Date('2026-05-03T08:00:00Z'); // 45 days after 2026-03-19 = 2026-05-03
    expect(reconcileProgram(day45, 5, now)).toEqual({ kind: 'complete' });
  });

  it('still resets if day 45 was incomplete', () => {
    const day45 = baseProgram({ current_day: 45, started_on: '2026-03-19' });
    const now = new Date('2026-05-03T08:00:00Z');
    expect(reconcileProgram(day45, 4, now)).toEqual({
      kind: 'reset',
      failedDay: 45,
      newStartedOn: '2026-05-03',
    });
  });

  it('day 45 same-day stays no-op even if 5/5 (user just finished and refreshes)', () => {
    const day45 = baseProgram({ current_day: 45, started_on: '2026-03-20' });
    const now = new Date('2026-05-03T08:00:00Z'); // expectedDay = 45 still
    expect(reconcileProgram(day45, 5, now)).toEqual({ kind: 'noop' });
  });
});

describe('reconcileProgram — terminal status', () => {
  it('no-op when status is completed', () => {
    const p = baseProgram({ status: 'completed' });
    const now = new Date('2026-06-01T00:00:00Z');
    expect(reconcileProgram(p, 0, now)).toEqual({ kind: 'noop' });
  });

  it('no-op when status is reset (waiting for user to begin again)', () => {
    const p = baseProgram({ status: 'reset' });
    const now = new Date('2026-06-01T00:00:00Z');
    expect(reconcileProgram(p, 5, now)).toEqual({ kind: 'noop' });
  });
});

describe('reconcileProgram — clock skew safety', () => {
  it('no-op when expectedDay < current_day (server clock behind, never reset)', () => {
    // current_day=5 but now is BEFORE started_on — should never advance/reset
    const p = baseProgram();
    const now = new Date('2026-04-30T08:00:00Z');
    expect(reconcileProgram(p, 0, now)).toEqual({ kind: 'noop' });
  });
});

describe('reconcileProgram — timezone edge cases (per CLAUDE.md §6)', () => {
  it('user in Tokyo crosses midnight before UTC: shows new day immediately', () => {
    // started 2026-05-01 in JST. current_day=1.
    // 14:55 UTC on the 1st = 23:55 JST, still day 1 — no-op.
    const tokyo = baseProgram({ current_day: 1, timezone: 'Asia/Tokyo', started_on: '2026-05-01' });
    const beforeMidnight = new Date('2026-05-01T14:55:00Z');
    expect(reconcileProgram(tokyo, 5, beforeMidnight)).toEqual({ kind: 'noop' });

    // 15:01 UTC = 00:01 JST on the 2nd → expectedDay=2, was 5/5 → advance.
    const afterMidnight = new Date('2026-05-01T15:01:00Z');
    expect(reconcileProgram(tokyo, 5, afterMidnight)).toEqual({ kind: 'advance', toDay: 2 });
  });

  it('user in Auckland (NZST=+12) advances 12h before a UTC user does', () => {
    const nz = baseProgram({ current_day: 7, timezone: 'Pacific/Auckland', started_on: '2026-05-01' });
    // 11:59 UTC = 23:59 NZST same day → expectedDay still 7 → noop
    const before = new Date('2026-05-07T11:59:00Z');
    expect(reconcileProgram(nz, 5, before)).toEqual({ kind: 'noop' });

    // 12:01 UTC = 00:01 NZST next day → expectedDay 8, 5/5 → advance
    const after = new Date('2026-05-07T12:01:00Z');
    expect(reconcileProgram(nz, 5, after)).toEqual({ kind: 'advance', toDay: 8 });
  });

  it("user in Honolulu (HST=-10) at 00:15 UTC still mid-day, cron must not reset them", () => {
    // CLAUDE.md §6: "A user in Pacific/Honolulu is left alone (still mid-day for them)."
    // started 2026-05-01 HST, current_day=3 → local day 3 = 2026-05-03.
    // Cron fires at 00:15 UTC on 2026-05-04 = 14:15 HST on 2026-05-03 → still day 3.
    const hawaii = baseProgram({
      current_day: 3,
      timezone: 'Pacific/Honolulu',
      started_on: '2026-05-01',
    });
    const cronAt0015Utc = new Date('2026-05-04T00:15:00Z');
    expect(reconcileProgram(hawaii, 0, cronAt0015Utc)).toEqual({ kind: 'noop' });
  });

  it('cron at 00:15 UTC correctly resets a Pacific/Auckland user 12h past their midnight', () => {
    // started 2026-05-01 NZST, current_day=3 → local day 3 = 2026-05-03.
    // 00:15 UTC on 2026-05-04 = 12:15 NZST on 2026-05-04 → expectedDay = 4.
    // If they didn't complete day 3 (count<5) → reset.
    const nz = baseProgram({
      current_day: 3,
      timezone: 'Pacific/Auckland',
      started_on: '2026-05-01',
    });
    const cronAt0015Utc = new Date('2026-05-04T00:15:00Z');
    expect(reconcileProgram(nz, 4, cronAt0015Utc)).toEqual({
      kind: 'reset',
      failedDay: 3,
      newStartedOn: '2026-05-04',
    });
  });
});
