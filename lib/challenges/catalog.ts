/**
 * HIBI 45 — Challenge catalog
 *
 * 45 days × 5 challenges = 225 daily disciplines, hardcoded and identical
 * for every user. The order within a day is canonical and must not be shuffled:
 *   kokoro (心)  → karada (体)  → manabu (学)  → kaku (書)  → shoku (食)
 *
 * Difficulty curve:
 *   Days  1–10  Foundation  — gentle entry, build the rhythm
 *   Days 11–20  Habit       — consolidate, slight intensification
 *   Days 21–30  Discipline  — real effort, mid-program weight
 *   Days 31–40  Mastery     — peak intensity, deeper introspection
 *   Days 41–45  Integration — culmination, looking back, looking forward
 *
 * Milestone days (7, 14, 21, 28, 35, 40, 45) are slightly heavier and include
 * a reflective writing prompt.
 */

export type Category = 'kokoro' | 'karada' | 'manabu' | 'kaku' | 'shoku';

export const CATEGORIES: Record<Category, { kanji: string; label: string }> = {
  kokoro: { kanji: '心', label: 'Wellness & meditation' },
  karada: { kanji: '体', label: 'Sport & movement' },
  manabu: { kanji: '学', label: 'Reading & learning' },
  kaku:   { kanji: '書', label: 'Writing & creativity' },
  shoku:  { kanji: '食', label: 'Nutrition & hydration' },
};

export type Challenge = { category: Category; text: string };

/**
 * CHALLENGES[dayNumber - 1] returns the 5 challenges for that day,
 * in canonical category order.
 */
