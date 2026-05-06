-- HIBI 45 — explicit day completion
--
-- Adds programs.last_completed_day so that a day is "complete" only when
-- the user explicitly clicks "Mark day complete" in the UI, not merely
-- because the 5 challenge rows exist in `completions`.
--
-- This tightens the discipline rule from CLAUDE.md §6: a user who silently
-- checks off all five and forgets to acknowledge before midnight will be
-- reset, just like a user who only checked four. The 5/5 click is now the
-- act of closing the day.
--
-- Default 0 means "no day has been explicitly completed yet" — matches the
-- semantic for fresh programs (current_day=1, last_completed_day=0).
-- Existing programs at the time of migration will all start at 0 too;
-- they'll need to re-acknowledge their current day if they want to keep
-- their progress, otherwise the next reconcile will reset them. This is
-- acceptable for a small early user base, recorded here for traceability.

alter table public.programs
  add column last_completed_day int not null default 0
    check (last_completed_day between 0 and 45);

comment on column public.programs.last_completed_day is
  'The highest day_number the user has explicitly acknowledged via "Mark day complete". Reconcile compares this to current_day to decide advance vs reset at local midnight.';
