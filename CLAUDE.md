# CLAUDE.md — HIBI 45

> Project context for Claude Code. Read this first before any task on this codebase.

---

## 1. Project overview

**HIBI 45** (日々 — *day after day*) is a responsive web app — a 45-day daily-discipline challenge inspired by Japanese philosophy (*kaizen* = continuous improvement, *wabi-sabi* = quiet minimalism). The user signs up, starts the challenge, and must complete **5 daily challenges** every single day for 45 consecutive days. **Missing a day resets the program back to Day 1** (75 Hard-style strict mode).

The product surface is intentionally tiny: a landing page, an auth page (sign up / sign in), and a single post-auth page (the daily dashboard). That's it. The discipline of the design mirrors the discipline of the program.

**Visual identity:** strict monochrome dark mode. Pure black background, white text, no color whatsoever. Think *sumi* ink on a closed window at night. See §9.

**Language:** UI in English with Japanese decorative accents (kanji, occasional proverbs). No multilingual support in V1.

---

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router, Server Actions) | TypeScript strict mode |
| Hosting | **Vercel** | Edge runtime where possible |
| Database & Auth | **Supabase** (Postgres + Auth + RLS) | Email + password only in V1 |
| Styling | **TailwindCSS 4** + **shadcn/ui** | Strict monochrome dark theme (see §9) |
| Fonts | `next/font` — **EB Garamond** (serif), **Inter** (sans), **Noto Serif JP** (kanji) |
| Forms / validation | **react-hook-form** + **zod** |
| Date / time | **date-fns** + **date-fns-tz** | Critical — see §6 on timezones |
| Icons | **lucide-react** (thin variants) |
| State | React Server Components + Server Actions. No client state library. |
| Analytics | Vercel Analytics (V1), nothing else |

**Do not add:** Prisma, tRPC, Redux, Zustand, Framer Motion (CSS transitions only), or any UI lib other than shadcn. Keep dependencies brutally minimal.

---

## 3. Repository layout

```
app/
  (marketing)/
    page.tsx                # Landing
    layout.tsx
  (auth)/
    sign-in/page.tsx
    sign-up/page.tsx
    layout.tsx
  (app)/
    today/page.tsx          # The single post-auth page (daily dashboard)
    layout.tsx              # Auth-gated layout
  api/
    cron/check-failures/route.ts   # Daily cron via Vercel
  layout.tsx
  globals.css
components/
  ui/                       # shadcn primitives
  challenge-row.tsx
  day-header.tsx
  completion-card.tsx
  countdown.tsx
  hanko-stamp.tsx           # Inline SVG completion seal (white outline, kanji 完)
  proverb.tsx
lib/
  supabase/
    server.ts               # createServerClient
    client.ts               # createBrowserClient
    middleware.ts
  challenges/
    catalog.ts              # The 225 hardcoded challenges (45 days x 5)
    proverbs.ts             # 45 daily proverbs
  domain/
    program.ts              # currentDayFor(user), markChallenge(), checkFailure()
    timezone.ts             # User-tz aware day boundary helpers
  utils.ts
middleware.ts               # Auth redirects
supabase/
  migrations/
    0001_init.sql
    0002_rls.sql
```

---

## 4. Data model

Every table has Row Level Security ON. A user can only ever read/write their own rows.

```sql
-- Auth is handled by supabase.auth.users (managed table)

-- One row per user — their active program
create table public.programs (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  started_on     date not null,                 -- in user's local tz
  timezone       text not null,                 -- IANA, e.g. "Europe/Paris"
  current_day    int  not null default 1,       -- 1..45
  status         text not null default 'active',-- 'active' | 'completed' | 'reset'
  reset_count    int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- One row per (user, day_number, challenge_index)
-- Inserted lazily as the user checks them off
create table public.completions (
  user_id          uuid not null references auth.users(id) on delete cascade,
  day_number       int  not null check (day_number between 1 and 45),
  challenge_index  int  not null check (challenge_index between 0 and 4),
  completed_at     timestamptz not null default now(),
  primary key (user_id, day_number, challenge_index)
);

create index on public.completions (user_id, day_number);

-- Audit log for resets (for stats / "you've reset N times" empathy)
create table public.resets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  failed_day  int  not null,
  occurred_at timestamptz not null default now()
);
```

