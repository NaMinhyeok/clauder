import { describe, it, expect } from 'vitest';
import { CHARACTERS, getCharacter } from '../src/characters.js';
import type { Rarity, Condition } from '../src/constants.js';

const RARITIES: Rarity[] = ['common', 'rare', 'epic'];
const CONDITIONS: Condition[] = [1, 2, 3, 4, 5];

describe('CHARACTERS', () => {
  it('has exactly 6 characters', () => {
    expect(CHARACTERS).toHaveLength(6);
  });

  it('each character has unique id', () => {
    const ids = CHARACTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every character has art for all rarity × condition combos', () => {
    for (const char of CHARACTERS) {
      for (const rarity of RARITIES) {
        for (const cond of CONDITIONS) {
          const art = char.art[rarity][cond];
          expect(art.length).toBeGreaterThan(0);
          // 모든 줄의 너비가 동일해야 함 (정렬 보장)
          const widths = art.map((line) => [...line].length);
          expect(new Set(widths).size).toBe(1);
        }
      }
    }
  });
});

describe('getCharacter', () => {
  it('returns character by id', () => {
    const char = getCharacter('mochi');
    expect(char).toBeDefined();
    expect(char!.name).toBe('Mochi');
  });

  it('returns undefined for unknown id', () => {
    expect(getCharacter('unknown')).toBeUndefined();
  });
});
