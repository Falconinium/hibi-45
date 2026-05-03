-- HIBI 45 — initial schema
-- Auth is handled by supabase.auth.users (managed by Supabase). We never
-- create or duplicate that table; we only reference it via foreign keys.

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- ──────────────────────────────────────────────────────────────────────────
-- programs: one row per user, their active 45-day program
-- ──────────────────────────────────────────────────────────────────────────
create table public.programs (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  started_on   date not null,                                 -- in user's local tz
  timezone     text not null,                                 -- IANA, e.g. "Europe/Paris"
  current_day  int  not null default 1 check (current_day between 1 and 45),
  status       text not null default 'active'
                 check (status in ('active', 'completed', 'reset')),
  reset_count  int  not null default 0 check (reset_count >= 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-bump updated_at on every UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger programs_set_updated_at
  before update on public.programs
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────────────
-- completions: one row per (user, day, challenge) checked off
-- Inserted lazily as the user checks them.
-- ──────────────────────────────────────────────────────────────────────────
create table public.completions (
  user_id          uuid not null references auth.users(id) on delete cascade,
  day_number       int  not null check (day_number between 1 and 45),
  challenge_index  int  not null check (challenge_index between 0 and 4),
  completed_at     timestamptz not null default now(),
  primary key (user_id, day_number, challenge_index)
);

create index completions_user_day_idx on public.completions (user_id, day_number);

-- ──────────────────────────────────────────────────────────────────────────
-- resets: audit log of program resets (missed-day or manual)
-- ──────────────────────────────────────────────────────────────────────────
create table public.resets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  failed_day  int  not null check (failed_day between 1 and 45),
  occurred_at timestamptz not null default now()
);

create index resets_user_idx on public.resets (user_id, occurred_at desc);