RLS policies (write in `0002_rls.sql`):

```sql
alter table programs    enable row level security;
alter table completions enable row level security;
alter table resets      enable row level security;

create policy "own program"      on programs    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own completions"  on completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own resets"       on resets      for select using (auth.uid() = user_id);
-- inserts into resets only happen via the cron with the service role
```

---

## 5. Challenge catalog & proverbs (source of truth)

The full content of the program is **already authored** and lives in two TypeScript files. **Do not invent, paraphrase, generate, or "improve" any challenge or proverb.** These files are the canonical source — copy them in as-is.

### `lib/challenges/catalog.ts`

Contains the 5 categories, their kanji, and the **225 hardcoded challenges** (45 days × 5). Difficulty follows a deliberate five-phase curve (Foundation → Habit → Discipline → Mastery → Integration). Milestone days (7, 14, 21, 28, 35, 40, 45) are slightly heavier and include a reflective writing prompt.

The file exports:

```ts
export type Category = 'kokoro' | 'karada' | 'manabu' | 'kaku' | 'shoku';

export const CATEGORIES: Record<Category, { kanji: string; label: string }>;
//   kokoro 心  Wellness & meditation
//   karada 体  Sport & movement
//   manabu 学  Reading & learning
//   kaku   書  Writing & creativity
//   shoku  食  Nutrition & hydration

export type Challenge = { category: Category; text: string };

export const CHALLENGES: Challenge[][];   // CHALLENGES[dayNumber - 1] → 5 challenges
```

The file ships with **runtime sanity checks** that throw at import time if anyone breaks the invariant (45 days, 5 challenges each, in canonical category order). Do not remove these checks.

### `lib/challenges/proverbs.ts`

Contains **45 authentic Japanese kotowaza** (one per day), each with original Japanese, romaji reading, and English translation. Every proverb is a real traditional saying, classical citation (Bashō, Dōgen, the Hagakure), or core Zen concept — none are invented. The Day 14 proverb (*ichi-go ichi-e*) and the Day 45 proverb (*michi wo motomete yamazu*) are deliberate anchors and must not be moved.

The file exports:

```ts
export type Proverb = { jp: string; romaji: string; en: string };
export const PROVERBS: Proverb[];   // PROVERBS[dayNumber - 1] → proverb of the day
```

### Rendering rules

- Challenges are always rendered in the canonical category order (kokoro → karada → manabu → kaku → shoku). Never shuffle.
- The proverb is shown above the challenge list, in serif italic. The English translation is the primary line; the Japanese (`jp`) is shown small beneath it; romaji is hover/tap-to-reveal only — do not display it inline in V1.
- Both files are pure data. They have no runtime dependencies and must remain server-importable from anywhere in the app.

### How to make changes

If a challenge needs to be edited (e.g. accessibility concern, factual fix), edit it **in `catalog.ts` directly and add a one-line PR justification**. Do not work around the catalog with overrides, feature flags, or per-user variants — that path leads to scope creep we explicitly rejected (see §12).

---

## 6. The day-boundary problem (read carefully)

This is the trickiest part of the codebase. Mistakes here cause unfair resets.

**Definitions:**
- A user's **"today"** is determined by **their stored timezone** (set at sign-up via browser's `Intl.DateTimeFormat().resolvedOptions().timeZone`).
- **Local midnight** in the user's tz is the day boundary.
- A program's `current_day` advances when the local-midnight rolls over **AND** the previous day was completed (5/5).
- If local midnight rolls over and the previous day was **not** 5/5 → the program resets: `current_day = 1`, `started_on = today`, `reset_count++`, log a row in `resets`.

