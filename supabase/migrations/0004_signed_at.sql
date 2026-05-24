-- HIBI 45 — signed contract timestamp
--
-- Adds programs.signed_at to record the moment a user signed the
-- engagement contract during sign-up. The signature itself (canvas
-- strokes) is NOT persisted — only the fact that it happened, with
-- its timestamp. Per intention: 'on n'enregistre pas la signature,
-- juste un boolean signed' — we go one step further with a timestamp
-- so the dashboard can later say "signed on May 24, 2026".
--
-- NULL means: pre-contract era (user signed up before this migration
-- shipped) OR user is mid-sign-up and hasn't signed yet. The sign-up
-- flow refuses to create the programs row without a signed_at value
-- from the sign-vow cookie, so post-migration accounts always have
-- a non-null value.

alter table public.programs
  add column signed_at timestamptz;

comment on column public.programs.signed_at is
  'The moment the user signed the engagement contract during sign-up. NULL for accounts created before the contract was introduced.';
