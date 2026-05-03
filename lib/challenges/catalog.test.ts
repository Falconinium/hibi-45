import { describe, it, expect } from 'vitest';
import { CATEGORIES, CHALLENGES, type Category } from './catalog';

const CANONICAL_ORDER: Category[] = ['kokoro', 'karada', 'manabu', 'kaku', 'shoku'];

describe('catalog invariants', () => {
  it('declares the five canonical categories with kanji + label', () => {
    expect(Object.keys(CATEGORIES).sort()).toEqual([...CANONICAL_ORDER].sort());
    for (const key of CANONICAL_ORDER) {
      expect(CATEGORIES[key].kanji).toMatch(/^[一-鿿]$/);
      expect(CATEGORIES[key].label).toBeTruthy();
    }
  });

  it('contains exactly 45 days', () => {
    expect(CHALLENGES).toHaveLength(45);
  });

  it('each day has exactly 5 challenges in canonical category order', () => {
    CHALLENGES.forEach((day, i) => {
      expect(day, `day ${i + 1}`).toHaveLength(5);
      day.forEach((challenge, j) => {
        expect(challenge.category, `day ${i + 1} slot ${j}`).toBe(CANONICAL_ORDER[j]);
      });
    });
  });

  it('every challenge has non-empty text', () => {
    CHALLENGES.forEach((day, i) => {
      day.forEach((challenge, j) => {
        expect(challenge.text.trim().length, `day ${i + 1} slot ${j}`).toBeGreaterThan(0);
      });
    });
  });

  it('totals 225 challenges (45 × 5)', () => {
    const total = CHALLENGES.reduce((sum, day) => sum + day.length, 0);
    expect(total).toBe(225);
  });
});