**Implementation:**
- All day-math lives in `lib/domain/timezone.ts` and `lib/domain/program.ts`. No `Date` arithmetic in components.
- On every page load of `/today`, server-side, run `reconcileProgram(userId)`:
  1. Fetch program + today's completions.
  2. Compute `expectedDay = differenceInCalendarDays(localToday, started_on, tz) + 1`.
  3. If `expectedDay > current_day + 1` → user skipped at least one day → **reset**.
  4. If `expectedDay === current_day + 1` → check yesterday's completions. If 5/5 → advance. Else → **reset**.
  5. If `expectedDay === current_day` → no-op.
  6. If `expectedDay > 45` and last day was 5/5 → mark `status = 'completed'`.
- Also run a **Vercel cron daily at 00:15 UTC** (`/api/cron/check-failures`) that reconciles every active program. This catches users who don't open the app — without it, an inactive user who failed day 7 would still see "Day 7" when they returned a month later.
- Cron uses the Supabase **service role** key (server-side only — never expose).

**Test cases that MUST pass:**
- User in `Asia/Tokyo` checks 5/5 at 23:55 JST → at 00:01 JST next day, server-rendered `/today` shows the new day.
- User crosses an actual timezone (flies LAX → CDG mid-program) → tz remains the originally chosen one; we do not auto-update tz mid-program (would be exploitable).
- Cron runs at 00:15 UTC: a user in `Pacific/Auckland` who already crossed midnight 12 hours earlier is correctly reset/advanced. A user in `Pacific/Honolulu` is left alone (still mid-day for them).

---

## 7. Server actions (the entire write API)

Keep the API surface small — three actions cover everything.

```ts
// app/(app)/today/actions.ts
'use server';

export async function startProgram(): Promise<void>
// Creates the program row. Sets timezone from the request header / form value.
// Idempotent: if a program exists, throws.

export async function toggleChallenge(dayNumber: number, challengeIndex: number): Promise<void>
// Inserts or deletes a row in `completions`.
// MUST validate that dayNumber === program.current_day (no editing past or future days).
// MUST first call reconcileProgram(userId).

export async function resetProgram(): Promise<void>
// Manual reset (user gives up). Same effect as a missed-day reset but user-triggered.
```

Auth is enforced by reading `auth.uid()` server-side via the Supabase server client. Never trust a `userId` passed from the client.

---

## 8. UX rules (do not violate)

- **The dashboard at `/today` is the only authenticated route.** No settings page, no history page, no profile page in V1. If we need them later we'll add them — for now resist scope creep.
- **Mobile-first**, designed for 375px. Test every view at that width.
- **No toasts, no modals, no popups** for normal interactions. Checking a challenge is silent — the circle fills, that's it. The completion card replaces the dashboard when 5/5 is reached.
- **One reset modal exists** — the dignified one shown after a missed-day reset, on next sign-in. Copy is in `components/reset-card.tsx`.
- **Animations:** CSS transitions only, max 300ms, ease-out. No bouncing, no springs, no confetti. The hanko stamp uses a single 400ms scale + opacity transition (white-on-black "ink press" feel).
- **No emoji in the UI.** Use kanji or thin Lucide icons.
- **Numbers are tabular** — `font-variant-numeric: tabular-nums` on countdown and day counters.

---

## 9. Design tokens — strict monochrome dark mode

The entire app is **black and white only**. No vermilion, no beige, no accent colors. The screen is the closed window at night; the text is the lamp inside. Every removed hue makes the design stronger.

This is a **dark-mode-only** app — no light theme, no theme toggle. The `<html>` element ships with `class="dark"` hardcoded, and `prefers-color-scheme` is ignored.

Configured in `tailwind.config.ts` and `app/globals.css`:

```css
:root {
  --color-sumi:     #0A0A0A;  /* Background. Near-black, the deep of sumi ink */
  --color-paper:    #F5F5F5;  /* Primary text. Off-white, never pure #FFF */
  --color-stone:    #8A8A8A;  /* Secondary text, metadata, romaji */
  --color-charcoal: #141414;  /* Subtly elevated surfaces (very rarely used) */
  --color-line:     #2A2A2A;  /* Hairline dividers, 1px borders */
  --color-chalk:    #FFFFFF;  /* High-contrast accents only — see below */
}

html, body {
  background: var(--color-sumi);
  color: var(--color-paper);
}
```

### Allowed uses of each token

