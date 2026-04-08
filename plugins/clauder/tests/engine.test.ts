import { describe, it, expect } from 'vitest';
import { resolveToolStat, grantXp, calculateLevel, getTotalXp } from '../src/engine.js';
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
