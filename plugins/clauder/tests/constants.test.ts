import { describe, it, expect } from 'vitest';
import {
  STAT_NAMES,
  TOOL_STAT_MAP,
  BASH_KEYWORDS,
  SPEED_THRESHOLDS,
  CONDITION_MULTIPLIERS,
  CLASSES,
  EVOLUTION_STAGES,
  xpForNextLevel,
  RARITY_WEIGHTS,
} from '../src/constants.js';

describe('constants', () => {
  it('defines 6 stat names', () => {
    expect(STAT_NAMES).toEqual(['build', 'explore', 'debug', 'deploy', 'think', 'speed']);
  });

  it('maps tools to stats', () => {
    expect(TOOL_STAT_MAP.Write).toEqual({ stat: 'build', xp: 5 });
    expect(TOOL_STAT_MAP.Edit).toEqual({ stat: 'build', xp: 3 });
    expect(TOOL_STAT_MAP.Read).toEqual({ stat: 'explore', xp: 2 });
    expect(TOOL_STAT_MAP.Grep).toEqual({ stat: 'explore', xp: 3 });
    expect(TOOL_STAT_MAP.Glob).toEqual({ stat: 'explore', xp: 1 });
    expect(TOOL_STAT_MAP.Agent).toEqual({ stat: 'think', xp: 5 });
  });

  it('defines bash keyword patterns for debug and deploy', () => {
    expect(BASH_KEYWORDS.debug).toContain('test');
    expect(BASH_KEYWORDS.debug).toContain('jest');
    expect(BASH_KEYWORDS.deploy).toContain('git commit');
    expect(BASH_KEYWORDS.deploy).toContain('git push');
  });

  it('calculates xp for next level with exponential scaling', () => {
    expect(xpForNextLevel(1)).toBe(100);
    expect(xpForNextLevel(10)).toBe(405);
    expect(xpForNextLevel(20)).toBe(1637);
  });

  it('defines condition multipliers from 1 to 5', () => {
    expect(CONDITION_MULTIPLIERS[1]).toBe(0.5);
    expect(CONDITION_MULTIPLIERS[3]).toBe(1.0);
    expect(CONDITION_MULTIPLIERS[5]).toBe(1.5);
  });

  it('defines 6 classes keyed by stat name', () => {
    expect(CLASSES.build.name).toBe('Architect');
    expect(CLASSES.explore.name).toBe('Explorer');
    expect(CLASSES.debug.name).toBe('Mechanic');
    expect(CLASSES.deploy.name).toBe('Operator');
    expect(CLASSES.think.name).toBe('Strategist');
    expect(CLASSES.speed.name).toBe('Sprinter');
  });

  it('defines 4 evolution stages', () => {
    expect(EVOLUTION_STAGES).toHaveLength(4);
    expect(EVOLUTION_STAGES[0]).toEqual({ minLevel: 1, maxLevel: 9, name: 'Apprentice', emoji: '🥚' });
    expect(EVOLUTION_STAGES[3]).toEqual({ minLevel: 40, maxLevel: Infinity, name: 'Master', emoji: '👑' });
  });
});

describe('RARITY_WEIGHTS', () => {
  it('weights sum to 100', () => {
    const total = RARITY_WEIGHTS.reduce((sum, r) => sum + r.weight, 0);
    expect(total).toBe(100);
  });

  it('has 3 rarities: common, rare, epic', () => {
    const ids = RARITY_WEIGHTS.map((r) => r.id);
    expect(ids).toEqual(['common', 'rare', 'epic']);
  });
});