| Token | Allowed for |
|---|---|
| `--color-sumi`     | Page background. Card backgrounds. Modal overlays at 90% opacity over sumi. |
| `--color-paper`    | All body text, headings, button labels, kanji glyphs in default state. |
| `--color-stone`    | Day metadata, romaji readings, the proverb's Japanese line, "X / 5" counter, footer. |
| `--color-charcoal` | Hover state on rows. Pressed state on buttons. **Never** as a background card surface — we want flat, not layered. |
| `--color-line`     | Every divider, every checkbox border, every hairline rule. Always exactly 1px. |
| `--color-chalk`    | The filled-checkbox interior. The hanko stamp's outline + kanji 完. The current day's number on the dashboard. **Nothing else.** |

### Forbidden

- Any color other than the six tokens above.
- Box-shadows of any kind.
- Gradients of any kind.
- Border-radius greater than `rounded-sm` (2px), except the hanko stamp (a full circle).
- Background images, glassmorphism, blur effects, glow effects.
- Pure `#FFFFFF` text on `#000000` background — too harsh. Use `--color-paper` on `--color-sumi`.

### Typography in dark mode

The serif (EB Garamond) renders thin on dark backgrounds — **use Regular weight as the minimum** for body copy at small sizes; reserve Light weight for display sizes (40px+). Kanji glyphs (Noto Serif JP) should always be Regular, never Light, for legibility on `--color-sumi`.

### The hanko stamp in B&W

Originally conceived in vermilion red, the hanko is now a **white circular stamp**: a 1.5px white outline, the kanji 完 inside in white serif, on the `--color-sumi` background. The "ink stamp" feel comes from a subtle 4–6% noise texture inside the circle and a tiny intentional rotation (~−3°). Asymmetry makes it feel hand-pressed rather than printed.

---

## 10. Auth flow

- Supabase Auth, **email + password only**.
- Sign-up form captures email, password, and silently captures `Intl.DateTimeFormat().resolvedOptions().timeZone` to pass into `startProgram()`.
- Email confirmation **enabled** (Supabase default). Use a custom email template with the wabi-sabi voice.
- `middleware.ts` redirects:
  - Unauthenticated user hitting `/today` → `/sign-in`.
  - Authenticated user hitting `/sign-in` or `/sign-up` → `/today`.
  - Authenticated user with no `programs` row → trigger `startProgram()` server-side then continue to `/today`.

---

## 11. Conventions for Claude Code

When working on this codebase:

1. **Prefer Server Components and Server Actions.** Only mark `'use client'` when you need interactivity (the challenge checkboxes, the countdown timer).
2. **All Supabase calls go through `lib/supabase/server.ts` or `client.ts`.** Never instantiate Supabase clients ad-hoc in components.
3. **Never put business logic in components.** Day reconciliation, reset detection, completion counting all live in `lib/domain/`.
4. **Add a unit test** (Vitest) for any function in `lib/domain/`. Timezone math is too easy to break silently.
5. **No new dependencies without justification.** If you reach for one, justify it in the PR description.
6. **Run `pnpm typecheck && pnpm lint && pnpm test` before declaring a task done.**
7. **Migrations are append-only.** Never edit a migration that has shipped. Add a new one.
8. **Secrets:** `SUPABASE_SERVICE_ROLE_KEY` is server-only and used solely by the cron route. Public env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 12. Out of scope for V1 (do not build)

- Social sharing / share cards
- Push notifications
- Stats / history / charts
- Leaderboards
- Custom challenges / personalization
- Multiple languages
- Mobile native app
- Streak freezes / cheat days
- Payments / premium tier

These may come in V2. For now: **landing → auth → one page → 45 days of discipline**. That is the entire product.

---

## 13. Voice & copy

Every string in the UI should sound like it was written by someone who reads quietly and means what they say. Examples:

- Button labels: `Begin the path`, `Sign in`, `Begin again` (after a reset). Not `Get Started!` or `Let's go!`.
- Empty states: `Nothing yet. The day is open.`
- Errors: `That didn't work. Try once more.` (no error codes, no exclamation marks)
- The proverbs and the completion card carry the warmth — the rest of the UI stays quiet.