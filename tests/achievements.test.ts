import { describe, it, expect } from 'vitest';
import { ACHIEVEMENT_DEFS, checkAchievements } from '../src/achievements.js';
import { createFreshState } from '../src/state.js';

describe('ACHIEVEMENT_DEFS', () => {
  it('has unique ids', () => {
    const ids = ACHIEVEMENT_DEFS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each has id, name, category, xpReward, and check function', () => {
    for (const def of ACHIEVEMENT_DEFS) {
      expect(typeof def.id).toBe('string');
      expect(typeof def.name).toBe('string');
      expect(typeof def.category).toBe('string');
      expect(typeof def.xpReward).toBe('number');
      expect(typeof def.check).toBe('function');
    }
  });
});

describe('checkAchievements', () => {
  it('returns newly unlocked achievements', () => {
    const state = createFreshState();
    state.totalToolUses = 1;
    const newlyUnlocked = checkAchievements(state, []);
    const firstTool = newlyUnlocked.find((a) => a.id === 'first_tool');
    expect(firstTool).toBeDefined();
  });

  it('does not return already unlocked achievements', () => {
    const state = createFreshState();
    state.totalToolUses = 1;
    const unlocked = [{ id: 'first_tool', unlockedAt: '2026-04-08' }];
    const newlyUnlocked = checkAchievements(state, unlocked);
    expect(newlyUnlocked.find((a) => a.id === 'first_tool')).toBeUndefined();
  });

  it('detects streak achievements', () => {
    const state = createFreshState();
    state.consecutiveDays = 7;
    const newlyUnlocked = checkAchievements(state, []);
    expect(newlyUnlocked.find((a) => a.id === 'streak_7')).toBeDefined();
  });
});
