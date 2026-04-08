import { describe, it, expect } from 'vitest';
import { renderBar, renderStatLine, renderCard, renderConditionStars } from '../src/display.js';

describe('renderBar', () => {
  it('renders a 10-char bar at 50%', () => {
    expect(renderBar(0.5, 10)).toBe('█████░░░░░');
  });

  it('renders a 10-char bar at 0%', () => {
    expect(renderBar(0, 10)).toBe('░░░░░░░░░░');
  });

  it('renders a 10-char bar at 100%', () => {
    expect(renderBar(1, 10)).toBe('██████████');
  });
});

describe('renderStatLine', () => {
  it('formats stat name, bar, percentage, and absolute value', () => {
    const line = renderStatLine('BUILD', 0.35, 3241);
    expect(line).toContain('BUILD');
    expect(line).toContain('35%');
    expect(line).toContain('3,241');
  });
});

describe('renderConditionStars', () => {
  it('renders 5 filled for condition 5', () => {
    expect(renderConditionStars(5)).toBe('★★★★★');
  });

  it('renders 3 filled and 2 empty for condition 3', () => {
    expect(renderConditionStars(3)).toBe('★★★☆☆');
  });
});

describe('renderCard', () => {
  it('contains class, level, condition, stats, and achievements', () => {
    const state = {
      version: 1,
      level: 45,
      stats: { build: 3241, explore: 890, debug: 1560, deploy: 2102, think: 612, speed: 340 },
      condition: 4,
      consecutiveDays: 12,
      lastSessionAt: null,
      totalToolUses: 500,
      sessionToolUses: 0,
      createdAt: '2026-01-01',
    };
    const card = renderCard(state, { achievementCount: 23, totalAchievements: 50 });
    expect(card).toContain('Lv.45');
    expect(card).toContain('12일');
    expect(card).toContain('BUILD');
    expect(card).toContain('23/50');
  });
});
