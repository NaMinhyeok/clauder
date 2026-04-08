import { describe, it, expect } from 'vitest';
import { rollRarity, rollCharacter, rollGacha } from '../src/gacha.js';
import { CHARACTERS } from '../src/characters.js';

describe('rollRarity', () => {
  it('returns a valid rarity', () => {
    for (let i = 0; i < 100; i++) {
      const rarity = rollRarity();
      expect(['common', 'rare', 'epic']).toContain(rarity);
    }
  });

  it('returns common for roll=0', () => {
    expect(rollRarity(0)).toBe('common');
  });

  it('returns common for roll=54', () => {
    expect(rollRarity(54)).toBe('common');
  });

  it('returns rare for roll=55', () => {
    expect(rollRarity(55)).toBe('rare');
  });

  it('returns rare for roll=89', () => {
    expect(rollRarity(89)).toBe('rare');
  });

  it('returns epic for roll=90', () => {
    expect(rollRarity(90)).toBe('epic');
  });

  it('returns epic for roll=99', () => {
    expect(rollRarity(99)).toBe('epic');
  });
});

describe('rollCharacter', () => {
  it('returns a valid character id', () => {
    const ids = CHARACTERS.map((c) => c.id);
    for (let i = 0; i < 50; i++) {
      expect(ids).toContain(rollCharacter());
    }
  });
});

describe('rollGacha', () => {
  it('returns characterId and rarity', () => {
    const result = rollGacha();
    expect(result).toHaveProperty('characterId');
    expect(result).toHaveProperty('rarity');
    expect(['common', 'rare', 'epic']).toContain(result.rarity);
  });
});
