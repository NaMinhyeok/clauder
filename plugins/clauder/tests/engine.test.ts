import { describe, it, expect } from 'vitest';
import { resolveToolStat, grantXp, calculateLevel, getTotalXp, getExpProgress } from '../src/engine.js';
import { createFreshState } from '../src/state.js';

describe('resolveToolStat', () => {
  it('maps Write to build +5', () => {
    expect(resolveToolStat('Write', {})).toEqual({ stat: 'build', xp: 5 });
  });

  it('maps Edit to build +3', () => {
    expect(resolveToolStat('Edit', {})).toEqual({ stat: 'build', xp: 3 });
  });

  it('maps Read to explore +2', () => {
    expect(resolveToolStat('Read', {})).toEqual({ stat: 'explore', xp: 2 });
  });

  it('maps Bash with test keyword to debug +5', () => {
    expect(resolveToolStat('Bash', { command: 'npm test' })).toEqual({ stat: 'debug', xp: 5 });
    expect(resolveToolStat('Bash', { command: 'npx vitest run' })).toEqual({ stat: 'debug', xp: 5 });
  });

  it('maps Bash with git push to deploy +3', () => {
    expect(resolveToolStat('Bash', { command: 'git push origin main' })).toEqual({ stat: 'deploy', xp: 3 });
    expect(resolveToolStat('Bash', { command: 'git commit -m "fix"' })).toEqual({ stat: 'deploy', xp: 3 });
  });

  it('maps Bash with no matching keyword to debug +2', () => {
    expect(resolveToolStat('Bash', { command: 'ls -la' })).toEqual({ stat: 'debug', xp: 2 });
  });

  it('maps unknown tool to lowest stat with +1', () => {
    const state = createFreshState();
    state.stats.think = 100;
    const result = resolveToolStat('SomeUnknownTool', {}, state);
    expect(result.xp).toBe(1);
    expect(result.stat).toBe('build');
  });
});

describe('grantXp', () => {
  it('adds xp to the correct stat with condition multiplier', () => {
    const state = createFreshState();
    state.condition = 5;
    const result = grantXp(state, 'build', 10);
    expect(result.stats.build).toBe(15);
  });

  it('applies condition 1 multiplier (x0.5)', () => {
    const state = createFreshState();
    state.condition = 1;
    const result = grantXp(state, 'explore', 10);
    expect(result.stats.explore).toBe(5);
  });

  it('increments totalToolUses and sessionToolUses', () => {
    const state = createFreshState();
    const result = grantXp(state, 'build', 5);
    expect(result.totalToolUses).toBe(1);
    expect(result.sessionToolUses).toBe(1);
  });
});

describe('getTotalXp', () => {
  it('sums all stat xp values', () => {
    const state = createFreshState();
    state.stats = { build: 10, explore: 20, debug: 30, deploy: 40, think: 50, speed: 60 };
    expect(getTotalXp(state)).toBe(210);
  });
});

describe('calculateLevel', () => {
  it('returns level 1 for 0 xp', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('returns level 2 for 100 xp', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('returns higher levels for more xp', () => {
    expect(calculateLevel(1000)).toBeGreaterThan(5);
  });
});

describe('getExpProgress', () => {
  it('returns 0 progress for fresh state at level 1 with 0 XP', () => {
    const progress = getExpProgress(0, 1);
    expect(progress.current).toBe(0);
    expect(progress.needed).toBe(100);
    expect(progress.ratio).toBe(0);
  });

  it('returns correct progress mid-level', () => {
    const progress = getExpProgress(50, 1);
    expect(progress.current).toBe(50);
    expect(progress.needed).toBe(100);
    expect(progress.ratio).toBe(0.5);
  });

  it('returns correct progress at higher levels', () => {
    // Level 1 needs 100 XP to reach level 2 (xpForNextLevel(1) = 100)
    // At level 2 with 150 total XP, current progress = 150 - 100 = 50
    // xpForNextLevel(2) = Math.round(100 * 1.15^2) = Math.round(132.25) = 132
    const progress = getExpProgress(150, 2);
    expect(progress.current).toBe(50);
    expect(progress.needed).toBe(132);
    expect(progress.ratio).toBeCloseTo(50 / 132);
  });
});
