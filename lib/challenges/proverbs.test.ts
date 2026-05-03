import { describe, it, expect } from 'vitest';
import { PROVERBS } from './proverbs';

describe('proverbs invariants', () => {
  it('contains exactly 45 proverbs', () => {
    expect(PROVERBS).toHaveLength(45);
  });

  it('every proverb has non-empty jp, romaji, and en', () => {
    PROVERBS.forEach((p, i) => {
      expect(p.jp.trim().length, `day ${i + 1} jp`).toBeGreaterThan(0);
      expect(p.romaji.trim().length, `day ${i + 1} romaji`).toBeGreaterThan(0);
      expect(p.en.trim().length, `day ${i + 1} en`).toBeGreaterThan(0);
    });
  });

  it('Day 14 anchor is ichi-go ichi-e (per CLAUDE.md §5)', () => {
    const day14 = PROVERBS[13];
    expect(day14.romaji.toLowerCase()).toContain('ichi-go ichi-e');
    expect(day14.jp).toBe('一期一会');
  });

  it('Day 45 anchor is michi wo motomete yamazu (per CLAUDE.md §5)', () => {
    const day45 = PROVERBS[44];
    expect(day45.romaji.toLowerCase()).toContain('michi wo motomete yamazu');
  });
});