export const CHALLENGES: Challenge[][] = [
  /* ──────────────── Phase I — Foundation (Days 1–10) ──────────────── */

  /* Day 1 — The first stone */
  [
    { category: 'kokoro', text: '5 minutes of silent breathing' },
    { category: 'karada', text: 'A 15-minute walk outside' },
    { category: 'manabu', text: 'Read 5 pages of any book' },
    { category: 'kaku',   text: 'Write three lines about today' },
    { category: 'shoku',  text: 'Drink 1.5 liters of water' },
  ],

  /* Day 2 */
  [
    { category: 'kokoro', text: '5 minutes of silent breathing' },
    { category: 'karada', text: '20 minutes of walking' },
    { category: 'manabu', text: 'Read 5 pages' },
    { category: 'kaku',   text: 'Write three things you noticed today' },
    { category: 'shoku',  text: 'Drink 1.5 liters of water, no sweetened drinks' },
  ],

  /* Day 3 */
  [
    { category: 'kokoro', text: '5 minutes of silent breathing' },
    { category: 'karada', text: '20 minutes of walking, plus 10 push-ups (knees allowed)' },
    { category: 'manabu', text: 'Read 7 pages' },
    { category: 'kaku',   text: 'Write one paragraph in your journal' },
    { category: 'shoku',  text: 'Drink 1.7 liters of water' },
  ],

  /* Day 4 */
  [
    { category: 'kokoro', text: '7 minutes of seated meditation' },
    { category: 'karada', text: '25 minutes of movement (walk, run, or bike)' },
    { category: 'manabu', text: 'Read 8 pages' },
    { category: 'kaku',   text: 'Write three things you are grateful for' },
    { category: 'shoku',  text: 'Drink 1.7 liters of water, eat one whole fruit' },
  ],

  /* Day 5 */
  [
    { category: 'kokoro', text: '7 minutes of seated meditation' },
    { category: 'karada', text: '25 minutes of movement, plus 15 bodyweight squats' },
    { category: 'manabu', text: 'Read 10 pages' },
    { category: 'kaku',   text: 'Write a short letter to your future self (three to five lines)' },
    { category: 'shoku',  text: 'Drink 1.7 liters of water' },
  ],

  /* Day 6 */
  [
    { category: 'kokoro', text: '8 minutes of seated meditation' },
    { category: 'karada', text: '30 minutes of movement' },
    { category: 'manabu', text: 'Read 10 pages' },
    { category: 'kaku',   text: 'Write one quiet observation about someone you love' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* Day 7 — One week */
  [
    { category: 'kokoro', text: '10 minutes of seated meditation' },
    { category: 'karada', text: '30 minutes of movement, plus 15 squats and 10 push-ups' },
    { category: 'manabu', text: 'Read 10 pages' },
    { category: 'kaku',   text: 'Write one sentence summarizing each day of this week' },
    { category: 'shoku',  text: 'Drink 2 liters of water, no added sugar today' },
  ],

  /* Day 8 */
  [
    { category: 'kokoro', text: '10 minutes of seated meditation' },
    { category: 'karada', text: '30 minutes of movement' },
    { category: 'manabu', text: 'Read 12 pages' },
    { category: 'kaku',   text: 'Write three lines on what challenged you today' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* Day 9 */
  [
    { category: 'kokoro', text: '10 minutes of meditation, eyes closed, no music' },
    { category: 'karada', text: '35 minutes of movement' },
    { category: 'manabu', text: 'Read 12 pages' },
    { category: 'kaku',   text: 'Write a paragraph on a question that keeps returning to you' },
    { category: 'shoku',  text: 'Drink 2 liters of water, eat two servings of vegetables' },
  ],

  /* Day 10 — The threshold */
  [
    { category: 'kokoro', text: '10 minutes of seated meditation' },
    { category: 'karada', text: '35 minutes of movement, plus 20 squats and 15 push-ups' },
    { category: 'manabu', text: 'Read 15 pages' },
    { category: 'kaku',   text: 'Write a short reflection on your first ten days (five to seven lines)' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* ──────────────── Phase II — Habit (Days 11–20) ──────────────── */

  /* Day 11 */
  [
    { category: 'kokoro', text: '12 minutes of seated meditation' },
    { category: 'karada', text: '35 minutes of movement' },
    { category: 'manabu', text: 'Read 15 pages' },
    { category: 'kaku',   text: 'Write three lines stating your intention for today' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* Day 12 */
  [
    { category: 'kokoro', text: '12 minutes of seated meditation' },
    { category: 'karada', text: '35 minutes of movement, plus 20 squats' },
    { category: 'manabu', text: 'Read 15 pages' },
    { category: 'kaku',   text: 'Write one full paragraph in your journal' },
    { category: 'shoku',  text: 'Drink 2 liters of water, eat one whole fruit' },
  ],

  /* Day 13 */
  [
    { category: 'kokoro', text: '12 minutes of seated meditation' },
    { category: 'karada', text: '40 minutes of movement' },
    { category: 'manabu', text: 'Read 15 pages' },
    { category: 'kaku',   text: 'Learn one Japanese word and write what it evokes for you' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* Day 14 — Two weeks */
  [
    { category: 'kokoro', text: '15 minutes of seated meditation' },
    { category: 'karada', text: '45 minutes of movement, plus 25 squats and 15 push-ups' },
    { category: 'manabu', text: 'Read 20 pages' },
    { category: 'kaku',   text: 'Write a half-page reflection on your first two weeks' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, no added sugar today' },
  ],

  /* Day 15 */
  [
    { category: 'kokoro', text: '12 minutes of seated meditation' },
    { category: 'karada', text: '35 minutes of movement' },
    { category: 'manabu', text: 'Read 15 pages' },
    { category: 'kaku',   text: 'Write three lines on what brought you peace today' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* Day 16 */
  [
    { category: 'kokoro', text: '15 minutes of walking meditation' },
    { category: 'karada', text: '40 minutes of movement' },
    { category: 'manabu', text: 'Read 18 pages' },
    { category: 'kaku',   text: 'Write one paragraph about a place you love' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* Day 17 */
  [
    { category: 'kokoro', text: '15 minutes of seated meditation' },
    { category: 'karada', text: '40 minutes of movement, plus 20 push-ups' },
    { category: 'manabu', text: 'Read 18 pages' },
    { category: 'kaku',   text: 'Write a haiku (three lines, no syllable rule required)' },
    { category: 'shoku',  text: 'Drink 2 liters of water, two servings of vegetables' },
  ],

  /* Day 18 */
  [
    { category: 'kokoro', text: '15 minutes of seated meditation' },
    { category: 'karada', text: '45 minutes of movement' },
    { category: 'manabu', text: 'Read 20 pages' },
    { category: 'kaku',   text: 'Write one paragraph on a fear you are quietly carrying' },
    { category: 'shoku',  text: 'Drink 2 liters of water' },
  ],

  /* Day 19 */
  [
    { category: 'kokoro', text: '15 minutes of meditation, no music' },
    { category: 'karada', text: '45 minutes of movement, plus 25 squats' },
    { category: 'manabu', text: 'Read 20 pages' },
    { category: 'kaku',   text: 'Write three lines on what you would let go of' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 20 */
  [
    { category: 'kokoro', text: '15 minutes of seated meditation' },
    { category: 'karada', text: '45 minutes of movement' },
    { category: 'manabu', text: 'Read 20 pages' },
    { category: 'kaku',   text: 'Write a letter of thanks to someone — but do not send it' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, one fully plant-based meal' },
  ],

  /* ──────────────── Phase III — Discipline (Days 21–30) ──────────────── */

  /* Day 21 — Three weeks */
  [
    { category: 'kokoro', text: '18 minutes of seated meditation' },
    { category: 'karada', text: '50 minutes of movement, plus 30 squats and 20 push-ups' },
    { category: 'manabu', text: 'Read 22 pages' },
    { category: 'kaku',   text: 'Write a half-page on what has changed in three weeks' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, no processed food today' },
  ],

  /* Day 22 */
  [
    { category: 'kokoro', text: '15 minutes of seated meditation' },
    { category: 'karada', text: '45 minutes of movement' },
    { category: 'manabu', text: 'Read 20 pages' },
    { category: 'kaku',   text: 'Write three observations from your morning' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 23 */
  [
    { category: 'kokoro', text: '15 minutes of seated meditation' },
    { category: 'karada', text: '50 minutes of movement' },
    { category: 'manabu', text: 'Read 22 pages' },
    { category: 'kaku',   text: 'Write one paragraph on a memory that returned to you' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 24 */
  [
    { category: 'kokoro', text: '18 minutes of seated meditation' },
    { category: 'karada', text: '50 minutes of movement, plus 25 push-ups' },
    { category: 'manabu', text: 'Read 22 pages' },
    { category: 'kaku',   text: 'Write one full page in your journal' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, two servings of vegetables' },
  ],

  /* Day 25 */
  [
    { category: 'kokoro', text: '18 minutes of seated meditation' },
    { category: 'karada', text: '50 minutes of movement' },
    { category: 'manabu', text: 'Read 25 pages' },
    { category: 'kaku',   text: 'Write three things you are no longer afraid of' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 26 */
  [
    { category: 'kokoro', text: '18 minutes of seated meditation' },
    { category: 'karada', text: '50 minutes of movement, plus 30 squats' },
    { category: 'manabu', text: 'Read 25 pages' },
    { category: 'kaku',   text: 'Write a haiku about a small thing you saw today' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 27 */
  [
    { category: 'kokoro', text: '18 minutes of meditation, eyes closed, no music' },
    { category: 'karada', text: '55 minutes of movement' },
    { category: 'manabu', text: 'Read 25 pages' },
    { category: 'kaku',   text: 'Write one paragraph on a person who shaped you' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 28 — Four weeks */
  [
    { category: 'kokoro', text: '20 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement, plus 30 squats and 25 push-ups' },
    { category: 'manabu', text: 'Read 25 pages' },
    { category: 'kaku',   text: 'Write a half-page reflection on the past four weeks' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, no added sugar today' },
  ],

  /* Day 29 */
  [
    { category: 'kokoro', text: '18 minutes of seated meditation' },
    { category: 'karada', text: '50 minutes of movement' },
    { category: 'manabu', text: 'Read 25 pages' },
    { category: 'kaku',   text: 'Write three lines on what made you smile today' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 30 — Two thirds */
  [
    { category: 'kokoro', text: '20 minutes of seated meditation' },
    { category: 'karada', text: '55 minutes of movement, plus 30 push-ups' },
    { category: 'manabu', text: 'Read 28 pages' },
    { category: 'kaku',   text: 'Write a full page reflecting on the path so far' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, one fully plant-based meal' },
  ],

  /* ──────────────── Phase IV — Mastery (Days 31–40) ──────────────── */

  /* Day 31 */
  [
    { category: 'kokoro', text: '18 minutes of seated meditation' },
    { category: 'karada', text: '55 minutes of movement' },
    { category: 'manabu', text: 'Read 25 pages' },
    { category: 'kaku',   text: 'Write three lines on what you noticed in silence today' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 32 */
  [
    { category: 'kokoro', text: '20 minutes of seated meditation' },
    { category: 'karada', text: '55 minutes of movement, plus 30 squats' },
    { category: 'manabu', text: 'Read 28 pages' },
    { category: 'kaku',   text: 'Write one paragraph on what discipline now means to you' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 33 */
  [
    { category: 'kokoro', text: '20 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement' },
    { category: 'manabu', text: 'Read 28 pages' },
    { category: 'kaku',   text: 'Write a haiku on the changing season' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, two servings of vegetables' },
  ],

  /* Day 34 */
  [
    { category: 'kokoro', text: '20 minutes of seated meditation' },
    { category: 'karada', text: '55 minutes of movement, plus 30 push-ups' },
    { category: 'manabu', text: 'Read 28 pages' },
    { category: 'kaku',   text: 'Write one full page in your journal' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 35 — Five weeks */
  [
    { category: 'kokoro', text: '22 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement, plus 35 squats and 30 push-ups' },
    { category: 'manabu', text: 'Read 30 pages' },
    { category: 'kaku',   text: 'Write a half-page on what you have unlearned' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, no added sugar today' },
  ],

  /* Day 36 */
  [
    { category: 'kokoro', text: '20 minutes of seated meditation' },
    { category: 'karada', text: '55 minutes of movement' },
    { category: 'manabu', text: 'Read 28 pages' },
    { category: 'kaku',   text: 'Write three lines about a small joy' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 37 */
  [
    { category: 'kokoro', text: '20 minutes of walking meditation' },
    { category: 'karada', text: '60 minutes of movement' },
    { category: 'manabu', text: 'Read 30 pages' },
    { category: 'kaku',   text: 'Write one paragraph on what you would teach a younger self' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 38 */
  [
    { category: 'kokoro', text: '22 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement, plus 35 push-ups' },
    { category: 'manabu', text: 'Read 30 pages' },
    { category: 'kaku',   text: 'Write one full page in your journal' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, two servings of vegetables' },
  ],

  /* Day 39 */
  [
    { category: 'kokoro', text: '22 minutes of meditation, eyes closed, no music' },
    { category: 'karada', text: '60 minutes of movement' },
    { category: 'manabu', text: 'Read 30 pages' },
    { category: 'kaku',   text: 'Write three lines on a lesson the body taught the mind' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 40 — Six weeks */
  [
    { category: 'kokoro', text: '25 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement, plus 40 squats and 30 push-ups' },
    { category: 'manabu', text: 'Read 30 pages' },
    { category: 'kaku',   text: 'Write a half-page on the version of you that started this' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, no processed food today' },
  ],

  /* ──────────────── Phase V — Integration (Days 41–45) ──────────────── */

  /* Day 41 */
  [
    { category: 'kokoro', text: '22 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement' },
    { category: 'manabu', text: 'Read 30 pages' },
    { category: 'kaku',   text: 'Write one paragraph on what you carry differently now' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 42 */
  [
    { category: 'kokoro', text: '22 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement, plus 40 push-ups' },
    { category: 'manabu', text: 'Read 30 pages' },
    { category: 'kaku',   text: 'Write a haiku on patience' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 43 */
  [
    { category: 'kokoro', text: '25 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement' },
    { category: 'manabu', text: 'Read 32 pages' },
    { category: 'kaku',   text: 'Write a full page on what you wish to keep beyond this program' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water' },
  ],

  /* Day 44 */
  [
    { category: 'kokoro', text: '25 minutes of seated meditation' },
    { category: 'karada', text: '60 minutes of movement, plus 40 squats and 30 push-ups' },
    { category: 'manabu', text: 'Read 35 pages' },
    { category: 'kaku',   text: 'Write a letter to the person you were on Day 1' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, one fully plant-based meal' },
  ],

  /* Day 45 — The arrival */
  [
    { category: 'kokoro', text: '30 minutes of meditation in complete silence' },
    { category: 'karada', text: '75 minutes of movement of your choosing' },
    { category: 'manabu', text: 'Read 30 pages, then sit five minutes with the book closed' },
    { category: 'kaku',   text: 'Write a full reflection on the path you walked' },
    { category: 'shoku',  text: 'Drink 2.5 liters of water, eat the meal you have been waiting to share' },
  ],
];

// Sanity check — fail fast at build time if the catalog is malformed.
if (CHALLENGES.length !== 45) {
  throw new Error(`HIBI catalog must have 45 days, got ${CHALLENGES.length}`);
}
CHALLENGES.forEach((day, i) => {
  if (day.length !== 5) {
    throw new Error(`Day ${i + 1} must have 5 challenges, got ${day.length}`);
  }
  const expected: Category[] = ['kokoro', 'karada', 'manabu', 'kaku', 'shoku'];
  day.forEach((c, j) => {
    if (c.category !== expected[j]) {
      throw new Error(`Day ${i + 1} challenge ${j} must be ${expected[j]}, got ${c.category}`);
    }
  });
});