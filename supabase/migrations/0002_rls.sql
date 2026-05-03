-- HIBI 45 — Row Level Security
-- Every table has RLS ON. A user can only ever read/write their own rows.
-- Inserts into `resets` are made server-side via the cron route using the
-- service role key, which bypasses RLS — so users only need SELECT here.

alter table public.programs    enable row level security;
alter table public.completions enable row level security;
alter table public.resets      enable row level security;

-- programs: full self-access
create policy "own program"
  on public.programs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- completions: full self-access (user toggles their own checkboxes)
create policy "own completions"
  on public.completions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- resets: read-only from the user's side. Inserts only via the cron with
-- the service role (which bypasses RLS).
create policy "own resets read"
  on public.resets
  for select
  using (auth.uid() = user_id);
