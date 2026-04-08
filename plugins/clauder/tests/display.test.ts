import { describe, it, expect } from 'vitest';
import { renderBar, renderExpBar, renderCard } from '../src/display.js';

describe('renderBar', () => {
  it('renders a 12-char bar at 50%', () => {
    expect(renderBar(0.5, 12)).toBe('██████░░░░░░');
  });

  it('renders a 12-char bar at 0%', () => {
    expect(renderBar(0, 12)).toBe('░░░░░░░░░░░░');
  });

  it('renders a 12-char bar at 100%', () => {
    expect(renderBar(1, 12)).toBe('████████████');
  });
});

describe('renderExpBar', () => {
  it('formats EXP bar with percentage and absolute values', () => {
    const bar = renderExpBar(50, 100);
    expect(bar).toContain('EXP');
    expect(bar).toContain('50%');
    expect(bar).toContain('50');
    expect(bar).toContain('100');
  });
});

describe('renderCard', () => {
  it('contains ASCII art, character name, rarity, level, EXP bar, achievements', () => {
    const state = {
      version: 2,
      level: 15,
      stats: { build: 500, explore: 300, debug: 200, deploy: 150, think: 100, speed: 50 },
      condition: 5 as const,
      consecutiveDays: 7,
      lastSessionAt: null,
      totalToolUses: 500,
      sessionToolUses: 0,
      createdAt: '2026-01-01',
      characterId: 'mochi',
      rarity: 'rare' as const,
    };
    const card = renderCard(state, { achievementCount: 5, totalAchievements: 15 });
    expect(card).toContain('Mochi');
    expect(card).toContain('★★☆');
    expect(card).toContain('Rare');
    expect(card).toContain('Lv.15');
    expect(card).toContain('EXP');
    expect(card).toContain('5/15');
    expect(card).toContain('┌');  // rare border
  });

  it('does not contain stat bars', () => {
    const state = {
      version: 2,
      level: 15,
      stats: { build: 500, explore: 300, debug: 200, deploy: 150, think: 100, speed: 50 },
      condition: 3 as const,
      consecutiveDays: 7,
      lastSessionAt: null,
      totalToolUses: 500,
      sessionToolUses: 0,
      createdAt: '2026-01-01',
      characterId: 'mochi',
      rarity: 'common' as const,
    };
    const card = renderCard(state);
    expect(card).not.toContain('BUILD');
    expect(card).not.toContain('EXPLORE');
  });

  it('shows different face for low condition', () => {
    const state = {
      version: 2,
      level: 1,
      stats: { build: 0, explore: 0, debug: 0, deploy: 0, think: 0, speed: 0 },
      condition: 1 as const,
      consecutiveDays: 0,
      lastSessionAt: null,
      totalToolUses: 0,
      sessionToolUses: 0,
      createdAt: '2026-01-01',
      characterId: 'mochi',
      rarity: 'common' as const,
    };
    const card = renderCard(state);
    expect(card).toContain(';');  // sad face has semicolons
  });
});
